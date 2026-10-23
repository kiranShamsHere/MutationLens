# MutationLens analysis

Python code that compares a reference protein sequence with a variant and returns one JSON result per pair. The frontend and the 3D viewer read this result.

## Setup

```powershell
cd analysis
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pytest
```

## Modules

| File | What it does |
| --- | --- |
| `mutationlens/validate.py` | Cleans and validates a sequence (FASTA header, whitespace, digits, invalid letters) |
| `mutationlens/residues.py` | Amino-acid reference table (Kyte-Doolittle hydropathy, class, approximate charge at pH 7) |
| `mutationlens/compare.py` | Compares reference and variant. Equal length gives positional substitutions, different length uses a global alignment (BLOSUM62) |
| `mutationlens/examples.py` | Builds an example JSON from a real UniProt record |

## Build an example

```powershell
python -m mutationlens.examples P68871 E7V --display-label E6V
```

- First argument: UniProt accession.
- Second argument: substitution in **UniProt numbering** (Met1 is position 1).
- `--display-label`: label shown in the UI when papers number it differently (HBB E6V in papers is E7V in UniProt).
- The sequence is downloaded from UniProt, and the script stops with an error if the reference residue does not match the label.
- Output goes to `data/examples/<gene>-<label>.json` and follows `data/schema/variant-example.schema.json`.

## Rules for the data

- Positions are 1-based on the reference sequence.
- Every sequence must come from a source record (UniProt accession, PDB id). Do not type sequences by hand.
- `structure.pdbId`, `chain` and `residueMap` stay empty and `mappingVerified` stays `false` until the mapping is checked against RCSB.
- Residue properties are labelled `"source": "calculated"`. They are reference-table values, not evidence of functional effect.