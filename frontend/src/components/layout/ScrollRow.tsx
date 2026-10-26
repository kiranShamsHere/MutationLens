import type { ReactNode } from 'react'

export const chipClass =
    'shrink-0 whitespace-nowrap rounded-full border border-line px-4 py-2 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md'

// On phones the chips sit in one row you can swipe. On bigger screens they wrap as usual.
export default function ScrollRow({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={`-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%_-_28px),transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden ${className}`}
        >
            {children}
        </div>
    )
}