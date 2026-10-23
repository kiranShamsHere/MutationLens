"""Build example JSON files from a real UniProt record.

Usage (from the analysis folder, venv active):
    python -m mutationlens.examples P68871 E7V --display-label E6V

The label uses UniProt numbering (Met1 = position 1). Use --display-label
if papers number it differently. Structure fields stay unverified here.
"""

import argparse
import json
import urllib.request
from pathlib import Path
from typing import Any

from .compare import apply_substitution, compare_sequences, parse_variant

UNIPROT_JSON = "https://rest.uniprot.org/uniprotkb/{acc}.json"
UNIPROT_PAGE = "https://www.uniprot.org/uniprotkb/{acc}"
EXAMPLES_DIR = Path(__file__).resolve().parents[2] / "data" / "examples"


def fetch_uniprot(accession: str) -> dict[str, Any]:
    """Download the UniProt JSON record for one accession."""
    req = urllib.request.Request(
        UNIPROT_JSON.format(acc=accession),
        headers={"Accept": "application/json", "User-Agent": "MutationLens"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def build_example(
    accession: str,
    label: str,
    display_label: str | None = None,
    source_url: str | None = None,
) -> dict[str, Any]:
    record = fetch_uniprot(accession)
    sequence = record["sequence"]["value"]
    names = record.get("proteinDescription", {})
    name_obj = names.get("recommendedName") or (names.get("submissionNames") or [{}])[0]
    genes = record.get("genes") or [{}]
    ref_aa, position, alt_aa = parse_variant(label)
    variant_sequence = apply_substitution(sequence, label)
    page = UNIPROT_PAGE.format(acc=accession)
    gene = genes[0].get("geneName", {}).get("value", accession)

    return {
        "id": f"{gene.lower()}-{label.lower()}",
        "protein": {
            "name": name_obj.get("fullName", {}).get("value", accession),
            "gene": gene,
            "organism": record.get("organism", {}).get("scientificName", ""),
            "uniprotAccession": accession,
            "uniprotUrl": page,
            "fullLength": record["sequence"]["length"],
            "referenceSequence": sequence,
        },
        "variant": {
            "label": display_label or label,
            "position": position,
            "ref": ref_aa,
            "alt": alt_aa,
            "variantSequence": variant_sequence,
            "sourceUrl": source_url or page,
        },
        "structure": {
            "pdbId": None,
            "chain": None,
            "residueMap": {},
            "mappingVerified": False,
        },
        "analysis": compare_sequences(sequence, variant_sequence),
    }


def write_example(example: dict[str, Any], out_dir: Path = EXAMPLES_DIR) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{example['id']}.json"
    path.write_text(json.dumps(example, indent=2) + "\n", encoding="utf-8")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description="Build an example JSON from UniProt.")
    parser.add_argument("accession", help="UniProt accession, e.g. P68871")
    parser.add_argument("label", help="Substitution in UniProt numbering, e.g. E7V")
    parser.add_argument("--display-label", help="Label shown in the UI, e.g. E6V")
    parser.add_argument("--source-url", help="Link to the variant source record")
    args = parser.parse_args()
    example = build_example(args.accession, args.label, args.display_label, args.source_url)
    print(f"Wrote {write_example(example)}")


if __name__ == "__main__":
    main()