import json

import pytest

from mutationlens import examples

# Fake record for offline tests. Real examples come from UniProt via the CLI.
FAKE_RECORD = {
    "sequence": {"value": "MKVLAAGIVGLLLAQP", "length": 16},
    "proteinDescription": {"recommendedName": {"fullName": {"value": "Toy protein"}}},
    "genes": [{"geneName": {"value": "TOY"}}],
    "organism": {"scientificName": "Homo sapiens"},
}


@pytest.fixture(autouse=True)
def fake_uniprot(monkeypatch):
    monkeypatch.setattr(examples, "fetch_uniprot", lambda acc: FAKE_RECORD)


def test_build_example_shape():
    ex = examples.build_example("P00000", "L4W", display_label="L3W")
    assert ex["id"] == "toy-l4w"
    assert ex["protein"]["fullLength"] == 16
    assert ex["protein"]["uniprotUrl"].endswith("P00000")
    assert ex["variant"]["label"] == "L3W"
    assert ex["variant"]["position"] == 4
    assert ex["variant"]["variantSequence"] == "MKVWAAGIVGLLLAQP"
    assert ex["structure"]["mappingVerified"] is False
    assert ex["analysis"]["summary"]["substitutionCount"] == 1


def test_wrong_reference_residue_is_rejected():
    with pytest.raises(ValueError):
        examples.build_example("P00000", "A4W")


def test_write_example(tmp_path):
    ex = examples.build_example("P00000", "L4W")
    path = examples.write_example(ex, tmp_path)
    assert json.loads(path.read_text(encoding="utf-8"))["id"] == "toy-l4w"