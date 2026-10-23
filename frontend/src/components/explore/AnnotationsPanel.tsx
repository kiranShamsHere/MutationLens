import { useState } from 'react'
import Card from '../layout/Card'
import type { LoadedVariant } from '../../types'

const MAX = 420

export default function AnnotationsPanel({ data }: { data: LoadedVariant }) {
    const [open, setOpen] = useState(false)
    const long = data.summary.length > MAX
    const text = long && !open ? `${data.summary.slice(0, MAX).replace(/\s+\S*$/, '')}...` : data.summary

    return (
        <Card title="What UniProt says" tag="From database" className="md:col-span-6">
            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <h3 className="text-sm font-extrabold">About this protein</h3>
                    {data.summary ? (
                        <>
                            <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
                            {long && (
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="mt-2 text-sm font-bold text-link transition duration-200 hover:opacity-80"
                                >
                                    {open ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="mt-2 text-sm text-muted">UniProt has no function text for this protein.</p>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-extrabold">At position {data.position}</h3>
                    <p
                        className={`mt-2 inline-block rounded-full px-4 py-2 text-xs font-bold ${data.listedInUniProt ? 'bg-brand/15 text-link' : 'bg-soft text-muted'
                            }`}
                    >
                        {data.listedInUniProt
                            ? 'UniProt lists this exact change as a natural variant'
                            : 'This exact change is not in the natural variant notes of this entry'}
                    </p>

                    {data.features.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                            {data.features.map((f, i) => (
                                <li key={i} className="rounded-2xl bg-soft px-5 py-4 transition duration-200 hover:bg-line">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold">{f.type}</span>
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