import { ExternalLink } from 'lucide-react'
import Container from '../components/layout/Container'
import PageHeader from '../components/layout/PageHeader'

type Source = {
    name: string
    href: string
    use: string
    cite?: { text: string; doi: string; href: string }
}

const sources: Source[] = [
    {
        name: 'UniProt',
        href: 'https://www.uniprot.org/',
        use: 'Protein sequences and notes. We read it live every time you analyze a variant.',
    },
    {
        name: 'RCSB Protein Data Bank',
        href: 'https://www.rcsb.org/',
        use: '3D protein structures. The curated examples open with a checked structure. For your own variants you enter the structure ID and check the residue match yourself.',
    },
    {
        name: 'PDBe',
        href: 'https://www.ebi.ac.uk/pdbe/',
        use: 'Its SIFTS mapping links UniProt positions to the residue numbers used in a 3D structure. We use it to check residue mapping.',
    },
    {
        name: 'Mol*',
        href: 'https://molstar.org/',
        use: 'The 3D viewer on the Explore page. It is the same viewer that RCSB PDB and PDBe use on their own sites.',
        cite: {
            text: 'Sehnal et al., \u201CMol* Viewer: modern web app for 3D visualization and analysis of large biomolecular structures\u201D, Nucleic Acids Research 2021, 49(W1): W431-W437,',
            doi: 'doi:10.1093/nar/gkab314',
            href: 'https://doi.org/10.1093/nar/gkab314',
        },
    },
    {
        name: 'Kyte and Doolittle scale',
        href: 'https://en.wikipedia.org/wiki/Hydrophobicity_scales',
        use: 'The hydropathy numbers behind the water score.',
    },
]

const rules = [
    'Every result links back to where it came from.',
    'The old letter is checked against the live UniProt sequence.',
    'A residue is highlighted in 3D only after the match is confirmed. The curated examples were checked by the team, for your own variants you confirm it.',
    'Database facts and numbers we calculate are labeled separately.',
    'Nothing here is a diagnosis or medical advice.',
]

export default function Sources() {
    return (
        <Container as="main" className="py-10 sm:py-14">
            <PageHeader eyebrow="Sources" title="Where the data comes from">
                Everything on MutationLens comes from public databases. We list them here so you can check the originals.
            </PageHeader>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
                <section>
                    <h2 className="text-2xl font-extrabold tracking-tight">Data we use</h2>
                    <ul className="mt-6 divide-y divide-line border-y border-line">
                        {sources.map((s) => (
                            <li key={s.name} className="py-6">
                                <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2">
                                    <span className="relative inline-block font-extrabold after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                                        {s.name}
                                    </span>
                                    <ExternalLink size={16} className="shrink-0 text-muted transition duration-200 group-hover:text-link" />
                                </a>
                                <p className="mt-1.5 leading-relaxed text-muted">{s.use}</p>
                                {s.cite && (
                                    <p className="mt-3 border-l-2 border-brand/50 pl-4 text-sm leading-relaxed text-muted">
                                        {s.cite.text}{' '}
                                        <a
                                            href={s.cite.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-semibold text-link underline-offset-4 transition duration-200 hover:underline"
                                        >
                                            {s.cite.doi}
                                        </a>
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="lg:border-l lg:border-line lg:pl-12">
                    <h2 className="text-2xl font-extrabold tracking-tight">How we keep results honest</h2>
                    <ol className="mt-6 space-y-5">
                        {rules.map((r, i) => (
                            <li key={r} className="flex gap-4 leading-relaxed text-muted">
                                <span className="font-mono font-bold text-link">{i + 1}</span>
                                {r}
                            </li>
                        ))}
                    </ol>
                </section>
            </div>
        </Container>
    )
}