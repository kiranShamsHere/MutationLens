export interface Feature {
    type: string
    start: number
    end: number
    description: string
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
}

export interface StructureInput {
    pdbId: string
    chain: string
    residue: number | null
    verified: boolean
    source?: string
    kind?: 'experimental' | 'predicted'
    modelUrl?: string
}