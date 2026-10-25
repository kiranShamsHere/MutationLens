import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Box, FileDown, Layers, Link2, Search } from 'lucide-react'
import Container from '../components/layout/Container'
import { EXAMPLES, exploreLink } from '../lib/examples'

const features = [
    { icon: Layers, title: 'Compare sequences', text: 'See the normal protein and the changed one side by side, with the changed spot marked.', span: 'md:col-span-3' },
    { icon: Box, title: 'View it in 3D', text: 'Load a structure from the PDB and see where the change sits. We only highlight it after you confirm the match.', span: 'md:col-span-3' },
    { icon: Link2, title: 'Check the sources', text: 'Every result links back to the UniProt and PDB records it came from.', span: 'md:col-span-3' },
    { icon: FileDown, title: 'Save your results', text: 'Download a report, copy a share link, or save a PDF through print.', span: 'md:col-span-3' },
]

const steps = [
    ['01', 'Enter a change', 'A UniProt ID and a change like E7V.'],
    ['02', 'We check it', 'We read the real sequence and make sure the old letter is correct.'],
    ['03', 'Learn and export', 'Read what it means, look at the notes, then download your report.'],
]

const audience = [
    ['Students', 'Learn what a change in a protein means, in plain words. The Learn page explains every term.'],
    ['Researchers', 'Check a variant against the live UniProt record, read the position notes, and export the data.'],
    ['Teachers', 'Share a link to any variant with your class. Every result opens the same way for everyone.'],
]

export default function Home() {
    const navigate = useNavigate()

    return (
        <Container as="main">
            {/* hero */}
            <section className="grid grid-cols-1 items-center gap-10 py-10 sm:gap-12 sm:py-24 lg:grid-cols-[1.2fr_1fr]">
                <div className="fade-up">
                    <h1 className="fluid-hero break-words font-extrabold tracking-tight">
                        See what one amino acid{' '}
                        <span className="bg-linear-to-r from-brand via-sun to-hot bg-clip-text text-transparent">changes.</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
                        Compare a protein with a changed version, view it in 3D, and check the original records. Made for students, researchers and anyone curious.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            const f = new FormData(e.currentTarget)
                            navigate(exploreLink(String(f.get('acc')).trim().toUpperCase(), String(f.get('v')).trim().toUpperCase()))
                        }}
                        className="mt-7 flex flex-col gap-2.5 rounded-3xl border border-line bg-surface p-2.5 shadow-lg transition duration-300 focus-within:border-brand sm:mt-9 sm:flex-row sm:gap-3 sm:p-3"
                    >
                        <input name="acc" required placeholder="UniProt ID, P68871" aria-label="UniProt ID" className="min-w-0 flex-1 rounded-xl bg-bg px-4 py-3.5 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted" />
                        <input name="v" required placeholder="Change, E7V" aria-label="Change" className="min-w-0 flex-1 rounded-xl bg-bg px-4 py-3.5 text-sm font-semibold outline-none placeholder:font-normal placeholder:text-muted" />
                        <button className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                            <Search size={16} /> Analyze
                        </button>
                    </form>

                    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted">Try:</span>
                        {EXAMPLES.slice(0, 4).map((e) => (
                            <Link key={e.id} to={exploreLink(e.accession, e.variant)} className="rounded-full border border-line px-3.5 py-2 font-bold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-surface">
                                {e.gene} {e.variant}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="float rounded-3xl border border-line bg-surface p-5 shadow-2xl sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Variant summary</p>
                    <div className="mt-4 flex items-center gap-3 sm:mt-5 sm:gap-4">
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand font-mono text-3xl font-bold text-brand-ink sm:h-20 sm:w-20 sm:text-4xl">E</span>
                        <ArrowRight className="text-muted" />
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-hot font-mono text-3xl font-bold text-[#2b0b05] sm:h-20 sm:w-20 sm:text-4xl">V</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-1 font-mono text-sm font-semibold sm:mt-6">
                        {'MVHLTPEEKSAV'.split('').map((a, i) => (
                            <span key={i} className={`grid h-8 w-7 place-items-center rounded-md ${i === 6 ? 'bg-hot text-[#2b0b05]' : 'bg-soft text-muted'}`}>
                                {i === 6 ? 'V' : a}
                            </span>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold sm:mt-6">
                        <span className="rounded-full bg-sun/20 px-4 py-2">Negative to Nonpolar</span>
                        <span className="rounded-full bg-grape/20 px-4 py-2">Water score +7.7</span>
                    </div>
                </div>
            </section>

            {/* features */}
            <section>
                <h2 className="fluid-h2 font-extrabold tracking-tight">What you can do here</h2>
                <p className="mt-2 max-w-xl text-muted">Four simple tools in one place.</p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-6">
                    {features.map(({ icon: Icon, title, text, span }) => (
                        <div key={title} className={`group rounded-3xl border border-line bg-surface p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl sm:p-7 ${span}`}>
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-link transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                                <Icon size={22} />
                            </span>
                            <h3 className="mt-4 text-lg font-extrabold sm:mt-5">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* audience */}
            <section className="pt-14 sm:pt-20">
                <h2 className="fluid-h2 font-extrabold tracking-tight">Who it is for</h2>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-3">
                    {audience.map(([t, d]) => (
                        <div key={t} className="rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                            <h3 className="text-lg font-extrabold">{t}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* how it works */}
            <section className="py-14 sm:py-20">
                <h2 className="fluid-h2 font-extrabold tracking-tight">How it works</h2>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-3">
                    {steps.map(([n, t, d]) => (
                        <div key={n} className="rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
                            <span className="font-mono text-3xl font-bold text-sun">{n}</span>
                            <h3 className="mt-3 text-lg font-extrabold sm:mt-4">{t}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* cta */}
            <section className="rounded-3xl bg-linear-to-br from-brand to-sun p-7 text-center text-brand-ink sm:p-14">
                <h2 className="fluid-h2 font-extrabold tracking-tight">Ready to look closer?</h2>
                <p className="mx-auto mt-3 max-w-md font-semibold opacity-80">Bring your own protein and change, or start from an example.</p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-7 sm:flex-row">
                    <Link to="/explore" className="rounded-xl bg-brand-ink px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">Open the explorer</Link>
                    <Link to="/learn" className="rounded-xl bg-white/70 px-6 py-3.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:bg-white">New to this? Start here</Link>
                </div>
            </section>
        </Container>
    )
}