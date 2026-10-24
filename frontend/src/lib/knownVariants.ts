import { AMINO_ACIDS } from './aminoAcids'

export interface KnownVariant {
    label: string
    ref: string
    position: number
    alt: string
    note: string
}

interface RawFeature {
    type?: string
    description?: string
    location?: { start?: { value?: number }; end?: { value?: number } }
    alternativeSequence?: { originalSequence?: string; alternativeSequences?: string[] }
}

async function fetchEntry(url: string, signal?: AbortSignal) {
    return fetch(url, { signal })
}

export async function loadKnownVariants(accession: string, signal?: AbortSignal): Promise<KnownVariant[]> {
    const acc = encodeURIComponent(accession.trim().toUpperCase())
    const base = `https://rest.uniprot.org/uniprotkb/${acc}.json`
    let res = await fetchEntry(`${base}?fields=ft_variant`, signal)
    if (res.status === 400) res = await fetchEntry(base, signal)
    if (res.status === 404) throw new Error('UniProt has no record for this ID.')
    if (!res.ok) throw new Error('UniProt did not answer. Try again in a moment.')

    const data = (await res.json()) as { features?: RawFeature[] }
    const seen = new Set<string>()
    const out: KnownVariant[] = []
    for (const f of data.features ?? []) {
        if (f.type !== 'Natural variant') continue
        const start = Number(f.location?.start?.value)
        const end = Number(f.location?.end?.value)
        const ref = f.alternativeSequence?.originalSequence ?? ''
        if (!Number.isInteger(start) || start !== end || !AMINO_ACIDS[ref] || ref.length !== 1) continue
        for (const alt of f.alternativeSequence?.alternativeSequences ?? []) {
            if (alt.length !== 1 || !AMINO_ACIDS[alt] || alt === ref) continue
            const label = `${ref}${start}${alt}`
            if (seen.has(label)) continue
            seen.add(label)
            out.push({ label, ref, position: start, alt, note: (f.description ?? '').trim() })
        }
    }
    return out.sort((a, b) => a.position - b.position)
}