import json

from mutationlens.export_structures import OUT_FILE, build_table, render, structure_entry


def make(structure):
    return {
        "protein": {"uniprotAccession": "P00000"},
        "variant": {"ref": "E", "position": 7, "alt": "V"},
        "structure": structure,
    }


def test_no_pdb_id_gives_no_entry():
    assert structure_entry(make({"pdbId": None, "chain": None, "residueMap": {}, "mappingVerified": False})) is None


def test_verified_needs_a_source_and_a_date():
    base = {"pdbId": "2hbs", "chain": "A", "residueMap": {"7": 6}, "mappingVerified": True}
    unsourced = structure_entry(make(base))
    assert unsourced["verified"] is False
    assert unsourced["pdbId"] == "2HBS"
    assert unsourced["residue"] == 6

    sourced = structure_entry(make({**base, "mappingSource": "PDBe SIFTS", "mappingCheckedOn": "2026-10-25"}))
    assert sourced["verified"] is True
    assert sourced["source"] == "PDBe SIFTS"
    assert sourced["checkedOn"] == "2026-10-25"


def test_verified_needs_the_variant_position_in_the_map():
    s = {"pdbId": "1ABC", "chain": "A", "residueMap": {"8": 8}, "mappingVerified": True,
         "mappingSource": "PDBe SIFTS", "mappingCheckedOn": "2026-10-25"}
    assert structure_entry(make(s))["verified"] is False


def test_unverified_mapping_is_never_marked_verified():
    s = {"pdbId": "1ABC", "chain": "A", "residueMap": {"7": 7}, "mappingVerified": False,
         "mappingSource": "PDBe SIFTS", "mappingCheckedOn": "2026-10-25"}
    entry = structure_entry(make(s))
    assert entry["verified"] is False
    assert entry["source"] is None


def test_frontend_table_is_up_to_date():
    assert OUT_FILE.exists(), "run: python -m mutationlens.export_structures"
    assert OUT_FILE.read_text(encoding="utf-8") == render(build_table()), (
        "data/examples changed, run: python -m mutationlens.export_structures"
    )
    json.loads(OUT_FILE.read_text(encoding="utf-8"))