import pytest

from mutationlens.validate import (
    SequenceValidationError,
    clean_sequence,
    validate_sequence,
)


def test_valid_sequence_is_uppercased():
    assert validate_sequence("mkv") == "MKV"


def test_whitespace_and_digits_removed():
    assert validate_sequence("MKV L\n AG 10") == "MKVLAG"


def test_fasta_header_removed():
    assert clean_sequence(">sp|TEST|toy\nMKV\nLAG") == "MKVLAG"


def test_only_first_fasta_record_used():
    assert clean_sequence(">a\nMKV\n>b\nLAG") == "MKV"


def test_empty_raises():
    with pytest.raises(SequenceValidationError):
        validate_sequence("   ")


def test_none_raises():
    with pytest.raises(SequenceValidationError):
        validate_sequence(None)


def test_invalid_characters_raise():
    with pytest.raises(SequenceValidationError, match="J"):
        validate_sequence("MKVJ")


def test_ambiguous_only_when_allowed():
    with pytest.raises(SequenceValidationError):
        validate_sequence("MKVX")
    assert validate_sequence("MKVX", allow_ambiguous=True) == "MKVX"