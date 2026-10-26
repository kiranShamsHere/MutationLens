import { useEffect, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { searchProteins } from '../../lib/proteinSearch'
import type { ProteinHit } from '../../lib/proteinSearch'
import ScrollRow, { chipClass } from '../layout/ScrollRow'

type Props = { initialQuery?: string; onPick: (accession: string) => void }

type State = { status: 'idle' | 'loading' | 'ready' | 'error'; hits: ProteinHit[]; error?: string }

const ACCESSION = /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i
const IDEAS = ['hemoglobin', 'KRAS', 'p53', 'insulin', 'BRCA1', 'EGFR']

export default function ProteinSearch({ initialQuery = '', onPick }: Props) {
    const [query, setQuery] = useState(initialQuery)
    const [humanOnly, setHumanOnly] = useState(true)
    const [state, setState] = useState<State>({ status: 'idle', hits: [] })

    const q = query.trim()
    const isId = ACCESSION.test(q)
    const active = q.length >= 2 && !isId
    const view: State = active ? state : { status: 'idle', hits: [] }

    useEffect(() => {
        if (!active) return
        const ctrl = new AbortController()
        const timer = setTimeout(() => {
            setState({ status: 'loading', hits: [] })
            searchProteins(q, humanOnly, ctrl.signal)
                .then((hits) => setState({ status: 'ready', hits }))
                .catch((e) => {
                    if (ctrl.signal.aborted) return
                    setState({ status: 'error', hits: [], error: e instanceof Error ? e.message : 'Something went wrong.' })
                })
        }, 400)
        return () => {
            clearTimeout(timer)
            ctrl.abort()
        }
    }, [q, humanOnly, active])

    return (
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-sm sm:p-7">
            <label className="block">
                <span className="text-xs font-bold uppercase tracking-widest text-muted">Find a protein</span>
                <span className="relative mt-3 block">
                    <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a name, a gene or a UniProt ID"
                        aria-label="Search proteins"
                        autoFocus={!initialQuery}
                        className="w-full rounded-2xl border border-line bg-bg py-4 pl-12 pr-4 text-base font-semibold outline-none transition duration-200 placeholder:font-normal placeholder:text-muted hover:border-brand/60 focus:border-brand"
                    />
                </span>
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <ScrollRow>
                    <span className="shrink-0 self-center text-sm text-muted">Try:</span>
                    {IDEAS.map((i) => (
                        <button key={i} type="button" onClick={() => setQuery(i)} className={`${chipClass} bg-soft`}>
                            {i}
                        </button>
                    ))}
                </ScrollRow>
                <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-muted">
                    <input
                        type="checkbox"
                        checked={humanOnly}
                        onChange={(e) => setHumanOnly(e.target.checked)}
                        className="accent-[var(--brand)]"
                    />
                    Human proteins only
                </label>
            </div>

            <div className="mt-5" aria-live="polite">
                {isId && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-brand/50 bg-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm">
                            Use the UniProt ID <span className="font-mono font-bold">{q.toUpperCase()}</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => onPick(q.toUpperCase())}
                            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                        >
                            Continue
                        </button>
                    </div>
                )}
                {!isId && view.status === 'idle' && (
                    <p className="text-sm text-muted">Start typing. For example hemoglobin, KRAS or p53. You do not need to know any ID.</p>
                )}
                {view.status === 'loading' && (
                    <div className="space-y-2" aria-busy="true">
                        <div className="h-16 animate-pulse rounded-2xl bg-soft" />
                        <div className="h-16 animate-pulse rounded-2xl bg-soft" />
                    </div>
                )}
                {view.status === 'error' && <p className="text-sm text-hot">{view.error}</p>}
                {view.status === 'ready' && view.hits.length === 0 && (
                    <p className="text-sm text-muted">
                        No reviewed protein found. Try the gene name (like KRAS){humanOnly ? ' or untick human proteins only' : ''}.
                    </p>
                )}
                {view.status === 'ready' && view.hits.length > 0 && (
                    <ul className="space-y-2">
                        {view.hits.map((h) => (
                            <li
                                key={h.accession}
                                className="flex flex-col gap-3 rounded-2xl border border-line bg-soft px-5 py-4 transition duration-200 hover:border-brand/60 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-bold">{h.name}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted">
                                        {h.gene && <span className="font-bold text-ink">{h.gene} · </span>}
                                        {h.organism} · {h.length} aa · <span className="font-mono">{h.accession}</span>
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <a
                                        href={`https://www.uniprot.org/uniprotkb/${h.accession}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Open ${h.accession} on UniProt`}
                                        className="rounded-xl border border-line p-2.5 text-muted transition duration-200 hover:border-brand hover:text-ink"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => onPick(h.accession)}
                                        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                                    >
                                        Choose
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}