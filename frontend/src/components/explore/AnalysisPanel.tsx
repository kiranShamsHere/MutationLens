import Card from '../layout/Card'
import { signed, signedInt } from '../../lib/aminoAcids'

type Props = {
    curated: {
        analysis: {
            method: string
            summary: {
                identityPercent: number
                substitutionCount: number
                insertionCount: number
                deletionCount: number
            }
            substitutions: {
                position: number
                properties: {
                    fromClass: string
                    toClass: string
                    chargeChange: number
                    hydropathyChange: number
                    note: string
                }
            }[]
        }
        structure: {
            residueMap: Record<string, string | number | undefined>
            pdbId?: string | null
            chain?: string | null
            mappingVerified: boolean
            mappingSource?: string | null
            mappingCheckedOn?: string | null
        }
        variant: {
            position: number
            numberingNote?: string | null
        }
    }
}

export default function AnalysisPanel({ curated }: Props) {
    const { analysis: a, structure: s, variant: v } = curated
    const sub = a.substitutions.find((x) => x.position === v.position) ?? a.substitutions[0]
    const mapped = s.residueMap[String(v.position)]

    const analysisRows: [string, string][] = [
        ['Method', a.method === 'positional' ? 'Position by position' : 'Global alignment (BLOSUM62)'],
        ['Identity', `${a.summary.identityPercent}%`],
        [
            'Changes found',
            `${a.summary.substitutionCount} substitution, ${a.summary.insertionCount} insertions, ${a.summary.deletionCount} deletions`,
        ],
        ...(sub
            ? ([
                ['Class change', `${sub.properties.fromClass} to ${sub.properties.toClass}`],
                ['Charge change', signedInt(sub.properties.chargeChange)],
                ['Hydropathy change', signed(sub.properties.hydropathyChange)],
            ] as [string, string][])
            : []),
    ]

    const structureRows: [string, string][] = [
        ['Structure', s.pdbId ? `${s.pdbId}, chain ${s.chain ?? 'not set'}` : 'Not linked'],
        ['Residue map', mapped ? `UniProt ${v.position} is residue ${mapped} in the structure` : 'Not mapped'],
        ['Mapping', s.mappingVerified ? 'Checked by the team' : 'Not checked'],
        ...(s.mappingSource ? ([['Mapping source', s.mappingSource]] as [string, string][]) : []),
        ...(s.mappingCheckedOn ? ([['Checked on', s.mappingCheckedOn]] as [string, string][]) : []),
    ]

    const tile = (rows: [string, string][]) => (
        <dl className="grid gap-3 sm:grid-cols-2">
            {rows.map(([k, val]) => (
                <div key={k} className="rounded-2xl bg-soft px-5 py-4 transition duration-200 hover:bg-line">
                    <dt className="text-xs font-semibold text-muted">{k}</dt>
                    <dd className="mt-1 font-bold">{val}</dd>
                </div>
            ))}
        </dl>
    )

    return (
        <Card title="Curated data" tag="Team analysis and structure check" className="md:col-span-6">
            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <h3 className="mb-3 text-sm font-extrabold">Sequence analysis</h3>
                    {tile(analysisRows)}
                    {sub && <p className="mt-3 text-xs leading-relaxed text-muted">{sub.properties.note}</p>}
                </div>
                <div>
                    <h3 className="mb-3 text-sm font-extrabold">3D structure</h3>
                    {tile(structureRows)}
                    {v.numberingNote && <p className="mt-3 text-xs leading-relaxed text-muted">{v.numberingNote}</p>}
                </div>
            </div>
        </Card>
    )
}