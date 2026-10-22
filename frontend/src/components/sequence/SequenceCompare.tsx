import Card from '../layout/Card'

type Props = {
    reference: string
    variant: string
    fullLength: number
}

const BLOCK = 10

export default function SequenceCompare({ reference, variant, fullLength }: Props) {
    const diffs = new Set<number>()
    const len = Math.max(reference.length, variant.length)
    for (let i = 0; i < len; i++) if (reference[i] !== variant[i]) diffs.add(i)

    const starts = Array.from({ length: Math.ceil(len / BLOCK) }, (_, r) => r * BLOCK)

    const cell = (aa: string, diff: boolean, kind: 'ref' | 'var') =>
        `grid h-7 w-6 place-items-center rounded-md font-mono text-sm font-semibold transition duration-200 sm:h-8 sm:w-8 ${diff
            ? kind === 'ref'
                ? 'scale-110 bg-brand text-brand-ink shadow-md'
                : 'scale-110 bg-hot text-[#2b0b05] shadow-md'
            : 'bg-soft text-muted hover:bg-line hover:text-ink'
        }`

    return (
        <Card
            title="Sequence comparison"
            tag={`${diffs.size} changed, showing 1 to ${len} of ${fullLength}`}
            className="md:col-span-6"
        >
            <div className="mb-3 flex gap-4 text-xs font-semibold text-muted">
                <span className="flex items-center gap-1.5">
                    <i className="h-3 w-3 rounded bg-brand" /> Reference
                </span>
                <span className="flex items-center gap-1.5">
                    <i className="h-3 w-3 rounded bg-hot" /> Variant
                </span>
            </div>

            <div className="flex flex-col gap-3 overflow-x-auto pb-2">
                {starts.map((start) => (
                    <div key={start} className="flex items-center gap-3">
                        <span className="w-7 shrink-0 text-right font-mono text-[11px] text-muted">
                            {start + 1}
                        </span>
                        <div className="flex flex-col gap-1">
                            {[reference, variant].map((seq, k) => (
                                <div key={k} className="flex gap-1">
                                    {seq
                                        .slice(start, start + BLOCK)
                                        .split('')
                                        .map((aa, i) => (
                                            <span
                                                key={i}
                                                className={cell(aa, diffs.has(start + i), k === 0 ? 'ref' : 'var')}
                                            >
                                                {aa}
                                            </span>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}