
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Crosshair } from 'lucide-react'
import Card from '../layout/Card'

type Props = { reference: string; variant: string; position: number }

const BLOCK = 10
const PAGE = 60

export default function SequenceCompare({ reference, variant, position }: Props) {
    const home = Math.floor((position - 1) / PAGE) * PAGE
    const [start, setStart] = useState(home)
    const len = Math.max(reference.length, variant.length)
    const end = Math.min(start + PAGE, len)

    const diffs = new Set<number>()

    for (let i = 0; i < len; i++) {
        if (reference[i] !== variant[i]) diffs.add(i)
    }

    const rows = Array.from(
        { length: Math.ceil(Math.max(0, end - start) / BLOCK) },
        (_, r) => start + r * BLOCK
    )

    const cell = (diff: boolean, kind: 'ref' | 'var') =>
        `grid h-7 w-6 place-items-center rounded-md font-mono text-sm font-semibold transition duration-200 sm:h-8 sm:w-8 ${diff
            ? kind === 'ref'
                ? 'scale-110 bg-brand text-brand-ink shadow-md'
                : 'scale-110 bg-hot text-[#2b0b05] shadow-md'
            : 'bg-soft text-muted hover:bg-line hover:text-ink'
        }`

    const nav =
        'grid h-9 w-9 place-items-center rounded-lg border border-line transition duration-200 hover:border-brand hover:bg-soft disabled:pointer-events-none disabled:opacity-40'

    return (
        <Card
            title="Sequence comparison"
            tag={`Residues ${start + 1} to ${end} of ${len}`}
            className="md:col-span-6"
        >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-4 text-xs font-semibold text-muted">
                    <span className="flex items-center gap-1.5">
                        <i className="h-3 w-3 rounded bg-brand" /> Reference
                    </span>
                    <span className="flex items-center gap-1.5">
                        <i className="h-3 w-3 rounded bg-hot" /> Variant
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        aria-label="Previous residues"
                        className={nav}
                        disabled={start === 0}
                        onClick={() => setStart(Math.max(0, start - PAGE))}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <button
                        className="flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-bold transition duration-200 hover:border-brand hover:bg-soft"
                        onClick={() => setStart(home)}
                    >
                        <Crosshair size={14} /> Go to variant
                    </button>

                    <button
                        aria-label="Next residues"
                        className={nav}
                        disabled={end >= len}
                        onClick={() => setStart(start + PAGE)}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3 overflow-x-auto pb-2">
                {rows.map((s) => (
                    <div key={s} className="flex items-center gap-3">
                        <span className="w-9 shrink-0 text-right font-mono text-[11px] text-muted">
                            {s + 1}
                        </span>

                        <div className="flex flex-col gap-1">
                            {[reference, variant].map((seq, k) => (
                                <div key={k} className="flex gap-1">
                                    {seq
                                        .slice(s, Math.min(s + BLOCK, end))
                                        .split('')
                                        .map((aa, i) => {
                                            const index = s + i
                                            const isVariantPosition =
                                                index + 1 === position

                                            return (
                                                <span
                                                    key={i}
                                                    className={cell(
                                                        diffs.has(index) || isVariantPosition,
                                                        k === 0 ? 'ref' : 'var'
                                                    )}
                                                    title={`Position ${index + 1}`}
                                                >
                                                    {aa}
                                                </span>
                                            )
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
