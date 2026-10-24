import { useEffect, useState } from 'react'
import { loadKnownVariants } from '../../lib/knownVariants'
import type { KnownVariant } from '../../lib/knownVariants'
import Card from '../layout/Card'

type Props = { acc: string; onPick: (variant: string) => void }

type State = { acc: string; status: 'loading' | 'ready' | 'error'; items: KnownVariant[]; error?: string }

const SHOW_FIRST = 12

export default function KnownVariants({ acc, onPick }: Props) {
    const [state, setState] = useState<State>({ acc: '', status: 'loading', items: [] })
    const [all, setAll] = useState(false)

    useEffect(() => {
        const ctrl = new AbortController()
        loadKnownVariants(acc, ctrl.signal)
            .then((items) => setState({ acc, status: 'ready', items }))
            .catch((e) => {
                if (ctrl.signal.aborted) return
                setState({ acc, status: 'error', items: [], error: e instanceof Error ? e.message : 'Something went wrong.' })
            })
        return () => ctrl.abort()
    }, [acc])

    const loading = state.acc !== acc || state.status === 'loading'
    const shown = all ? state.items : state.items.slice(0, SHOW_FIRST)

    return (
        <Card title="Known changes in this protein" className="fade-up mb-4">
            <p className="mb-4 text-sm text-muted">
                A variant is one amino acid swapped for another, written like E7V. These are listed by UniProt for {acc}. Pick one to analyze it.
            </p>
            {loading && (
                <div className="flex flex-wrap gap-2" aria-busy="true">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-soft" />
                    ))}
                </div>
            )}
            {!loading && state.status === 'error' && <p className="text-sm text-hot">{state.error}</p>}
            {!loading && state.status === 'ready' && state.items.length === 0 && (
                <p className="text-sm text-muted">UniProt lists no single letter changes for this protein. Try an example or type your own change above.</p>
            )}
            {!loading && state.status === 'ready' && state.items.length > 0 && (
                <>
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {shown.map((v) => (
                            <li key={v.label}>
                                <button
                                    type="button"
                                    onClick={() => onPick(v.label)}
                                    title={v.note || v.label}
                                    className="w-full rounded-2xl border border-line bg-soft px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                                >
                                    <span className="block text-sm font-bold">{v.label}</span>
                                    <span className="mt-0.5 block truncate text-xs text-muted">{v.note || 'No note from UniProt'}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    {state.items.length > SHOW_FIRST && (
                        <button
                            type="button"
                            onClick={() => setAll((a) => !a)}
                            className="mt-3 text-sm font-bold text-link transition duration-200 hover:opacity-80"
                        >
                            {all ? 'Show fewer' : `Show all ${state.items.length}`}
                        </button>
                    )}
                    <p className="mt-3 text-xs text-muted">A listed change is a database fact. It does not prove what the change does.</p>
                </>
            )}
        </Card>
    )
}