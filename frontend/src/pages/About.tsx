import { Link } from 'react-router-dom'
import { FlaskConical, GraduationCap, Presentation, Sparkles, TriangleAlert } from 'lucide-react'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'

const problem = [
    ['Too much to read', 'Protein databases hold everything. The pages are long and full of technical words, so beginners get lost.'],
    ['Numbers do not match', 'One paper says spot 6, another says spot 7 for the same change. Without a check, people look at the wrong spot.'],
    ['Pieces live in different places', 'The sequence is in one site, the 3D shape in another, and the notes in a third.'],
]

const features = [
    ['Search by name', 'Type a protein or gene name. No ID needed.'],
    ['Plain description', 'What the protein does, where it works, how big it is, in short paragraphs.'],
    ['Known changes', 'The changes UniProt already lists for the protein, ready to click.'],
    ['Plain explanation', 'What one swapped amino acid is, with a simple and a technical view.'],
    ['Sequence comparison', 'The normal and the changed protein side by side, with the spot marked.'],
    ['3D view', 'The protein shape with the changed spot highlighted. Experimental structure first, AlphaFold model if none exists.'],
    ['Compare changes', 'Put up to 4 changes of one protein in a single table.'],
    ['Sources and export', 'Every result links to its record. Download a report, copy a link, or save a PDF.'],
]

const audience = [
    { icon: GraduationCap, title: 'Students', text: 'Learn what a change in a protein means without reading a paper first. The Learn page explains every word.' },
    { icon: FlaskConical, title: 'Researchers', text: 'Check a variant against the live UniProt record, see the notes at that spot, and export the data.' },
    { icon: Presentation, title: 'Teachers', text: 'Share a link to any variant with your class. Everyone sees the same page.' },
    { icon: Sparkles, title: 'Curious people', text: 'Ever wondered what one tiny change in a protein can do? Start with an example and look around.' },
]

const compare = [
    ['UniProt', 'The biggest public protein database. It has everything, but it is made for experts to search and read.'],
    ['RCSB PDB', 'The home of 3D structures. You need to know a structure ID and work out the numbering yourself.'],
    ['Sites like ClinVar', 'They collect reports about variants and health. They are for medical and research reading.'],
    ['MutationLens', 'Starts from a protein name, explains in plain words, puts sequence, 3D and notes on one page, checks the numbering, and links back to every source.'],
]

const rules = [
    'Every result links back to the record it came from.',
    'The old letter is checked against the live UniProt sequence before anything is shown.',
    'A residue is highlighted in 3D only when its position is mapped with PDBe SIFTS, or checked by the team.',
    'Facts from databases and numbers we calculate are labeled separately.',
    'An AlphaFold model is always called a prediction.',
]

const limits = [
    'It is not a medical tool and gives no health advice.',
    'It describes the two amino acids. It cannot tell you what a change does in a real cell.',
    'It handles one swapped letter at a time, like E7V.',
    'It needs an internet connection, because it reads UniProt and the 3D databases live.',
]

const faq = [
    ['Do I need to know a UniProt ID?', 'No. Search by protein or gene name and pick the result. The ID is filled in for you. If you already have an ID you can type it in the same box.'],
    ['Why is a change written E6V in one paper and E7V here?', 'Some papers skip the first amino acid, methionine, when they count. UniProt counts it. MutationLens uses the UniProt number and checks the old letter, so a mismatch is caught.'],
    ['Is the 3D model always real?', 'Not always. If no experimental structure covers the spot, we show the AlphaFold model. It is a computer prediction, and the page says so.'],
    ['Can I use this in my homework or paper?', 'Use it to understand and explore. For a paper, cite the original sources, like UniProt and the PDB, and check the details there.'],
    ['Do you store my searches?', 'Your recent searches stay in your own browser only. There are no accounts and we do not keep them on a server.'],
]

