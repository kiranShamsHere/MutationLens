import { Link } from 'react-router-dom'
import { FlaskConical, GraduationCap, Presentation, TriangleAlert } from 'lucide-react'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'

const audience = [
    { icon: GraduationCap, title: 'Students', text: 'Learn what a change in a protein means, in plain words.' },
    { icon: FlaskConical, title: 'Researchers', text: 'Check a variant against UniProt, read the notes at that spot, and export the data.' },
    { icon: Presentation, title: 'Teachers', text: 'Share a link to any variant with your class.' },
]

const steps = [
    ['01', 'Type a change', 'Enter a UniProt ID and a change like E7V.'],
    ['02', 'We check it', 'We read the real sequence and make sure the old letter is right.'],
    ['03', 'See the result', 'Read what it means, look at the notes, view it in 3D, and export your report.'],
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

export default function About() {
    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="About" title="A simple way to understand protein changes">
                Proteins are made of small building blocks called amino acids. Sometimes one block in the chain is swapped for another. MutationLens shows you that swap: what changed, where it sits, and what public databases say about it.
            </PageHeader>

            {/* who it is for */}
            <section className="mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight">Who it is for</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {audience.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="group rounded-3xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl">
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/15 text-link transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                                <Icon size={22} />
                            </span>
                            <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* how it works */}
            <section className="mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight">How it works</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {steps.map(([n, t, d]) => (
                        <div key={n} className="rounded-3xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <span className="font-mono text-3xl font-bold text-sun">{n}</span>
                            <h3 className="mt-4 text-lg font-extrabold">{t}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* what it is not */}
            <section className="mt-16 flex flex-col gap-5 rounded-3xl border border-sun/50 bg-sun/10 p-7 sm:flex-row sm:items-start sm:p-9">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun/25">
                    <TriangleAlert size={22} />
                </span>
                <div>
                    <h2 className="text-xl font-extrabold">What it is not</h2>
                    <p className="mt-2 max-w-3xl leading-relaxed text-muted">
                        MutationLens is not a medical tool. A sequence change on its own cannot tell you if something causes a disease. Please do not use it to make health decisions.
                    </p>
                </div>
            </section>

            {/* team */}
            <section className="mt-16">
                <h2 className="text-2xl font-extrabold tracking-tight">The team behind MutationLens</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {team.map((m) => (
                        <div key={m.name} className="rounded-3xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
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