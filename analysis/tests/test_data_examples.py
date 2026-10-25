import json

import pytest

from mutationlens.compare import compare_sequences
from mutationlens.examples import EXAMPLES_DIR

FILES = sorted(EXAMPLES_DIR.glob("*.json"))


@pytest.mark.parametrize("path", FILES, ids=[p.name for p in FILES])
def test_example_is_consistent(path):
    d = json.loads(path.read_text(encoding="utf-8"))
    p, v, s = d["protein"], d["variant"], d["structure"]
    ref, var, pos = p["referenceSequence"], v["variantSequence"], v["position"]

    assert len(ref) == p["fullLength"], "fullLength does not match the stored sequence"
    assert 1 <= pos <= len(ref), "position is outside the stored sequence"
    assert ref[pos - 1] == v["ref"], "reference letter does not match the sequence"
    assert var[pos - 1] == v["alt"], "variant letter does not match the sequence"
    if len(ref) == len(var):
        diffs = [i + 1 for i, (a, b) in enumerate(zip(ref, var)) if a != b]
        assert diffs == [pos], f"sequences differ at {diffs}"
    assert d["analysis"] == compare_sequences(ref, var), "analysis block is out of date"

    if s["mappingVerified"]:
        assert s["pdbId"] and s["chain"], "verified mapping needs a PDB id and chain"
        assert str(pos) in s["residueMap"], "verified mapping must contain the variant position"