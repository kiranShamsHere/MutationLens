import pytest

from mutationlens.compare import apply_substitution, compare_sequences, parse_variant

# Toy sequences for unit tests only. Real data must come from UniProt/PDB.
REF = "MKVLAAGIVGLLLAQP"


def test_identical_sequences():
    result = compare_sequences(REF, REF)
    assert result["identical"] is True
    assert result["substitutions"] == []
    assert result["summary"]["identityPercent"] == 100.0


def test_single_substitution_is_one_based():
    var = REF[:3] + "W" + REF[4:]  # position 4: L -> W
    result = compare_sequences(REF, var)
    assert result["method"] == "positional"
    assert len(result["substitutions"]) == 1
    sub = result["substitutions"][0]
    assert (sub["position"], sub["refAa"], sub["varAa"]) == (4, "L", "W")
    assert sub["label"] == "L4W"


def test_multiple_substitutions():
    var = "A" + REF[1:-1] + "A"
    labels = [s["label"] for s in compare_sequences(REF, var)["substitutions"]]
    assert labels == ["M1A", "P16A"]


def test_deletion_detected():
    var = REF[:5] + REF[8:]  # remove positions 6-8
    result = compare_sequences(REF, var)
    assert result["method"] == "global_alignment"
    assert result["summary"]["deletionCount"] == 1
    assert result["deletions"][0]["length"] == 3
    assert result["insertions"] == []


def test_insertion_detected():
    var = REF[:5] + "GGG" + REF[5:]
    result = compare_sequences(REF, var)
    assert result["summary"]["insertionCount"] == 1
    assert result["insertions"][0]["sequence"] == "GGG"
    assert result["deletions"] == []


def test_invalid_input_raises():
    with pytest.raises(ValueError):
        compare_sequences(REF, "MKV1J")


def test_parse_variant():
    assert parse_variant("e7v") == ("E", 7, "V")


@pytest.mark.parametrize("bad", ["", "E0V", "EV7", "7EV", "Glu7Val"])
def test_parse_variant_invalid(bad):
    with pytest.raises(ValueError):
        parse_variant(bad)


def test_apply_substitution():
    assert apply_substitution(REF, "L4W") == REF[:3] + "W" + REF[4:]


def test_apply_substitution_wrong_reference_residue():
    with pytest.raises(ValueError, match="expects"):
        apply_substitution(REF, "A4W")


def test_apply_substitution_out_of_range():
    with pytest.raises(ValueError, match="beyond"):
        apply_substitution(REF, "L99W")