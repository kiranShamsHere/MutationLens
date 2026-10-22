import { ExternalLink } from 'lucide-react'
import Card from '../layout/Card'
import type { VariantExample } from '../../types'

type Props = { example: VariantExample }

export default function EvidencePanel({ example }: Props) {
    const { protein, variant, structure } = example

    const items = [
        { label: `UniProt ${protein.uniprotAccession}`, hint: 'Sequence record', href: protein.uniprotUrl },
        { label: `Variant ${variant.label}`, hint: 'Variant source', href: variant.sourceUrl },
        ...(structure.pdbId
            ? [{ label: `PDB ${structure.pdbId}`, hint: 'Structure record', href: `https://www.rcsb.org/structure/${structure.pdbId}` }]
            : []),
    ]

    return (
        <Card title="Evidence and sources" tag="From database" className="md:col-span-2">
            <ul className="flex flex-col gap-2">
                {items.map((it) => (
                    <li key={it.label}>
                        <a
                            href={it.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between rounded-2xl bg-soft px-4 py-3 transition duration-200 hover:translate-x-1 hover:bg-brand/15"
                        >
                            <span>
                                <span className="block text-sm font-bold">{it.label}</span>
                                <span className="block text-xs text-muted">{it.hint}</span>
                            </span>
                            <ExternalLink size={16} className="text-link transition duration-200 group-hover:scale-110" />
                        </a>
                    </li>
                ))}
            </ul>
        </Card>
    )
}