"""Re-download every example from UniProt and keep its structure block.

Usage (from the analysis folder, venv active):
    python -m mutationlens.refresh                 # all files in data/examples
    python -m mutationlens.refresh ../data/examples/kras-g12d.json

Protein, variant sequence and analysis are rebuilt from the live UniProt record.
The "structure" block (PDB id, chain, residue map, verification notes) and any
extra variant notes such as legacyLabel are kept exactly as they are.
"""

import json
import sys
from pathlib import Path
from typing import Any

from .examples import EXAMPLES_DIR, build_example


def refresh_file(path: Path) -> tuple[dict[str, Any], bool]:
    """Rebuild one example file. Returns (new example, sequence_changed)."""
    old = json.loads(path.read_text(encoding="utf-8"))
    v = old["variant"]
    label = f"{v['ref']}{v['position']}{v['alt']}"
    new = build_example(
        old["protein"]["uniprotAccession"],
        label,
        display_label=v.get("label"),
        source_url=v.get("sourceUrl"),
    )
    new["id"] = old["id"]
    for key, value in v.items():
        new["variant"].setdefault(key, value)
    new["structure"] = old["structure"]
    changed = old["protein"]["referenceSequence"] != new["protein"]["referenceSequence"]
    path.write_text(json.dumps(new, indent=2) + "\n", encoding="utf-8")
    return new, changed


def main() -> int:
    paths = [Path(p) for p in sys.argv[1:]] or sorted(EXAMPLES_DIR.glob("*.json"))
    failed = 0
    for path in paths:
        try:
            new, changed = refresh_file(path)
            note = "sequence fixed" if changed else "sequence unchanged"
            print(f"OK   {path.name}: {new['protein']['fullLength']} aa, {note}")
        except Exception as exc:  # report every file, do not stop at the first error
            failed += 1
            print(f"FAIL {path.name}: {exc}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())