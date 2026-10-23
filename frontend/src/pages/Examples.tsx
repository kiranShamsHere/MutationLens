import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Plus, Search } from 'lucide-react'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'
import { EXAMPLES, exploreLink } from '../lib/examples'

const fields = ['All', ...Array.from(new Set(EXAMPLES.map((e) => e.field)))]

export default function Examples() {
    const [q, setQ] = useState('')
    const [field, setField] = useState('All')

    const list = EXAMPLES.filter(
        (e) =>
            (field === 'All' || e.field === field) &&
            `${e.gene} ${e.protein} ${e.variant} ${e.accession}`.toLowerCase().includes(q.toLowerCase()),
    )

    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="Examples" title="Start from a known variant">
                Each one is checked against the live UniProt record when you open it.
            </PageHeader>

            <label className="relative mt-10 block max-w-md">
                <span className="sr-only">Search examples</span>
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by gene, protein or change"
                    className="w-full rounded-xl border border-line bg-surface py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition duration-200 placeholder:font-normal placeholder:text-muted hover:border-brand/60 focus:border-brand"
                />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
                {fields.map((f) => (
                    <button
                        key={f}
                        aria-pressed={field === f}
                        onClick={() => setField(f)}
                        className={`rounded-full border px-4 py-2 text-sm font-bold transition duration-200 ${field === f ? 'border-ink bg-ink text-bg' : 'border-line text-muted hover:border-brand hover:text-ink'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((e) => (
                    <Link
                        key={e.id}
                        to={exploreLink(e.accession, e.variant)}
                        className="group flex flex-col rounded-3xl border border-line bg-surface p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-soft px-3 py-1.5 text-xs font-bold">{e.gene}</span>
                                <span className="rounded-full bg-soft px-3 py-1.5 text-xs font-semibold text-muted">{e.field}</span>
                            </div>
                            <ArrowUpRight size={18} className="shrink-0 text-muted transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link" />
                        </div>
                        <h2 className="mt-5 text-lg font-extrabold leading-snug">{e.protein}</h2>
                        <p className="mt-1 font-mono text-2xl font-bold text-hot">{e.variant}</p>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{e.blurb}</p>
                        <p className="mt-5 font-mono text-xs text-muted">UniProt {e.accession}</p>
                    </Link>
                ))}

                <Link
                    to="/explore"
                    className="group flex min-h-52 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-line p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-surface"
                >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-link transition duration-300 group-hover:rotate-90">
                        <Plus size={22} />
                    </span>
                    <span className="mt-4 font-extrabold">Try your own</span>
                    <span className="mt-1 text-sm text-muted">Any UniProt ID and change</span>
                </Link>
            </div>

            {list.length === 0 && <p className="mt-10 text-center text-muted">No examples match that search.</p>}
        </Container>
    )
}