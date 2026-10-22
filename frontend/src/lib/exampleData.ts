import type { VariantExample } from '../types'

// Sample entry. Replace with the full sequences from UniProt and
// set the structure fields only after you verify them on RCSB.
export const hbbE6V: VariantExample = {
    id: 'hbb-e6v',
    protein: {
        name: 'Hemoglobin subunit beta',
        gene: 'HBB',
        organism: 'Homo sapiens',
        uniprotAccession: 'P68871',
        uniprotUrl: 'https://www.uniprot.org/uniprotkb/P68871',
        fullLength: 147,
        referenceSequence: 'MVHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQ',
    },
    variant: {
        label: 'E6V',
        position: 7,
        ref: 'E',
        alt: 'V',
        variantSequence: 'MVHLTPVEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQ',
        sourceUrl: 'https://www.uniprot.org/uniprotkb/P68871',
    },
    structure: {
        pdbId: null,
        chain: null,
        residueMap: {},
        mappingVerified: false,
    },
}