import { AMINO_ACIDS } from './aminoAcids'
import { parseChains } from './structure'
import { splitParagraphs } from './text'
import type { Feature, LoadedVariant, PdbEntry, ProteinInfo, ProteinSection } from '../types'

interface RawFeature {
    type?: string
    description?: string
    location?: { start?: { value?: number }; end?: { value?: number } }
    alternativeSequence?: { alternativeSequences?: string[] }
}

interface RawComment {
    commentType?: string
    texts?: { value?: string }[]
    subcellularLocations?: { location?: { value?: string } }[]
}

interface RawEntry {
    uniProtkbId?: string
    sequence?: { value?: string; molWeight?: number }
    organism?: { scientificName?: string }
    genes?: { geneName?: { value?: string }; synonyms?: { value?: string }[] }[]
    proteinDescription?: {
        recommendedName?: { fullName?: { value?: string } }
        alternativeNames?: { fullName?: { value?: string } }[]
        submissionNames?: { fullName?: { value?: string } }[]
    }
    comments?: RawComment[]
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

async function fetchEntry(accession: string, signal?: AbortSignal): Promise<{ acc: string; d: RawEntry }> {
    const acc = accession.trim().toUpperCase()
    const res = await fetch(`https://rest.uniprot.org/uniprotkb/${encodeURIComponent(acc)}.json`, { signal })
    if (res.status === 404 || res.status === 400) throw new Error(`UniProt has no record for ${acc}.`)
    if (!res.ok) throw new Error('UniProt did not answer. Try again in a moment.')
    return { acc, d: (await res.json()) as RawEntry }
}

const proteinName = (d: RawEntry, acc: string) =>
    d.proteinDescription?.recommendedName?.fullName?.value ??
    d.proteinDescription?.submissionNames?.[0]?.fullName?.value ??
    d.uniProtkbId ??
    acc

// Turns a UniProt record into short, plain sections. The text itself is UniProt's, we only organize it.
export function toInfo(d: RawEntry, acc: string): ProteinInfo {
    const seq = d.sequence?.value ?? ''
    const name = proteinName(d, acc)
    const gene = d.genes?.[0]?.geneName?.value ?? ''
    const organism = d.organism?.scientificName ?? ''
    const comments = d.comments ?? []
    const textOf = (type: string) =>
        comments
            .filter((c) => c.commentType === type)
            .flatMap((c) => c.texts ?? [])
            .map((x) => x.value ?? '')
            .filter(Boolean)
            .join(' ')
    const places = Array.from(
        new Set(
            comments
                .filter((c) => c.commentType === 'SUBCELLULAR LOCATION')
                .flatMap((c) => c.subcellularLocations ?? [])
                .map((s) => s.location?.value ?? '')
                .filter(Boolean),
        ),
    )
    const synonyms = Array.from(
        new Set(
            [
                ...(d.genes?.[0]?.synonyms ?? []).map((s) => s.value ?? ''),
                ...(d.proteinDescription?.alternativeNames ?? []).map((a) => a.fullName?.value ?? ''),
            ].filter((s) => s && s !== name && s !== gene),
        ),
    ).slice(0, 6)
    const massKDa = d.sequence?.molWeight ? Math.round(d.sequence.molWeight / 100) / 10 : null

    const sections: ProteinSection[] = []
    const fn = textOf('FUNCTION')
    if (fn) sections.push({ title: 'What it does', paragraphs: splitParagraphs(fn) })
    if (places.length) sections.push({ title: 'Where it works in the cell', paragraphs: [`${places.join(', ')}.`] })
    const tissue = textOf('TISSUE SPECIFICITY')
    if (tissue) sections.push({ title: 'Where it is found in the body', paragraphs: splitParagraphs(tissue) })

    const who = organism === 'Homo sapiens' ? 'a human protein' : `a protein from ${organism || 'an organism'}`
    const intro =
        `${name} is ${who} made of ${seq.length} amino acids${massKDa ? `, about ${massKDa} kDa` : ''}.` +
        (gene ? ` Its gene is called ${gene}.` : '') +
        (places.length ? ` UniProt places it in: ${places.slice(0, 3).join(', ')}.` : '')

    return { accession: acc, name, gene, synonyms, organism, length: seq.length, massKDa, intro, sections }
}

export async function loadProtein(accession: string, signal?: AbortSignal): Promise<ProteinInfo> {
    const { acc, d } = await fetchEntry(accession, signal)
    return toInfo(d, acc)
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

    const { acc, d } = await fetchEntry(accession, signal)
    const seq = d.sequence?.value ?? ''
    if (v.position < 1 || v.position > seq.length) {
        throw new Error(`Position ${v.position} is outside this ${seq.length} aa protein.`)
    }
    const found = seq[v.position - 1]
    if (found !== v.ref) {
        throw new Error(`Position ${v.position} is ${found} in ${acc}, not ${v.ref}. Check the numbering.`)
    }

    const info = toInfo(d, acc)

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
        const res = parseFloat(prop('Resolution'))
        pdbEntries.push({
            id: x.id,
            method: prop('Method'),
            resolution: Number.isFinite(res) ? res : null,
            chains: parseChains(prop('Chains')),
        })
    }

    return {
        accession: acc,
        name: info.name,
        gene: info.gene,
        organism: info.organism,
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
        info,
    }
}