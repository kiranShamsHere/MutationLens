import { Link } from 'react-router-dom'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'

const terms = [
    ['Protein', 'A long chain of small building blocks. Each protein does a job in the body, like carrying oxygen.'],
    ['Amino acid', 'One building block of a protein. There are 20 kinds. Each has a one letter code, like E or V.'],
    ['Residue', 'An amino acid that is part of a protein chain. People say "residue 7" to mean the 7th spot in the chain.'],
    ['Variant', 'A version of a protein that is different from the usual one.'],
    ['Substitution', 'A variant where one amino acid is swapped for another. E7V means the E at spot 7 is swapped for V.'],
    ['Reference sequence', 'The standard version of the protein that other versions are compared to.'],
    ['UniProt', 'A free public database of proteins. Each protein has an ID, like P68871.'],
    ['PDB', 'The Protein Data Bank. It stores 3D shapes of proteins. Each entry has a 4 character ID.'],
    ['Chain', 'One strand of protein inside a 3D structure. Some structures hold several chains, named A, B and so on.'],
    ['Hydropathy', 'A score for how much an amino acid avoids water. A higher number means it avoids water more. We use the Kyte and Doolittle scale.'],
    ['Numbering', 'Different sources can start counting from different places. Some skip the first methionine, so the same spot can be 6 in one paper and 7 in UniProt. MutationLens checks the old letter so you notice a mismatch.'],
]

export default function Learn() {
    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="Learn" title="New to this? Start here">
                You do not need a biology degree to use MutationLens. Here is what the words mean.
            </PageHeader>

            <div className="mt-12 grid gap-10 lg:grid-cols-[380px_1fr] lg:items-start">
                <aside className="rounded-3xl border border-line bg-surface p-7 sm:p-8 lg:sticky lg:top-24">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted">How to read a change</h2>
                    <div className="mt-6 flex items-center gap-3 font-mono text-4xl font-bold">
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-brand-ink">E</span>
                        <span className="text-muted">7</span>
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-hot text-[#2b0b05]">V</span>
                    </div>
                    <p className="mt-6 leading-relaxed text-muted">
                        At spot 7, the letter E (glutamate) is replaced by the letter V (valine).
                    </p>
                    <Link
                        to="/explore"
                        className="mt-7 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        Try it yourself
                    </Link>
                </aside>

                <dl className="divide-y divide-line border-y border-line">
                    {terms.map(([t, d]) => (
                        <div key={t} className="grid gap-1 py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
                            <dt className="font-extrabold">{t}</dt>
                            <dd className="leading-relaxed text-muted">{d}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </Container>
    )
}