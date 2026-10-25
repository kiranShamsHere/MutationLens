"""Export the structure data the frontend needs.

The website is deployed from the frontend folder only, so it cannot read
data/examples. This command writes a small lookup table into
frontend/src/data/structures.json.

Usage (from the analysis folder, venv active):
    python -m mutationlens.export_structures           # write the file
    python -m mutationlens.export_structures --check   # exit 1 if it is out of date

A mapping is only marked "verified" when the example says so AND names a
source and a check date. Without that the 3D viewer loads the structure but
does not highlight any residue.
"""

import json
import sys
from pathlib import Path
from typing import Any

from .examples import EXAMPLES_DIR

OUT_FILE = Path(__file__).resolve().parents[2] / "frontend" / "src" / "data" / "structures.json"


def example_key(example: dict[str, Any]) -> str:
    v = example["variant"]
    return f"{example['protein']['uniprotAccession']}|{v['ref']}{v['position']}{v['alt']}"


def structure_entry(example: dict[str, Any]) -> dict[str, Any] | None:
    s = example["structure"]
    pdb = (s.get("pdbId") or "").strip().upper()
    if not pdb:
        return None
    chain = s.get("chain") or None
    residue = s.get("residueMap", {}).get(str(example["variant"]["position"]))
    sourced = bool(s.get("mappingSource")) and bool(s.get("mappingCheckedOn"))
    verified = bool(s.get("mappingVerified")) and sourced and bool(chain) and residue is not None
    return {
        "pdbId": pdb,
        "chain": chain,
        "residue": residue,
        "verified": verified,
        "source": s.get("mappingSource") if verified else None,
        "checkedOn": s.get("mappingCheckedOn") if verified else None,
        "rcsbUrl": s.get("rcsbUrl") or f"https://www.rcsb.org/structure/{pdb}",
    }


def build_table(examples_dir: Path = EXAMPLES_DIR) -> dict[str, dict[str, Any]]:
    table: dict[str, dict[str, Any]] = {}
    for path in sorted(examples_dir.glob("*.json")):
        example = json.loads(path.read_text(encoding="utf-8"))
        entry = structure_entry(example)
        if entry:
            table[example_key(example)] = entry
    return table


def render(table: dict[str, dict[str, Any]]) -> str:
    return json.dumps(table, indent=2, sort_keys=True) + "\n"


def main() -> int:
    text = render(build_table())
    if "--check" in sys.argv:
        current = OUT_FILE.read_text(encoding="utf-8") if OUT_FILE.exists() else ""
        if current != text:
            print("OUT OF DATE: run python -m mutationlens.export_structures")
            return 1
        print("OK: frontend structure table is up to date")
        return 0
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(text, encoding="utf-8")
    rows = json.loads(text)
    verified = sum(1 for r in rows.values() if r["verified"])
    print(f"Wrote {OUT_FILE} ({len(rows)} structures, {verified} with a verified mapping)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())