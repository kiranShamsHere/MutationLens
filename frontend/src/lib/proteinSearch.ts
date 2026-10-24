export interface ProteinHit {
    accession: string
    name: string
    gene: string
    organism: string
    length: number
}

interface RawHit {
    primaryAccession?: string
    uniProtkbId?: string
    organism?: { scientificName?: string }
    genes?: { geneName?: { value?: string } }[]
    proteinDescription?: {
        recommendedName?: { fullName?: { value?: string } }
        submissionNames?: { fullName?: { value?: string } }[]
    }
    sequence?: { length?: number }
}

const FIELDS = 'accession,id,gene_primary,protein_name,organism_name,length'

export function buildQuery(text: string, humanOnly: boolean): string {
    const clean = text.replace(/[^A-Za-z0-9 _.-]/g, ' ').replace(/\s+/g, ' ').trim()
    if (clean.length < 2) return ''
    return `(${clean}) AND (reviewed:true)${humanOnly ? ' AND (organism_id:9606)' : ''}`
}

export async function searchProteins(text: string, humanOnly: boolean, signal?: AbortSignal): Promise<ProteinHit[]> {
    const query = buildQuery(text, humanOnly)
    if (!query) return []
    const url = `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}&fields=${FIELDS}&format=json&size=8`
    const res = await fetch(url, { signal })
    if (res.status === 400) throw new Error('UniProt could not read this search. Try simpler words.')
    if (!res.ok) throw new Error('UniProt did not answer. Try again in a moment.')

    const data = (await res.json()) as { results?: RawHit[] }
    const hits: ProteinHit[] = []
    for (const r of data.results ?? []) {
        if (!r.primaryAccession) continue
        hits.push({
            accession: r.primaryAccession,
            name:
                r.proteinDescription?.recommendedName?.fullName?.value ??
                r.proteinDescription?.submissionNames?.[0]?.fullName?.value ??
                r.uniProtkbId ??
                r.primaryAccession,
            gene: r.genes?.[0]?.geneName?.value ?? '',
            organism: r.organism?.scientificName ?? '',
            length: r.sequence?.length ?? 0,
        })
    }
    return hits
}