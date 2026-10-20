# MutationLens

Interactive protein variant explorer. Compare a reference protein sequence with a selected variant, inspect the changed amino acid positions, view supported changes on a 3D structure, and check the original database records.

> Educational and research exploration tool. Not a clinical diagnostic system. A sequence difference alone does not prove a functional effect or a disease association.

## Features

Must have:
* Responsive dashboard UI with loading, error, and empty states
* Curated protein and variant examples
* Reference vs variant sequence comparison with highlighted changes
* Interactive 3D structure viewer (Mol*)
* Evidence section with accession ids and links to original records

Should have:
* Residue details and simple amino acid properties
* Summary cards and charts

Stretch:
* Downloadable comparison report
* Search and filter for examples

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| 3D viewer | Mol* |
| Sequence analysis | Python, Biopython |
| Data sources | UniProt, RCSB Protein Data Bank |
| Charts | Plotly |
| Deployment | Vercel |

## Project Structure

```
mutationlens/
  .github/       PR template
  frontend/      React app
    src/
      components/   layout, sequence, viewer, evidence, charts
      pages/
      hooks/
      lib/
      types/
  analysis/      Python package and tests
    mutationlens/   compare, validate, residues
    tests/
  data/          curated examples and schema
    examples/
    schema/
  docs/          project brief and data contract
```

## Getting Started

Requirements: Node.js 20 or newer, Python 3.10 or newer, Git.

Clone the repo:

```
git clone https://github.com/kiranShamsHere/mutationlens.git
cd mutationlens
git checkout dev
```

Run the frontend:

```
cd frontend
npm install
npm run dev
```

The app opens at http://localhost:5173

Run the analysis tests:

```
cd analysis
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
pytest
```

On macOS or Linux, activate with `source .venv/bin/activate` instead.

## Scientific Accuracy

* Every protein, variant, and structure links to its original record
* No invented sequences, residue mappings, structures, or variant effects
* A residue is highlighted in 3D only when its mapping is verified
* If a structure is missing or the mapping is uncertain, the app shows a clear message
* Database evidence and app calculated results are kept visibly separate

## Team

Huzaifa Ahmed Bhutto
Muhammad Saleem
Kiran Shams

Lanes: UI and frontend, bioinformatics analysis, 3D viewer and data integration.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch rules, commit style, and the pull request workflow.

## Data Sources

* UniProt: https://www.uniprot.org/
* RCSB Protein Data Bank: https://www.rcsb.org/
* Mol* viewer: https://molstar.org/
* Biopython: https://biopython.org/

## License

MIT, see [LICENSE](LICENSE).