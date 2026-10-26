import table from '../data/structures.json'
import type { StructureInput } from '../types'

interface Entry {
    pdbId: string
    chain: string | null
    residue: number | null
    verified: boolean
    source: string | null
    checkedOn: string | null
    rcsbUrl: string
}

// Generated from data/examples by: python -m mutationlens.export_structures
const TABLE = table as unknown as Record<string, Entry>

export function curatedStructure(acc: string, label: string): StructureInput | null {
    const e = TABLE[`${acc.trim().toUpperCase()}|${label.trim().toUpperCase()}`]
    if (!e) return null
    return {
        pdbId: e.pdbId,
        chain: e.chain ?? '',
        residue: e.residue,
        verified: e.verified,
        source: e.verified && e.source ? `${e.source}, checked ${e.checkedOn ?? 'n/a'}` : undefined,
    }
}