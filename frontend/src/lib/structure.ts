import type { LoadedVariant, PdbEntry, StructureInput } from '../types'

const SIFTS_URL = 'https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/'
const ALPHAFOLD_URL = 'https://alphafold.ebi.ac.uk/api/prediction/'
const MAX_TRIES = 6

// UniProt writes chains like "A/B=1-146" or "A=1-300, B=5-250"
export function parseChains(value: string): PdbEntry['chains'] {
    const out: PdbEntry['chains'] = []
    for (const part of value.split(',')) {
        const m = part.trim().match(/^([A-Za-z0-9/]+)=(\d+)-(\d+)$/)
        if (!m) continue
        for (const chain of m[1].split('/')) out.push({ chain, start: Number(m[2]), end: Number(m[3]) })
    }
    return out
}

const methodRank = (m: string) => {
    const x = m.toLowerCase()
    return x === 'x-ray' ? 0 : x === 'em' ? 1 : 2
}

// Entries whose chains cover the position, best first (X-ray, then EM, then others, lowest resolution first)
export function candidatesFor(entries: PdbEntry[], position: number) {
    const rows: { id: string; chain: string; method: string; resolution: number | null }[] = []
    for (const e of entries) {
        const hit = e.chains.find((c) => c.start <= position && position <= c.end)
        if (hit) rows.push({ id: e.id, chain: hit.chain, method: e.method, resolution: e.resolution })
    }
    return rows.sort(
        (a, b) =>
            methodRank(a.method) - methodRank(b.method) ||
            (a.resolution ?? Infinity) - (b.resolution ?? Infinity),
    )
}

type Edge = { author_residue_number?: number | null; author_insertion_code?: string | null }
type SiftsMapping = { chain_id?: string; unp_start?: number; unp_end?: number; start?: Edge; end?: Edge }
export type SiftsResponse = Record<string, { UniProt?: Record<string, { mappings?: SiftsMapping[] }> }>

// Turns a UniProt position into the residue number used inside the structure.
// Returns null if the numbering has a jump or an insertion code, so we never guess.
export function residueFromSifts(
    json: SiftsResponse,
    pdbId: string,
    acc: string,
    chain: string,
    position: number,
): number | null {
    const maps = json[pdbId.toLowerCase()]?.UniProt?.[acc]?.mappings ?? []
    for (const m of maps) {
        if (m.chain_id !== chain) continue
        if (m.unp_start == null || m.unp_end == null) continue
        if (!(m.unp_start <= position && position <= m.unp_end)) continue
        const s = m.start?.author_residue_number
        const e = m.end?.author_residue_number
        if (s == null || e == null) continue
        if (m.start?.author_insertion_code || m.end?.author_insertion_code) continue
        if (e - s !== m.unp_end - m.unp_start) continue
        return s + (position - m.unp_start)
    }
    return null
}

async function siftsResidue(pdbId: string, acc: string, chain: string, position: number, signal: AbortSignal) {
    const res = await fetch(`${SIFTS_URL}${pdbId.toLowerCase()}`, { signal })
    if (!res.ok) return null
    return residueFromSifts((await res.json()) as SiftsResponse, pdbId, acc, chain, position)
}

// 1. an experimental structure from the PDB that covers the position
// 2. otherwise the AlphaFold model, which covers almost every UniProt protein
export async function findStructure(data: LoadedVariant, signal: AbortSignal): Promise<StructureInput | null> {
    for (const c of candidatesFor(data.pdbEntries, data.position).slice(0, MAX_TRIES)) {
        try {
            const residue = await siftsResidue(c.id, data.accession, c.chain, data.position, signal)
            if (residue) {
                const detail = [c.method, c.resolution ? `${c.resolution} A` : ''].filter(Boolean).join(', ')
                return {
                    pdbId: c.id,
                    chain: c.chain,
                    residue,
                    verified: true,
                    note: `Found automatically: ${c.id}${detail ? ` (${detail})` : ''}. Residue number from PDBe SIFTS.`,
                }
            }
        } catch (e) {
            if (signal.aborted) throw e
        }
    }

    try {
        const res = await fetch(`${ALPHAFOLD_URL}${data.accession}`, { signal })
        if (res.ok) {
            const list = (await res.json()) as { cifUrl?: string; uniprotStart?: number; uniprotEnd?: number }[]
            const m = list.find(
                (x) => x.cifUrl && (x.uniprotStart ?? 1) <= data.position && data.position <= (x.uniprotEnd ?? Infinity),
            )
            if (m?.cifUrl) {
                return {
                    pdbId: '',
                    chain: 'A',
                    residue: data.position,
                    verified: true,
                    modelUrl: m.cifUrl,
                    note: 'No experimental structure covers this spot, so this is the AlphaFold model. It is a computer prediction, not an experiment. Residue numbers match UniProt.',
                }
            }
        }
    } catch (e) {
        if (signal.aborted) throw e
    }
    return null
}