import type { StructureInput } from '../types'

interface AfEntry {
    entryId?: string
    cifUrl?: string
    uniprotStart?: number
    uniprotEnd?: number
    uniprotSequence?: string
}

/**
 * Looks up the AlphaFold DB model for a UniProt protein.
 * AlphaFold models use UniProt numbering, so the variant position is the residue number.
 * The letter at that position is checked against the model's own sequence first.
 * Only single piece models that start at residue 1 are used.
 */
export async function loadAlphaFold(accession: string, position: number, ref: string, signal?: AbortSignal): Promise<StructureInput | null> {
    const res = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${encodeURIComponent(accession)}`, { signal })
    if (!res.ok) return null
    const list = (await res.json()) as AfEntry[]
    if (!Array.isArray(list)) return null

    const entry = list.find((e) => e.cifUrl && e.entryId && (e.uniprotStart ?? 1) === 1 && position <= (e.uniprotEnd ?? Infinity))
    if (!entry || !entry.cifUrl || !entry.entryId) return null

    const seq = entry.uniprotSequence
    if (seq && seq[position - 1] !== ref) return null

    return {
        pdbId: entry.entryId,
        chain: 'A',
        residue: position,
        verified: Boolean(seq),
        kind: 'predicted',
        modelUrl: entry.cifUrl,
        source: 'AlphaFold DB, numbering follows UniProt',
    }
}