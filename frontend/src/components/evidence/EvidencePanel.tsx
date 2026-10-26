import { ExternalLink } from 'lucide-react'
import Card from '../layout/Card'
import type { LoadedVariant, StructureInput } from '../../types'

type Props = { data: LoadedVariant; structure: StructureInput }

export default function EvidencePanel({ data, structure }: Props) {
    const items = [
        { label: `UniProt ${data.accession}`, hint: 'Sequence record', href: `https://www.uniprot.org/uniprotkb/${data.accession}` },
        ...(structure.pdbId
            ? [structure.kind === 'predicted'
                ? { label: `AlphaFold ${structure.pdbId}`, hint: 'Predicted model, not an experiment', href: `https://alphafold.ebi.ac.uk/entry/${data.accession}` }
                : { label: `PDB ${structure.pdbId}`, hint: 'Structure record', href: `https://www.rcsb.org/structure/${structure.pdbId}` }]
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