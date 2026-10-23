export function LogoMark({ size = 36, className = '' }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="MutationLens logo">
            <rect width="48" height="48" rx="12" fill="#0A8A63" />
            <circle cx="22" cy="22" r="11" fill="none" stroke="#ffffff" strokeWidth="3.5" />
            <path d="M30.5 30.5L38 38" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <rect x="16.5" y="19" width="3" height="6" rx="1.5" fill="#ffffff" />
            <rect x="20.5" y="15.5" width="3" height="13" rx="1.5" fill="#FF6B57" />
            <rect x="24.5" y="19" width="3" height="6" rx="1.5" fill="#ffffff" />
        </svg>
    )
}

export default function Logo({ size = 36 }: { size?: number }) {
    return (
        <span className="group flex items-center gap-2.5">
            <LogoMark size={size} className="transition duration-300 group-hover:scale-105" />
            <span className="text-xl tracking-tight">
                <span className="font-semibold">Mutation</span>
                <span className="font-extrabold">Lens</span>
            </span>
        </span>
    )
}