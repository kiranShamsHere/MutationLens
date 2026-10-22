import { ShieldCheck, TriangleAlert } from 'lucide-react'
import Card from '../layout/Card'
import type { VariantExample } from '../../types'

type Props = {
    structure: VariantExample['structure']
    label: string
}

export default function StructureViewer({ structure, label }: Props) {
    const ok = structure.mappingVerified

    return (
        <Card
            title="3D structure"
            tag={structure.pdbId ?? 'No structure linked'}
            className="flex min-h-[380px] flex-col"
        >
            {/* Mol* mounts inside this div later. The svg is a stand in. */}
            <div className="relative flex-1 overflow-hidden rounded-2xl bg-soft">
                <svg
                    viewBox="0 0 400 300"
                    className="h-full w-full"
                    role="img"
                    aria-label="Stylized protein ribbon"
                >
                    <path
                        d="M40 220C90 80 150 260 200 150S300 60 360 170"
                        className="stroke-brand"
                        strokeWidth="18"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.9"
                    />
                    <path
                        d="M70 90C140 30 190 120 250 80S330 230 300 250"
                        className="stroke-grape"
                        strokeWidth="13"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.6"
                    />
                    <path
                        d="M60 250C120 200 150 280 230 230"
                        className="stroke-sun"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                    {ok && (
                        <>
                            <circle cx="200" cy="150" r="26" className="animate-pulse fill-hot" opacity="0.25" />
                            <circle cx="200" cy="150" r="10" className="fill-hot" />
                        </>
                    )}
                </svg>
                <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 font-mono text-xs font-semibold">
                    {label}
                </span>
            </div>

            <div className="mt-4">
                {ok ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1.5 text-xs font-bold text-link">
                        <ShieldCheck size={14} /> Mapping verified
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1.5 text-xs font-bold text-ink">
                        <TriangleAlert size={14} /> Mapping not verified, residue is not highlighted
                    </span>
                )}
            </div>
        </Card>
    )
}