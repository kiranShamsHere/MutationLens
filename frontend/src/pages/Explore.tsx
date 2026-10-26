import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, GitCompare, RefreshCw, TriangleAlert } from 'lucide-react'
import Card from '../components/layout/Card'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import ScrollRow, { chipClass } from '../components/layout/ScrollRow'
import VariantForm from '../components/explore/VariantForm'
import ProteinSearch from '../components/explore/ProteinSearch'
import ProteinAbout from '../components/explore/ProteinAbout'
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
import { useProtein } from '../hooks/useProtein'
import { useHistory } from '../hooks/useHistory'
import { useAutoStructure } from '../hooks/useAutoStructure'
import type { StructureInput } from '../types'

const STEPS = ['Find a protein', 'Pick a change', 'Read the result']

function Stepper({ stage, onStep }: { stage: 1 | 2 | 3; onStep: (n: 1 | 2) => void }) {
    return (
        <ol className="grid grid-cols-3 gap-2 sm:gap-3">
            {STEPS.map((label, i) => {
                const n = i + 1
                const current = n === stage
                const clickable = n < stage
                return (
                    <li key={label}>
                        <button
                            type="button"
                            disabled={!clickable}
                            onClick={() => clickable && onStep(n as 1 | 2)}
                            aria-current={current ? 'step' : undefined}
                            className={`flex h-full w-full flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition duration-200 sm:flex-row sm:gap-3 sm:px-4 sm:text-left ${current ? 'border-brand bg-brand/10' : 'border-line bg-surface'
                                } ${clickable ? 'hover:border-brand' : ''}`}
                        >
                            <span
                                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-xs font-bold ${current || n < stage ? 'bg-brand text-brand-ink' : 'bg-soft text-muted'
                                    }`}
                            >
                                {n}
                            </span>
                            <span className={`text-xs font-bold sm:text-sm ${current ? 'text-ink' : 'text-muted'}`}>{label}</span>
                        </button>
                    </li>
                )
            })}
        </ol>
    )
}

function OwnChange({ onPick }: { onPick: (v: string) => void }) {
    const [value, setValue] = useState('')
    const [bad, setBad] = useState(false)
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const v = value.trim().toUpperCase()
                if (/^[A-Z]\d+[A-Z]$/.test(v)) onPick(v)
                else setBad(true)
            }}
            className="rounded-3xl border border-line bg-surface p-5 shadow-sm sm:p-7"
        >
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Or type your own change</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        setBad(false)
                    }}
                    placeholder="For example E7V"
                    aria-label="Your change"
                    className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-3.5 text-sm font-semibold outline-none transition duration-200 placeholder:font-normal placeholder:text-muted hover:border-brand/60 focus:border-brand"
                />
                <button className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                    Analyze
                </button>
            </div>
            <p className={`mt-3 text-sm ${bad ? 'text-hot' : 'text-muted'}`}>
                Write the old letter, the position, then the new letter. E7V means the E at spot 7 becomes V.
            </p>
        </form>
    )
}

export default function Explore() {
    const [params, setParams] = useSearchParams()
    const acc = params.get('acc') ?? ''
    const v = params.get('v') ?? ''
    const q = params.get('q') ?? ''
    const stage: 1 | 2 | 3 = !acc ? 1 : !v ? 2 : 3

    const curated = findExample(acc, v)
    const cs = curated?.structure
    const residueMap = (cs?.residueMap ?? {}) as Record<string, number | undefined>
    const fromUrl = params.get('pdb')
    // Structure typed in the form, or the one the team checked for a curated example.
    const manual: StructureInput = fromUrl
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
                residue: residueMap[String(curated.variant.position)] ?? null,
                verified: true,
            }
            : { pdbId: '', chain: '', residue: null, verified: false }

    const { status, data, error, retry } = useVariant(acc, v)
    const protein = useProtein(acc, stage === 2)
    // For every other protein, look up a structure automatically.
    const needAuto = !manual.pdbId
    const auto = useAutoStructure(status === 'ready' ? data : undefined, needAuto)
    const structure: StructureInput = needAuto && auto.structure ? auto.structure : manual
    const { items, add, clear } = useHistory()

    useEffect(() => {
        if (status === 'ready' && data) add({ acc: data.accession, v: data.label, name: data.name, gene: data.gene })
    }, [status, data, add])

    const pickProtein = (accession: string) => setParams(new URLSearchParams({ acc: accession }))
    const pickVariant = (variant: string) => setParams(new URLSearchParams({ acc, v: variant }))
    const goStep = (n: 1 | 2) => (n === 1 ? setParams(new URLSearchParams()) : pickProtein(acc))

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
            <PageHeader eyebrow="Explore" title="Explore a protein">
                Search for a protein by name, pick one change in it, and read what that change means. You do not need a UniProt ID.
            </PageHeader>

            <div className="mt-8 sm:mt-10">
                <Stepper stage={stage} onStep={goStep} />
            </div>

            {/* step 1: find a protein */}
            {stage === 1 && (
                <div className="fade-up mt-6 space-y-4">
                    <ProteinSearch key={q} initialQuery={q} onPick={pickProtein} />
                    <Card title="Or start from an example">
                        <ScrollRow>
                            {EXAMPLES.map((e) => (
                                <Link key={e.id} to={exploreLink(e.accession, e.variant)} className={`${chipClass} bg-soft`}>
                                    {e.gene} {e.variant}
                                </Link>
                            ))}
                        </ScrollRow>
                        <RecentList items={items} onClear={clear} />
                    </Card>
                </div>
            )}

            {/* step 2: learn about the protein and pick a change */}
            {stage === 2 && (
                <div className="fade-up mt-6 space-y-4">
                    {protein.status === 'loading' && (
                        <div className="space-y-3" aria-busy="true">
                            <div className="h-40 animate-pulse rounded-3xl bg-soft" />
                            <div className="h-32 animate-pulse rounded-3xl bg-soft" />
                        </div>
                    )}
                    {protein.status === 'error' && (
                        <Card className="border-hot/60">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <TriangleAlert className="mt-0.5 shrink-0 text-hot" size={20} />
                                    <div>
                                        <p className="font-bold">We could not load this protein</p>
                                        <p className="mt-1 text-sm text-muted">{protein.error}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => goStep(1)}
                                    className="rounded-xl border border-line px-5 py-2.5 text-sm font-bold transition duration-200 hover:border-brand hover:bg-soft"
                                >
                                    Search again
                                </button>
                            </div>
                        </Card>
                    )}
                    {protein.status === 'ready' && (
                        <Card title="About this protein" tag="From UniProt">
                            <h2 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{protein.info.name}</h2>
                            <ProteinAbout info={protein.info} />
                        </Card>
                    )}

                    <KnownVariants key={acc} acc={acc} onPick={pickVariant} />
                    <OwnChange onPick={pickVariant} />
                    <Link
                        to={`/compare?acc=${acc}`}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                    >
                        <GitCompare size={16} /> Compare several changes in this protein
                    </Link>
                </div>
            )}

            {/* step 3: results */}
            {stage === 3 && (
                <div className="mt-6">
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
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={retry}
                                        className="flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-bold transition duration-200 hover:border-brand hover:bg-soft"
                                    >
                                        <RefreshCw size={14} /> Try again
                                    </button>
                                    <button
                                        onClick={() => goStep(2)}
                                        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        Pick another change
                                    </button>
                                </div>
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
                                    <StructureViewer structure={structure} label={data.label} searching={needAuto && auto.searching} />
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
            )}

            {stage > 1 && (
                <details className="mt-8 rounded-3xl border border-line bg-surface p-5 sm:p-7">
                    <summary className="cursor-pointer text-sm font-bold text-link transition hover:opacity-80">
                        Advanced: use a UniProt ID or set a 3D structure by hand
                    </summary>
                    <div className="mt-5">
                        <VariantForm key={params.toString()} acc={acc} v={v} structure={manual} onSubmit={submit} />
                    </div>
                </details>
            )}

            <p className="mt-10 text-center text-xs text-muted">Educational and research tool. Not for medical use.</p>
        </Container>
    )
}