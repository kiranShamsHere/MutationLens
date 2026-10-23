import { useState } from 'react'
import Card from '../layout/Card'
import { explain } from '../../lib/explain'
import type { LoadedVariant } from '../../types'

type Props = { data: LoadedVariant; structureVerified: boolean }

export default function ExplainPanel({ data, structureVerified }: Props) {
    const [mode, setMode] = useState<'simple' | 'technical'>('simple')
    const { simple, technical } = explain(data, structureVerified)

    const tab = (m: 'simple' | 'technical') =>
        `rounded-lg px-5 py-2 text-sm font-bold transition duration-200 ${mode === m ? 'bg-ink text-bg shadow' : 'text-muted hover:text-ink'
        }`

    return (
        <Card title="What this means" tag="Calculated by this app" className="md:col-span-6">
            <div className="mb-6 inline-flex gap-1 rounded-xl border border-line bg-soft p-1">
                <button aria-pressed={mode === 'simple'} className={tab('simple')} onClick={() => setMode('simple')}>
                    Simple
                </button>
                <button aria-pressed={mode === 'technical'} className={tab('technical')} onClick={() => setMode('technical')}>
                    Technical
                </button>
            </div>

            {mode === 'simple' ? (
                <ul className="space-y-3">
                    {simple.map((line) => (
                        <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed">
                            <i className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand" />
                            {line}
                        </li>
                    ))}
                </ul>
            ) : (
                <dl className="grid gap-3 sm:grid-cols-2">
                    {technical.map(([k, v]) => (
                        <div key={k} className="rounded-2xl bg-soft px-5 py-4 transition duration-200 hover:bg-line">
                            <dt className="text-xs font-semibold text-muted">{k}</dt>
                            <dd className="mt-1 font-bold">{v}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </Card>
    )
}