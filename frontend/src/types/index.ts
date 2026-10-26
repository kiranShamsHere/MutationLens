export interface Feature {
    type: string
    start: number
    end: number
    description: string
}

export interface PdbEntry {
    id: string
    method: string
    resolution: number | null
    chains: { chain: string; start: number; end: number }[]
}

export interface LoadedVariant {
    accession: string
    name: string
    gene: string
    organism: string
    length: number
    position: number
    ref: string
    alt: string
    label: string
    reference: string
    variant: string
    summary: string
    features: Feature[]
    listedInUniProt: boolean
    pdbEntries: PdbEntry[]
}

export interface StructureInput {
    pdbId: string
    chain: string
    residue: number | null
    verified: boolean
    source?: string
    kind?: 'experimental' | 'predicted'
    modelUrl?: string
    note?: string
}

export interface CuratedExample {
    id: string
    protein: {
        name: string
        gene: string
        organism: string
        uniprotAccession: string
        uniprotUrl: string
        fullLength: number
    }
    variant: {
        label: string
        position: number
        ref: string
        alt: string
        sourceUrl: string
        legacyLabel?: string
        numberingNote?: string
    }
    structure: {
        pdbId: string | null
        chain: string | null
        residueMap: Record<string, number>
        mappingVerified: boolean
        mappingSource?: string
        mappingCheckedOn?: string
        rcsbUrl?: string
    }
    analysis: {
        method: 'positional' | 'global_alignment'
        identical: boolean
        substitutions: {
            position: number
            label: string
            properties: {
                classChanged: boolean
                fromClass: string
                toClass: string
                chargeChange: number
                hydropathyChange: number
                note: string
            }
        }[]
        insertions: unknown[]
        deletions: unknown[]
        summary: {
            substitutionCount: number
            insertionCount: number
            deletionCount: number
            identityPercent: number
        }
    }
}