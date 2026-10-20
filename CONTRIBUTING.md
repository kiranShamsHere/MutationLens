# Contributing to MutationLens

Thanks for helping build MutationLens. This guide keeps the three of us from stepping on each other.

## Ownership

* Frontend and UI: frontend/
* Analysis and bioinformatics logic: analysis/
* 3D viewer and data integration: data/ and frontend/src/components/viewer/

Touching someone else's folder is fine, just tell them in the PR.

## Branches

* main: stable, always demo ready. Never commit directly.
* dev: shared integration branch.
* Feature branches come off dev and are named type/short_description, for example feat/sequence_diff, fix/viewer_crash, docs/readme_update.

## Workflow

1. git checkout dev
2. git pull
3. git checkout -b feat/your_feature
4. Commit small and often.
5. git push -u origin feat/your_feature
6. Open a pull request into dev and ask one teammate to review.
7. dev is merged into main only when everything on it works.

## Commit messages

Start with a type, then a short description in present tense:

* feat: add sequence comparison view
* fix: handle missing structure state
* docs: update data contract
* test: add residue numbering cases
* chore: update dependencies

## Pull requests

* Keep them small and focused on one thing.
* Fill in the PR template.
* Frontend changes should include a screenshot.
* Analysis changes should include tests.
* Do not merge your own PR without a review unless the team agrees.

## Scientific rules

These come straight from the project brief and apply to every contribution:

* Every protein, variant, and structure needs a traceable source (UniProt accession, PDB id, link to the original record).
* Never invent sequences, residue mappings, structures, variant effects, or clinical claims.
* Highlight a residue in 3D only when mappingVerified is true in the data.
* Show a clear message when a structure is missing or the mapping is uncertain.
* Keep database evidence and app calculated results visibly separate.
* This is an educational tool, not a diagnostic one. Do not claim a mutation causes a disease without supporting evidence.

## Local setup

Frontend:

    cd frontend
    npm install
    npm run dev

Analysis:

    cd analysis
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
    pytest

## Code style

* TypeScript: keep types in frontend/src/types, no any unless unavoidable.
* Python: type hints on public functions, one test per documented edge case.
* Run npm run lint before opening a frontend PR.