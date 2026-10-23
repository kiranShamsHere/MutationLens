import type { ReactNode } from 'react'

type Props = {
    eyebrow: string
    title: string
    children?: ReactNode
}

export default function PageHeader({ eyebrow, title, children }: Props) {
    return (
        <div className="fade-up max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-link">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
            {children && <p className="mt-4 text-lg leading-relaxed text-muted">{children}</p>}
        </div>
    )
}