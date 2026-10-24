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
            <h1 className="fluid-h1 mt-3 break-words font-extrabold tracking-tight">{title}</h1>
            {children && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{children}</p>}
        </div>
    )
}