import { ArrowRight } from 'lucide-react'
import Card from '../components/layout/Card'
import StructureViewer from '../components/viewer/StructureViewer'
import SequenceCompare from '../components/sequence/SequenceCompare'
import HydropathyChart from '../components/charts/HydropathyChart'
import EvidencePanel from '../components/evidence/EvidencePanel'
import { AMINO_ACIDS, signed } from '../lib/aminoAcids'
import { hbbE6V as example } from '../lib/exampleData'

export default function Dashboard() {
    const { protein, variant, structure } = example
    const ref = AMINO_ACIDS[variant.ref]
    const alt = AMINO_ACIDS[variant.alt]
    const delta = alt.kd - ref.kd

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                {/* header */}
                <section className="md:col-span-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-link">Selected example</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                        {protein.name} <span className="text-hot">{variant.label}</span>
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                        {[protein.gene, protein.uniprotAccession, protein.organism, `${protein.fullLength} aa`].map((t) => (
                            <span key={t} className="rounded-full border border-line bg-surface px-3 py-1.5 text-muted transition duration-200 hover:border-brand hover:text-ink">
                                {t}
                            </span>
                        ))}
                    </div>
                </section>

                {/* viewer */}
                <div className="md:col-span-4 md:row-span-2">
                    <StructureViewer structure={structure} label={variant.label} />
                </div>

                {/* summary */}
                <Card title="Variant summary" tag="Position" className="md:col-span-2">
                    <div className="flex items-center gap-3">
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand font-mono text-3xl font-bold text-brand-ink">
                            {variant.ref}
                        </span>
                        <ArrowRight className="text-muted" />
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-hot font-mono text-3xl font-bold text-[#2b0b05]">
                            {variant.alt}
                        </span>
                        <span className="ml-auto font-mono text-2xl font-bold">{variant.position}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                        {ref.name} to {alt.name.toLowerCase()} at position {variant.position} of the record. A sequence
                        difference alone does not prove a functional effect.
                    </p>
                </Card>

                {/* stat tiles */}
                <Card title="Chemistry" className="md:col-span-1">
                    <p className="text-lg font-extrabold leading-tight">
                        {ref.group} to {alt.group}
                    </p>
                </Card>
                <Card title="Hydropathy change" className="md:col-span-1">
                    <p className="font-mono text-2xl font-bold text-sun">{signed(delta)}</p>
                </Card>

                <SequenceCompare
                    reference={protein.referenceSequence}
                    variant={variant.variantSequence}
                    fullLength={protein.fullLength}
                />

                <HydropathyChart
                    refLabel={ref.name}
                    altLabel={alt.name}
                    refValue={ref.kd}
                    altValue={alt.kd}
                />

                <Card title="Residue details" tag="Calculated by app" className="md:col-span-2">
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            ['Reference', `${ref.name} (${variant.ref})`],
                            ['Variant', `${alt.name} (${variant.alt})`],
                            ['Record position', String(variant.position)],
                            ['Structure residue', structure.residueMap[variant.position]?.toString() ?? 'Not mapped'],
                        ].map(([k, v]) => (
                            <div key={k} className="rounded-2xl bg-soft p-3 transition duration-200 hover:bg-line">
                                <dt className="text-xs font-semibold text-muted">{k}</dt>
                                <dd className="mt-1 font-bold">{v}</dd>
                            </div>
                        ))}
                    </dl>
                </Card>

                <EvidencePanel example={example} />
            </div>

            <p className="mt-8 text-center text-xs text-muted">
                Educational and research exploration tool. Not a clinical diagnostic system.
            </p>
        </main>
    )
}