"""Reference vs variant sequence comparison.

Positions are 1-based and refer to the reference sequence as given.
Always confirm numbering against the source record (e.g. UniProt counts Met1).
"""

import re
from typing import Any

from Bio import Align
from Bio.Align import substitution_matrices

from .residues import compare_residues
from .validate import validate_sequence

_VARIANT_RE = re.compile(r"^([A-Za-z])(\d+)([A-Za-z])$")


def parse_variant(label: str) -> tuple[str, int, str]:
    """Parse a one-letter substitution like 'E7V' into ('E', 7, 'V')."""
    m = _VARIANT_RE.match((label or "").strip())
    if not m:
        raise ValueError(f"Invalid variant label: {label!r} (expected like 'E7V')")
    ref, pos, alt = m.group(1).upper(), int(m.group(2)), m.group(3).upper()
    if pos < 1:
        raise ValueError("Position must be 1 or greater.")
    return ref, pos, alt


def apply_substitution(reference: str, label: str) -> str:
    """Build a variant sequence from a reference and a label like 'E7V'.

    Raises ValueError if the position is out of range or the reference
    residue at that position does not match the label.
    """
    seq = validate_sequence(reference)
    ref_aa, pos, alt_aa = parse_variant(label)
    if pos > len(seq):
        raise ValueError(f"Position {pos} is beyond sequence length {len(seq)}.")
    if seq[pos - 1] != ref_aa:
        raise ValueError(
            f"Reference has {seq[pos - 1]} at position {pos}, label expects {ref_aa}."
        )
    return seq[: pos - 1] + alt_aa + seq[pos:]


def _aligner() -> Align.PairwiseAligner:
    aligner = Align.PairwiseAligner()
    aligner.mode = "global"
    aligner.substitution_matrix = substitution_matrices.load("BLOSUM62")
    aligner.open_gap_score = -10
    aligner.extend_gap_score = -0.5
    return aligner


def _substitution(pos: int, ref_aa: str, var_aa: str) -> dict[str, Any]:
    return {
        "position": pos,
        "refAa": ref_aa,
        "varAa": var_aa,
        "label": f"{ref_aa}{pos}{var_aa}",
        "properties": compare_residues(ref_aa, var_aa),
    }


def _deletion(ref: str, start0: int, end0: int) -> dict[str, Any]:
    return {
        "startPosition": start0 + 1,
        "endPosition": end0,
        "sequence": ref[start0:end0],
        "length": end0 - start0,
    }


def _insertion(var: str, start0: int, end0: int, after: int) -> dict[str, Any]:
    return {
        "afterPosition": after,
        "sequence": var[start0:end0],
        "length": end0 - start0,
    }


def compare_sequences(reference: str, variant: str) -> dict[str, Any]:
    """Compare a reference and a variant sequence.

    Equal lengths -> position-by-position comparison.
    Different lengths -> global alignment (BLOSUM62) to find indels.
    """
    ref = validate_sequence(reference)
    var = validate_sequence(variant)

    substitutions: list[dict[str, Any]] = []
    insertions: list[dict[str, Any]] = []
    deletions: list[dict[str, Any]] = []
    matches = 0

    if len(ref) == len(var):
        method = "positional"
        for i, (a, b) in enumerate(zip(ref, var), start=1):
            if a == b:
                matches += 1
            else:
                substitutions.append(_substitution(i, a, b))
    else:
        method = "global_alignment"
        aln = _aligner().align(ref, var)[0]
        r_blocks, v_blocks = aln.aligned
        prev_r_end, prev_v_end = 0, 0
        for (rs, re_), (vs, ve) in zip(r_blocks, v_blocks):
            rs, re_, vs, ve = int(rs), int(re_), int(vs), int(ve)  # numpy ints -> plain ints
            if rs > prev_r_end:
                deletions.append(_deletion(ref, prev_r_end, rs))
            if vs > prev_v_end:
                insertions.append(_insertion(var, prev_v_end, vs, after=rs))
            for k in range(re_ - rs):
                a, b = ref[rs + k], var[vs + k]
                if a == b:
                    matches += 1
                else:
                    substitutions.append(_substitution(rs + k + 1, a, b))
            prev_r_end, prev_v_end = re_, ve
        if prev_r_end < len(ref):
            deletions.append(_deletion(ref, prev_r_end, len(ref)))
        if prev_v_end < len(var):
            insertions.append(_insertion(var, prev_v_end, len(var), after=len(ref)))

    longest = max(len(ref), len(var))
    return {
        "method": method,
        "referenceLength": len(ref),
        "variantLength": len(var),
        "identical": ref == var,
        "substitutions": substitutions,
        "insertions": insertions,
        "deletions": deletions,
        "summary": {
            "substitutionCount": len(substitutions),
            "insertionCount": len(insertions),
            "deletionCount": len(deletions),
            "identityPercent": round(100 * matches / longest, 2),
        },
        "source": "calculated",
    }