import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { buildJson, buildMarkdown, download } from '../../lib/report'
import type { LoadedVariant, StructureInput } from '../../types'

type Props = { data: LoadedVariant; structure: StructureInput }

export default function ExportMenu({ data, structure }: Props) {
    const [open, setOpen] = useState(false)
    const box = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (!box.current?.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [])

    const base = `mutationlens_${data.gene || data.accession}_${data.label}`
    const items = [
        { label: 'Markdown report', hint: '.md', run: () => download(`${base}.md`, buildMarkdown(data, structure), 'text/markdown') },
        { label: 'JSON data', hint: '.json', run: () => download(`${base}.json`, JSON.stringify(buildJson(data, structure), null, 2), 'application/json') },
        { label: 'Print or save as PDF', hint: '', run: () => window.print() },
    ]

    return (
        <div ref={box} className="no-print relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-bg transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
                <Download size={16} /> Export report
                <ChevronDown size={14} className={`transition duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl border border-line bg-surface p-1.5 shadow-xl transition duration-200 ${open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
                    }`}
            >
                {items.map((it) => (
                    <button
                        key={it.label}
                        tabIndex={open ? 0 : -1}
                        onClick={() => {
                            it.run()
                            setOpen(false)
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition duration-150 hover:bg-soft"
                    >
                        {it.label}
                        <span className="font-mono text-xs text-muted">{it.hint}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}