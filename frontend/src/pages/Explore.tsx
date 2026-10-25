import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, RefreshCw, TriangleAlert } from 'lucide-react'
import Card from '../components/layout/Card'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import VariantForm from '../components/explore/VariantForm'
import ProteinFinder from '../components/explore/ProteinFinder'
import KnownVariants from '../components/explore/KnownVariants'
import type { FormValues } from '../components/explore/VariantForm'
import ExportMenu from '../components/explore/ExportMenu'
import CopyLink from '../components/explore/CopyLink'
import RecentList from '../components/explore/RecentList'
import ExplainPanel from '../components/explore/ExplainPanel'
import AnnotationsPanel from '../components/explore/AnnotationsPanel'
import AnalysisPanel from '../components/explore/AnalysisPanel'
import StructureViewer from '../components/viewer/StructureViewer'
import SequenceCompare from '../components/sequence/SequenceCompare'
import HydropathyChart from '../components/charts/HydropathyChart'
import EvidencePanel from '../components/evidence/EvidencePanel'
import { AMINO_ACIDS, signed } from '../lib/aminoAcids'
import { EXAMPLES, exploreLink, findExample } from '../lib/examples'
import { useVariant } from '../hooks/useVariant'
import { useHistory } from '../hooks/useHistory'
import type { StructureInput } from '../types'