const team = [
    { name: 'Kiran Shams', role: 'UI and frontend', url: 'https://www.linkedin.com/in/kiranshams/' },
    { name: 'Huzaifa Ahmed Bhutto', role: 'Analysis', url: 'https://www.linkedin.com/in/huzaifa-ahmed-bhutto-880441317/' },
    { name: 'Muhammad Saleem', role: '3D structure', url: 'https://www.linkedin.com/in/muhammad-saleem-junejo/' },
]

function LinkedIn() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
    )
}

const h2 = 'fluid-h2 font-extrabold tracking-tight'
const card = 'rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl sm:p-7'

export default function About() {
    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="About" title="A simple way to understand protein changes">
                Proteins are made of small building blocks called amino acids. Sometimes one block in the chain is swapped for another. MutationLens shows you that swap: what changed, where it sits, and what public databases say about it.
            </PageHeader>

            <section className="mt-16">
                <h2 className={h2}>Why we built it</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                    The information about a protein change already exists in public databases. The hard part is finding it, reading it, and trusting that you are looking at the right spot.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {problem.map(([t, d]) => (
                        <div key={t} className={card}>
                            <h3 className="text-lg font-extrabold">{t}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className={h2}>What you can do</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map(([t, d]) => (
                        <div key={t} className={card}>
                            <h3 className="font-extrabold">{t}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className={h2}>Who it is for</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {audience.map(({ icon: Icon, title, text }) => (
                        <div key={title} className={`group ${card}`}>
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-link transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                                <Icon size={22} />
                            </span>
                            <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className={h2}>How it is different</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">
                    We do not replace these sites. We help you reach them with less confusion, and every result links back to them.
                </p>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                    {compare.map(([t, d]) => (
                        <div key={t} className="grid gap-1 py-5 sm:grid-cols-[180px_1fr] sm:gap-8">
                            <dt className={`font-extrabold ${t === 'MutationLens' ? 'text-link' : ''}`}>{t}</dt>
                            <dd className="leading-relaxed text-muted">{d}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="mt-16 grid gap-10 lg:grid-cols-2">
                <div>
                    <h2 className={h2}>How we keep it honest</h2>
                    <ol className="mt-6 space-y-4">
                        {rules.map((r, i) => (
                            <li key={r} className="flex gap-4 leading-relaxed text-muted">
                                <span className="font-mono font-bold text-link">{i + 1}</span>
                                {r}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="flex flex-col gap-4 rounded-3xl border border-sun/50 bg-sun/10 p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun/25">
                            <TriangleAlert size={20} />
                        </span>
                        <h2 className="text-xl font-extrabold">What it is not</h2>
                    </div>
                    <ul className="space-y-3">
                        {limits.map((l) => (
                            <li key={l} className="flex gap-3 text-sm leading-relaxed text-muted">
                                <i className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />
                                {l}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="mt-16">
                <h2 className={h2}>Questions people ask</h2>
                <div className="mt-6 divide-y divide-line border-y border-line">
                    {faq.map(([q, a]) => (
                        <details key={q} className="group py-5">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold transition duration-200 hover:text-link [&::-webkit-details-marker]:hidden">
                                {q}
                                <span className="text-xl text-muted transition duration-200 group-open:rotate-45">+</span>
                            </summary>
                            <p className="mt-3 max-w-3xl leading-relaxed text-muted">{a}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <h2 className={h2}>The team behind MutationLens</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {team.map((m) => (
                        <div key={m.name} className={card}>
                            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-xl font-extrabold text-brand-ink">
                                {m.name[0]}
                            </span>
                            <p className="mt-5 font-extrabold leading-snug">{m.name}</p>
                            <p className="mt-1 text-sm text-muted">{m.role}</p>
                            <a
                                href={m.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${m.name} on LinkedIn`}
                                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-link"
                            >
                                <LinkedIn />
                                <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                                    LinkedIn
                                </span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <Link to="/explore" className="mt-14 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                Try the explorer
            </Link>
        </Container>
    )
}