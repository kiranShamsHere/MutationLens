export interface VariantExample {
    id: string
    protein: {
        name: string
        gene: string
        organism: string
        uniprotAccession: string
        uniprotUrl: string
        fullLength: number
        referenceSequence: string
    }
    variant: {
        label: string
        position: number
        ref: string
        alt: string
        variantSequence: string
        sourceUrl: string
    }
    structure: {
        pdbId: string | null
        chain: string | null
        residueMap: Record<number, number>
        mappingVerified: boolean
    }
}