export default function Explore() {
    const [params, setParams] = useSearchParams()
    const acc = params.get('acc') ?? ''
    const v = params.get('v') ?? ''
    const curated = findExample(acc, v)
    const cs = curated?.structure
    const fromUrl = params.get('pdb')
    // If the link has no structure but the team checked one for this variant, use it.
    const structure: StructureInput = fromUrl
        ? {
            pdbId: fromUrl.toUpperCase(),
            chain: params.get('chain') ?? '',
            residue: Number(params.get('res')) || null,
            verified: params.get('ok') === '1',
        }
        : curated && cs?.mappingVerified && cs.pdbId && cs.chain
            ? {
                pdbId: cs.pdbId,
                chain: cs.chain,
                residue: (cs.residueMap as Record<string, number | undefined>)[String(curated.variant.position)] ?? null,
                verified: true,
            }
            : { pdbId: '', chain: '', residue: null, verified: false }
    const { status, data, error, retry } = useVariant(acc, v)
    const { items, add, clear } = useHistory()

    useEffect(() => {
        if (status === 'ready' && data) add({ acc: data.accession, v: data.label, name: data.name, gene: data.gene })
    }, [status, data, add])

    const pickVariant = (variant: string) => {
        const p = new URLSearchParams()
        p.set('acc', acc)
        p.set('v', variant)
        setParams(p)
    }

    const pickProtein = (accession: string) => {
        const p = new URLSearchParams()
        p.set('acc', accession)
        setParams(p)
    }

    const submit = (f: FormValues) => {
        const p = new URLSearchParams()
        p.set('acc', f.acc.toUpperCase())
        p.set('v', f.v.toUpperCase())
        if (f.pdb) p.set('pdb', f.pdb.toUpperCase())
        if (f.chain) p.set('chain', f.chain)
        if (f.res) p.set('res', f.res)
        if (f.ok) p.set('ok', '1')
        setParams(p)
    }

    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="Explore" title="Try any variant">
                Type a UniProt ID and a change like E7V. We get the real sequence and check the old letter before showing anything.
            </PageHeader>

            <div className="mt-10">
                <VariantForm key={params.toString()} acc={acc} v={v} structure={structure} onSubmit={submit} />
                <ProteinFinder onPick={pickProtein} />
            </div>

            <div className="mt-8">
                {status === 'idle' && acc && <KnownVariants key={acc} acc={acc} onPick={pickVariant} />}
                {status === 'idle' && (
                    <Card title="Start here" className="fade-up">
                        <p className="mb-5 text-sm text-muted">Pick an example, or type your own above.</p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLES.slice(0, 8).map((e) => (
                                <Link
                                    key={e.id}
                                    to={exploreLink(e.accession, e.variant)}
                                    className="rounded-full border border-line bg-soft px-4 py-2 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                                >
                                    {e.gene} {e.variant}
                                </Link>
                            ))}
                            <Link to="/examples" className="rounded-full px-4 py-2 text-sm font-bold text-link transition duration-200 hover:opacity-80">
                                See all examples
                            </Link>
                        </div>
                        <RecentList items={items} onClear={clear} />
                    </Card>
                )}

                {status === 'loading' && (
                    <div className="grid gap-4 md:grid-cols-6" aria-busy="true">
                        <div className="h-96 animate-pulse rounded-3xl bg-soft md:col-span-4 md:row-span-2" />
                        <div className="h-44 animate-pulse rounded-3xl bg-soft md:col-span-2" />
                        <div className="h-44 animate-pulse rounded-3xl bg-soft md:col-span-2" />
                        <div className="h-56 animate-pulse rounded-3xl bg-soft md:col-span-6" />
                    </div>
                )}

                {status === 'error' && (
                    <Card className="fade-up border-hot/60">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <TriangleAlert className="mt-0.5 shrink-0 text-hot" size={20} />
                                <div>
                                    <p className="font-bold">We could not analyze this variant</p>
                                    <p className="mt-1 text-sm text-muted">{error}</p>
                                </div>
                            </div>
                            <button
                                onClick={retry}
                                className="flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-bold transition duration-200 hover:border-brand hover:bg-soft"
                            >
                                <RefreshCw size={14} /> Try again
                            </button>
                        </div>
                    </Card>
                )}

                {status === 'ready' && data && (() => {
                    const ref = AMINO_ACIDS[data.ref]
                    const alt = AMINO_ACIDS[data.alt]
                    const verified = Boolean(structure.pdbId && structure.chain && structure.residue && structure.verified)
                    return (
                        <div className="fade-up grid grid-cols-1 gap-4 md:grid-cols-6">
                            <section className="flex flex-wrap items-end justify-between gap-4 md:col-span-6">
                                <div>
                                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
                                        {data.name} <span className="text-hot">{data.label}</span>
                                    </h2>
                                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                                        {[data.gene, data.accession, data.organism, `${data.length} aa`].filter(Boolean).map((t) => (
                                            <span key={t} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-muted transition duration-200 hover:border-brand hover:text-ink">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <CopyLink />
                                    <ExportMenu data={data} structure={structure} />
                                </div>
                            </section>

                            <div className="md:col-span-4 md:row-span-2">
                                <StructureViewer structure={structure} label={data.label} />
                            </div>

                            <Card title="Variant summary" tag={`Position ${data.position}`} className="md:col-span-2">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand font-mono text-3xl font-bold text-brand-ink">{data.ref}</span>
                                    <ArrowRight className="text-muted" />
                                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-hot font-mono text-3xl font-bold text-[#2b0b05]">{data.alt}</span>
                                </div>
                                <p className="mt-5 text-sm leading-relaxed text-muted">
                                    {ref.name} is swapped for {alt.name.toLowerCase()}.
                                </p>
                            </Card>

                            <Card title="Type" className="md:col-span-1">
                                <p className="text-lg font-extrabold leading-tight">{ref.group} to {alt.group}</p>
                                <p className="mt-3 text-xs text-muted">Calculated by this app</p>
                            </Card>
                            <Card title="Water score" className="md:col-span-1">
                                <p className="font-mono text-2xl font-bold text-sun">{signed(alt.kd - ref.kd)}</p>
                                <p className="mt-3 text-xs text-muted">Change in hydropathy</p>
                            </Card>

                            <ExplainPanel data={data} structureVerified={verified} />

                            {curated && <AnalysisPanel curated={curated} />}

                            <SequenceCompare key={`${data.accession}${data.label}`} reference={data.reference} variant={data.variant} position={data.position} />

                            <AnnotationsPanel data={data} />

                            <HydropathyChart refLabel={ref.name} altLabel={alt.name} refValue={ref.kd} altValue={alt.kd} />

                            <Card title="Residue details" tag="Calculated by this app" className="md:col-span-2">
                                <dl className="grid grid-cols-2 gap-3 text-sm">
                                    {[
                                        ['Reference', `${ref.name} (${data.ref})`],
                                        ['Variant', `${alt.name} (${data.alt})`],
                                        ['Record position', String(data.position)],
                                        ['Structure residue', structure.residue?.toString() ?? 'Not set'],
                                    ].map(([k, val]) => (
                                        <div key={k} className="rounded-2xl bg-soft px-4 py-3.5 transition duration-200 hover:bg-line">
                                            <dt className="text-xs font-semibold text-muted">{k}</dt>
                                            <dd className="mt-1 font-bold">{val}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </Card>

                            <EvidencePanel data={data} structure={structure} />
                        </div>
                    )
                })()}
            </div>

            <p className="mt-10 text-center text-xs text-muted">
                Educational and research tool. Not for medical use.
            </p>
        </Container>
    )
}