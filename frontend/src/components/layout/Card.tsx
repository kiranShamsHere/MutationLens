import type { ReactNode } from 'react'

type Props = {
    children: ReactNode
    title?: string
    tag?: string
    className?: string
}

export default function Card({ children, title, tag, className = '' }: Props) {
    return (
        <section
            className={`rounded-3xl border border-line bg-surface p-5 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-xl ${className}`}
        >
            {(title || tag) && (
                <header className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted">{title}</h2>
                    {tag && (
                        <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-semibold text-muted">
                            {tag}
                        </span>
                    )}
                </header>
            )}
            {children}
        </section>
    )
}