import json

from mutationlens import examples
from mutationlens.refresh import refresh_file

# Fake UniProt record for offline tests.
FAKE_RECORD = {
    "sequence": {"value": "MKVLAAGIVGLLLAQP", "length": 16},
    "proteinDescription": {"recommendedName": {"fullName": {"value": "Toy protein"}}},
    "genes": [{"geneName": {"value": "TOY"}}],
    "organism": {"scientificName": "Homo sapiens"},
}


def test_refresh_fixes_sequence_and_keeps_structure(tmp_path, monkeypatch):
    monkeypatch.setattr(examples, "fetch_uniprot", lambda acc: FAKE_RECORD)
    example = examples.build_example("P00000", "L4W", display_label="L3W")
    example["variant"]["numberingNote"] = "kept"
    example["protein"]["referenceSequence"] = "MKVLAAG"  # wrong, as if typed by hand
    example["protein"]["fullLength"] = 7
    example["structure"] = {
        "pdbId": "1ABC",
        "chain": "A",
        "residueMap": {"4": 3},
        "mappingVerified": True,
        "mappingSource": "PDBe SIFTS",
    }
    path = tmp_path / "toy-l4w.json"
    path.write_text(json.dumps(example), encoding="utf-8")

    new, changed = refresh_file(path)

    assert changed is True
    saved = json.loads(path.read_text(encoding="utf-8"))
    assert saved["protein"]["referenceSequence"] == "MKVLAAGIVGLLLAQP"
    assert saved["protein"]["fullLength"] == 16
    assert saved["variant"]["label"] == "L3W"
    assert saved["variant"]["numberingNote"] == "kept"
    assert saved["structure"]["pdbId"] == "1ABC"
    assert saved["structure"]["residueMap"] == {"4": 3}
    assert saved["analysis"]["summary"]["substitutionCount"] == 1
    assert saved == new