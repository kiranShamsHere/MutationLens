import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { ProteinInfo, ProteinSection } from '../../types'

function Section({ title, paragraphs }: ProteinSection) {
    const [open, setOpen] = useState(false)
    const shown = open ? paragraphs : paragraphs.slice(0, 1)
    return (
        <div className="rounded-2xl bg-soft px-5 py-5 sm:px-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted">{title}</h4>
            <div className="mt-3 space-y-3">
                {shown.map((p, i) => (
                    <p key={i} className="text-[15px] leading-relaxed">{p}</p>
                ))}
            </div>
            {paragraphs.length > 1 && (
                <button
                    onClick={() => setOpen(!open)}
                    className="mt-3 text-sm font-bold text-link transition duration-200 hover:opacity-80"
                >
                    {open ? 'Show less' : `Read more (${paragraphs.length - 1} more)`}
                </button>
            )}
        </div>
    )
}

type Props = { info: ProteinInfo; compact?: boolean }

export default function ProteinAbout({ info, compact = false }: Props) {
    const facts: [string, string][] = [
        ['Gene', info.gene || 'Not listed'],
        ['Organism', info.organism || 'Not listed'],
        ['Length', `${info.length} amino acids`],
        ['Size', info.massKDa ? `${info.massKDa} kDa` : 'Not listed'],
    ]

    return (
        <div>
            <p className="text-base leading-relaxed sm:text-lg">{info.intro}</p>

            {!compact && (
                <>
                    <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {facts.map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-line px-4 py-3.5">
                                <dt className="text-xs font-semibold text-muted">{k}</dt>
                                <dd className="mt-1 break-words text-sm font-bold">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    {info.synonyms.length > 0 && (
                        <p className="mt-4 text-sm leading-relaxed text-muted">Also known as: {info.synonyms.join(', ')}</p>
                    )}
                </>
            )}

            <div className="mt-5 space-y-3">
                {info.sections.map((s) => (
                    <Section key={s.title} {...s} />
                ))}
                {info.sections.length === 0 && (
                    <p className="text-sm text-muted">UniProt has no description text for this protein yet.</p>
                )}
            </div>

            <a
                href={`https://www.uniprot.org/uniprotkb/${info.accession}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-link transition duration-200 hover:opacity-80"
            >
                Open {info.accession} on UniProt <ExternalLink size={14} />
            </a>
        </div>
    )
}