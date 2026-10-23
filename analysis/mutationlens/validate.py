"""Sequence validation and cleaning."""

STANDARD_AA = frozenset("ACDEFGHIKLMNPQRSTVWY")
AMBIGUOUS_AA = frozenset("BXZUOJ")


class SequenceValidationError(ValueError):
    """Raised when a protein sequence is empty or contains invalid characters."""


def clean_sequence(raw: str) -> str:
    """Strip FASTA header, whitespace and digits, then uppercase.

    Accepts plain sequences or FASTA text. Only the first record is used.
    """
    if raw is None:
        raise SequenceValidationError("Sequence is missing.")
    lines = [ln.strip() for ln in str(raw).splitlines() if ln.strip()]
    if lines and lines[0].startswith(">"):
        lines = lines[1:]
    for i, ln in enumerate(lines):
        if ln.startswith(">"):
            lines = lines[:i]
            break
    joined = "".join(lines)
    return "".join(ch for ch in joined if not ch.isspace() and not ch.isdigit()).upper()


def validate_sequence(raw: str, allow_ambiguous: bool = False) -> str:
    """Return the cleaned sequence or raise SequenceValidationError."""
    seq = clean_sequence(raw)
    if not seq:
        raise SequenceValidationError("Sequence is empty.")
    allowed = STANDARD_AA | AMBIGUOUS_AA if allow_ambiguous else STANDARD_AA
    bad = sorted({ch for ch in seq if ch not in allowed})
    if bad:
        raise SequenceValidationError(
            f"Invalid amino-acid characters: {', '.join(bad)}"
        )
    return seq