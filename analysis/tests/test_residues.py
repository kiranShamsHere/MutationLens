import pytest

from mutationlens.residues import AMINO_ACIDS, compare_residues, describe_residue


def test_twenty_amino_acids():
    assert len(AMINO_ACIDS) == 20


def test_describe_residue_with_position():
    info = describe_residue("e", 7)
    assert info["name"] == "Glutamate"
    assert info["threeLetter"] == "Glu"
    assert info["position"] == 7


def test_unknown_residue_raises():
    with pytest.raises(ValueError):
        describe_residue("Z")


def test_glu_to_val_changes_class_and_charge():
    result = compare_residues("E", "V")
    assert result["classChanged"] is True
    assert result["chargeChange"] == 1
    assert result["hydropathyChange"] == 7.7
    assert result["source"] == "calculated"


def test_same_class_substitution():
    assert compare_residues("I", "L")["classChanged"] is False