import { AMINO_ACIDS } from './aminoAcids'
import { parseChains } from './structure'
import type { Feature, LoadedVariant, PdbEntry } from '../types'

interface RawFeature {
    type?: string
    description?: string
    location?: { start?: { value?: number }; end?: { value?: number } }
    alternativeSequence?: { alternativeSequences?: string[] }
}

interface RawEntry {
    uniProtkbId?: string
    sequence?: { value?: string }
    organism?: { scientificName?: string }
    genes?: { geneName?: { value?: string } }[]
    proteinDescription?: {
        recommendedName?: { fullName?: { value?: string } }
        submissionNames?: { fullName?: { value?: string } }[]
    }
    comments?: { commentType?: string; texts?: { value?: string }[] }[]
    features?: RawFeature[]
    uniProtKBCrossReferences?: {
        database?: string
        id?: string
        properties?: { key?: string; value?: string }[]
    }[]
}

const SHOW = new Set([
    'Natural variant',
    'Mutagenesis',
    'Domain',
    'Region',
    'Motif',
    'Binding site',
    'Active site',
    'Site',
    'Modified residue',
    'Glycosylation',
    'Cross-link',
    'Disulfide bond',
    'Signal',
    'Transit peptide',
    'Propeptide',
    'Initiator methionine',
])

export function parseVariant(raw: string) {
    const m = raw.trim().toUpperCase().match(/^([A-Z])(\d+)([A-Z])$/)
    if (!m) return null
    return { ref: m[1], position: Number(m[2]), alt: m[3] }
}

export async function loadVariant(
    accession: string,
    variantText: string,
    signal?: AbortSignal,
): Promise<LoadedVariant> {
    const v = parseVariant(variantText)
    if (!v) throw new Error('Write the change like E7V: old letter, position, new letter.')
    if (!AMINO_ACIDS[v.ref] || !AMINO_ACIDS[v.alt]) throw new Error('Use the standard one letter amino acid codes.')
    if (v.ref === v.alt) throw new Error('The old and new letters are the same.')

    const acc = accession.trim().toUpperCase()
    const res = await fetch(`https://rest.uniprot.org/uniprotkb/${encodeURIComponent(acc)}.json`, { signal })
    if (res.status === 404 || res.status === 400) throw new Error(`UniProt has no record for ${acc}.`)
    if (!res.ok) throw new Error('UniProt did not answer. Try again in a moment.')

    const d = (await res.json()) as RawEntry
    const seq = d.sequence?.value ?? ''
    if (v.position < 1 || v.position > seq.length) {
        throw new Error(`Position ${v.position} is outside this ${seq.length} aa protein.`)
    }
    const found = seq[v.position - 1]
    if (found !== v.ref) {
        throw new Error(`Position ${v.position} is ${found} in ${acc}, not ${v.ref}. Check the numbering.`)
    }

    const name =
        d.proteinDescription?.recommendedName?.fullName?.value ??
        d.proteinDescription?.submissionNames?.[0]?.fullName?.value ??
        d.uniProtkbId ??
        acc

    const features: Feature[] = []
    let listed = false
    for (const f of d.features ?? []) {
        const type = f.type ?? ''
        const start = Number(f.location?.start?.value)
        const end = Number(f.location?.end?.value)
        if (!SHOW.has(type) || !(start <= v.position && end >= v.position)) continue
        features.push({ type, start, end, description: f.description ?? '' })
        if (
            type === 'Natural variant' &&
            start === v.position &&
            end === v.position &&
            f.alternativeSequence?.alternativeSequences?.includes(v.alt)
        ) {
            listed = true
        }
    }

    const pdbEntries: PdbEntry[] = []
    for (const x of d.uniProtKBCrossReferences ?? []) {
        if (x.database !== 'PDB' || !x.id) continue
        const prop = (k: string) => x.properties?.find((p) => p.key === k)?.value ?? ''
        const resolution = parseFloat(prop('Resolution'))
        pdbEntries.push({
            id: x.id,
            method: prop('Method'),
            resolution: Number.isFinite(resolution) ? resolution : null,
            chains: parseChains(prop('Chains')),
        })
    }

    return {
        accession: acc,
        name,
        gene: d.genes?.[0]?.geneName?.value ?? '',
        organism: d.organism?.scientificName ?? '',
        length: seq.length,
        position: v.position,
        ref: v.ref,
        alt: v.alt,
        label: `${v.ref}${v.position}${v.alt}`,
        reference: seq,
        variant: seq.slice(0, v.position - 1) + v.alt + seq.slice(v.position),
        summary: d.comments?.find((c) => c.commentType === 'FUNCTION')?.texts?.[0]?.value ?? '',
        features,
        listedInUniProt: listed,
        pdbEntries,
    }
}