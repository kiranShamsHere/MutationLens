import raw from '../data/examples.json'

// The example data lives in the data/examples folder (made by the analysis code,
// mapping checked by the 3D and data work). `npm run sync-data` copies it here.
export const CURATED = raw

const META: Record<string, { field: string; blurb: string }> = {
    'hbb-e7v': {
        field: 'Blood',
        blurb: 'A classic textbook example. Older papers call it E6V because they skip the first methionine, which is why numbering matters.',
    },
    'kras-g12d': { field: 'Cancer research', blurb: 'One of the most studied changes in cancer research. It sits near the start of the protein.' },
    'hras-g12v': { field: 'Cancer research', blurb: 'A classic change at position 12 in the RAS family, like the KRAS example.' },
    'nras-q61r': { field: 'Cancer research', blurb: 'A well studied change in NRAS, a close relative of KRAS.' },
    'tp53-r175h': { field: 'Cancer research', blurb: 'A well known change in the part of p53 that binds DNA.' },
    'braf-v600e': { field: 'Cancer research', blurb: 'A well studied change in the kinase region of BRAF.' },
    'egfr-l858r': { field: 'Cancer research', blurb: 'A well studied change in the kinase region of EGFR, often discussed in lung cancer research.' },
    'pik3ca-h1047r': { field: 'Cancer research', blurb: 'A common change near the end of PIK3CA, widely studied in cancer research.' },
    'idh1-r132h': { field: 'Cancer research', blurb: 'A well studied change in IDH1, often discussed in brain tumor research.' },
    'jak2-v617f': { field: 'Blood', blurb: 'A well studied change in JAK2, often discussed in blood disorder research.' },
    'fgfr3-g380r': { field: 'Growth and bone', blurb: 'A well studied change in FGFR3, often discussed in bone growth research.' },
    'cftr-g551d': { field: 'Cystic fibrosis', blurb: 'A well known change in CFTR, often discussed in cystic fibrosis research.' },
}

const ORDER = Object.keys(META)
const rank = (id: string) => (ORDER.includes(id) ? ORDER.indexOf(id) : ORDER.length)

export const EXAMPLES = [...CURATED]
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map((c) => ({
        id: c.id,
        gene: c.protein.gene,
        field: META[c.id]?.field ?? 'Other',
        protein: c.protein.name,
        accession: c.protein.uniprotAccession,
        variant: c.variant.label,
        blurb: META[c.id]?.blurb ?? 'A curated example from the team data.',
        data: c,
    }))

export const findExample = (accession: string, variant: string) =>
    CURATED.find(
        (c) =>
            c.protein.uniprotAccession.toUpperCase() === accession.trim().toUpperCase() &&
            c.variant.label.toUpperCase() === variant.trim().toUpperCase(),
    )

export const exploreLink = (accession: string, variant: string) =>
    `/explore?acc=${accession}&v=${variant}`