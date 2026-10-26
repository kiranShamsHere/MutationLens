import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import Card from '../components/layout/Card'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import ProteinSearch from '../components/explore/ProteinSearch'
import { AMINO_ACIDS, signed, signedInt } from '../lib/aminoAcids'
import { exploreLink } from '../lib/examples'
import { loadVariant } from '../lib/uniprot'
import type { LoadedVariant } from '../types'

type Row = { change: string; data?: LoadedVariant; error?: string }

export default function Compare() {
    const [params, setParams] = useSearchParams()
    const acc = params.get('acc') ?? ''
    const raw = params.get('c') ?? ''
    const changes = Array.from(
        new Set(raw.split(/[\s,]+/).map((s) => s.trim().toUpperCase()).filter(Boolean)),
    ).slice(0, 4)
    const key = acc && changes.length ? `${acc}|${changes.join(',')}` : ''
    const [done, setDone] = useState<{ key: string; rows: Row[] } | null>(null)

    useEffect(() => {
        if (!key) return
        const ctrl = new AbortController()
        Promise.allSettled(changes.map((c) => loadVariant(acc, c, ctrl.signal))).then((results) => {
            if (ctrl.signal.aborted) return
            setDone({
                key,
                rows: results.map((r, i) =>
                    r.status === 'fulfilled'
                        ? { change: changes[i], data: r.value }
                        : { change: changes[i], error: r.reason instanceof Error ? r.reason.message : 'Something went wrong.' },
                ),
            })
        })
        return () => ctrl.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    const loading = Boolean(key) && done?.key !== key
    const rows = done?.key === key ? done.rows : []
    const name = rows.find((r) => r.data)?.data?.name

    const th = 'whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-muted'
    const td = 'px-4 py-4 text-sm'

    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="Compare" title="Compare changes side by side">
                Pick a protein, then type up to 4 changes in it. You can see which one swaps the most, in one table.
            </PageHeader>

            <div className="mt-10 space-y-4">
                {!acc && <ProteinSearch onPick={(a) => setParams(new URLSearchParams({ acc: a }))} />}

                {acc && (
                    <form
                        key={raw}
                        onSubmit={(e) => {
                            e.preventDefault()
                            const c = String(new FormData(e.currentTarget).get('c') ?? '')
                            setParams(new URLSearchParams({ acc, c }))
                        }}
                        className="rounded-3xl border border-line bg-surface p-5 shadow-sm sm:p-7"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted">
                                Protein: <span className="font-mono font-bold text-ink">{acc}</span>
                            </p>
                            <button
                                type="button"
                                onClick={() => setParams(new URLSearchParams())}
                                className="text-sm font-bold text-link transition duration-200 hover:opacity-80"
                            >
                                Choose another protein
                            </button>
                        </div>
                        <label className="mt-4 block">
                            <span className="text-xs font-bold uppercase tracking-widest text-muted">Changes to compare</span>
                            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                <input
                                    name="c"
                                    defaultValue={raw}
                                    placeholder="For example G12D, G12V, G12C"
                                    className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-3.5 text-sm font-semibold outline-none transition duration-200 placeholder:font-normal placeholder:text-muted hover:border-brand/60 focus:border-brand"
                                />
                                <button className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                                    Compare
                                </button>
                            </div>
                        </label>
                        <p className="mt-3 text-sm text-muted">Separate changes with commas or spaces.</p>
                    </form>
                )}

                {loading && <div className="h-56 animate-pulse rounded-3xl bg-soft" aria-busy="true" />}

                {rows.length > 0 && (
                    <Card title={name ?? acc} tag="Calculated by this app" className="fade-up">
                        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                            <table className="w-full min-w-[640px] border-collapse">
                                <thead>
                                    <tr className="border-b border-line">
                                        <th className={th}>Change</th>
                                        <th className={th}>Type</th>
                                        <th className={th}>Charge</th>
                                        <th className={th}>Water score</th>
                                        <th className={th}>In UniProt</th>
                                        <th className={th}></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {rows.map((r) => {
                                        if (!r.data) {
                                            return (
                                                <tr key={r.change}>
                                                    <td className={`${td} font-mono font-bold`}>{r.change}</td>
                                                    <td className={`${td} text-hot`} colSpan={5}>
                                                        {r.error}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        const a = AMINO_ACIDS[r.data.ref]
                                        const b = AMINO_ACIDS[r.data.alt]
                                        return (
                                            <tr key={r.change} className="transition duration-200 hover:bg-soft">
                                                <td className={`${td} font-mono font-bold`}>{r.data.label}</td>
                                                <td className={td}>{a.group} to {b.group}</td>
                                                <td className={`${td} font-mono`}>{signedInt(b.charge - a.charge)}</td>
                                                <td className={`${td} font-mono font-bold text-sun`}>{signed(b.kd - a.kd)}</td>
                                                <td className={td}>
                                                    {r.data.listedInUniProt ? (
                                                        <span className="inline-flex items-center gap-1 font-semibold text-link"><Check size={14} /> Listed</span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-muted"><X size={14} /> Not listed</span>
                                                    )}
                                                </td>
                                                <td className={td}>
                                                    <Link
                                                        to={exploreLink(acc, r.data.label)}
                                                        className="whitespace-nowrap text-sm font-bold text-link transition duration-200 hover:opacity-80"
                                                    >
                                                        Open
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-xs leading-relaxed text-muted">
                            Water score is the change in hydropathy. A bigger number means a bigger swap. It does not tell you what the change does in a cell.
                        </p>
                    </Card>
                )}
            </div>
        </Container>
    )
}