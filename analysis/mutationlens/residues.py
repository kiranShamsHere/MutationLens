"""Amino-acid reference data and simple, clearly labelled properties.

Hydropathy uses the Kyte-Doolittle scale. Charge is approximate at pH ~7.
These are textbook reference values, not predictions of functional effect.
"""

from typing import Any

# one-letter: (name, three-letter, Kyte-Doolittle hydropathy, class, approx. charge at pH 7)
_AA = {
    "A": ("Alanine", "Ala", 1.8, "nonpolar", 0),
    "R": ("Arginine", "Arg", -4.5, "positive", 1),
    "N": ("Asparagine", "Asn", -3.5, "polar", 0),
    "D": ("Aspartate", "Asp", -3.5, "negative", -1),
    "C": ("Cysteine", "Cys", 2.5, "polar", 0),
    "Q": ("Glutamine", "Gln", -3.5, "polar", 0),
    "E": ("Glutamate", "Glu", -3.5, "negative", -1),
    "G": ("Glycine", "Gly", -0.4, "nonpolar", 0),
    "H": ("Histidine", "His", -3.2, "positive", 0),
    "I": ("Isoleucine", "Ile", 4.5, "nonpolar", 0),
    "L": ("Leucine", "Leu", 3.8, "nonpolar", 0),
    "K": ("Lysine", "Lys", -3.9, "positive", 1),
    "M": ("Methionine", "Met", 1.9, "nonpolar", 0),
    "F": ("Phenylalanine", "Phe", 2.8, "aromatic", 0),
    "P": ("Proline", "Pro", -1.6, "nonpolar", 0),
    "S": ("Serine", "Ser", -0.8, "polar", 0),
    "T": ("Threonine", "Thr", -0.7, "polar", 0),
    "W": ("Tryptophan", "Trp", -0.9, "aromatic", 0),
    "Y": ("Tyrosine", "Tyr", -1.3, "aromatic", 0),
    "V": ("Valine", "Val", 4.2, "nonpolar", 0),
}

AMINO_ACIDS: dict[str, dict[str, Any]] = {
    code: {
        "code": code,
        "name": name,
        "threeLetter": three,
        "hydropathy": kd,
        "class": cls,
        "charge": charge,
    }
    for code, (name, three, kd, cls, charge) in _AA.items()
}

PROPERTY_NOTE = (
    "Calculated from standard reference tables (Kyte-Doolittle hydropathy, "
    "approximate charge at pH 7). Not evidence of functional effect."
)


def describe_residue(code: str, position: int | None = None) -> dict[str, Any]:
    """Return properties for one amino acid (optionally with its position)."""
    key = (code or "").upper()
    if key not in AMINO_ACIDS:
        raise ValueError(f"Unknown amino acid: {code!r}")
    info = dict(AMINO_ACIDS[key])
    if position is not None:
        info["position"] = position
    return info


def compare_residues(ref: str, var: str) -> dict[str, Any]:
    """Compare two amino acids by simple reference properties."""
    a, b = describe_residue(ref), describe_residue(var)
    return {
        "classChanged": a["class"] != b["class"],
        "fromClass": a["class"],
        "toClass": b["class"],
        "chargeChange": b["charge"] - a["charge"],
        "hydropathyChange": round(b["hydropathy"] - a["hydropathy"], 2),
        "source": "calculated",
        "note": PROPERTY_NOTE,
    }