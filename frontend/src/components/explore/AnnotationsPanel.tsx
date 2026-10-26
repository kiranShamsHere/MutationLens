import Card from '../layout/Card'
import ProteinAbout from './ProteinAbout'
import type { LoadedVariant } from '../../types'

export default function AnnotationsPanel({ data }: { data: LoadedVariant }) {
    return (
        <Card title="What UniProt says" tag="From database" className="md:col-span-6">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div>
                    <h3 className="mb-4 text-sm font-extrabold">About this protein</h3>
                    <ProteinAbout info={data.info} compact />
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-extrabold">At position {data.position}</h3>
                    <p
                        className={`rounded-2xl px-5 py-4 text-sm font-semibold leading-relaxed ${data.listedInUniProt ? 'bg-brand/15 text-link' : 'bg-soft text-muted'
                            }`}
                    >
                        {data.listedInUniProt
                            ? 'UniProt lists this exact change as a natural variant.'
                            : 'This exact change is not in the natural variant notes of this entry.'}
                    </p>

                    {data.features.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                            {data.features.map((f, i) => (
                                <li key={i} className="rounded-2xl border border-line px-5 py-4 transition duration-200 hover:border-brand/60">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-soft px-3 py-1 text-xs font-bold">{f.type}</span>
                                        <span className="text-xs text-muted">
                                            {f.start === f.end ? `Position ${f.start}` : `Positions ${f.start} to ${f.end}`}
                                        </span>
                                    </div>
                                    {f.description && <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-sm text-muted">UniProt has no feature notes at this position.</p>
                    )}
                </div>
            </div>
        </Card>
    )
}