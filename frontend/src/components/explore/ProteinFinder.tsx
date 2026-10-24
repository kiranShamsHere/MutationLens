import { useEffect, useState } from 'react'
import { Check, ExternalLink, Search } from 'lucide-react'
import { searchProteins } from '../../lib/proteinSearch'
import type { ProteinHit } from '../../lib/proteinSearch'

type Props = { onPick: (accession: string) => void }

type State = { status: 'idle' | 'loading' | 'ready' | 'error'; hits: ProteinHit[]; error?: string }

const input =
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm font-semibold outline-none transition duration-200 placeholder:font-normal placeholder:text-muted hover:border-brand/60 focus:border-brand'

export default function ProteinFinder({ onPick }: Props) {
    const [query, setQuery] = useState('')
    const [humanOnly, setHumanOnly] = useState(true)
    const [state, setState] = useState<State>({ status: 'idle', hits: [] })
    const [picked, setPicked] = useState('')

    const q = query.trim()
    const active = q.length >= 2
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
        <details className="group mt-4 rounded-3xl border border-line bg-surface p-5 shadow-sm">
            <summary className="cursor-pointer text-sm font-bold text-link transition hover:opacity-80">
                Do not know the UniProt ID? Search by protein name
            </summary>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <label className="relative block">
                    <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Protein or gene name, for example hemoglobin, KRAS or p53"
                        aria-label="Search proteins by name"
                        className={`${input} pl-10`}
                    />
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                    <input
                        type="checkbox"
                        checked={humanOnly}
                        onChange={(e) => setHumanOnly(e.target.checked)}
                        className="accent-[var(--brand)]"
                    />
                    Human proteins only
                </label>
            </div>

            <div className="mt-4" aria-live="polite">
                {view.status === 'idle' && (
                    <p className="text-sm text-muted">Type at least 2 letters. Pick a result and we fill in its UniProt ID for you.</p>
                )}
                {view.status === 'loading' && (
                    <div className="space-y-2" aria-busy="true">
                        <div className="h-14 animate-pulse rounded-2xl bg-soft" />
                        <div className="h-14 animate-pulse rounded-2xl bg-soft" />
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
                            <li key={h.accession} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-soft px-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold">{h.name}</p>
                                    <p className="mt-0.5 text-xs text-muted">
                                        {h.gene && <span className="font-bold text-ink">{h.gene} · </span>}
                                        {h.organism} · {h.length} aa ·{' '}
                                        <span className="font-mono">{h.accession}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`https://www.uniprot.org/uniprotkb/${h.accession}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Open ${h.accession} on UniProt`}
                                        className="rounded-xl border border-line p-2 text-muted transition duration-200 hover:border-brand hover:text-ink"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPicked(h.accession)
                                            onPick(h.accession)
                                        }}
                                        className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                                    >
                                        {picked === h.accession ? <Check size={14} /> : null}
                                        Use this protein
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {picked && (
                    <p className="mt-3 text-sm text-muted">
                        <span className="font-mono font-bold text-ink">{picked}</span> is filled in above. Now type a change like E7V and press Analyze.
                    </p>
                )}
            </div>
        </details>
    )
}