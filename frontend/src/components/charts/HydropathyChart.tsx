import Card from '../layout/Card'
import { signed } from '../../lib/aminoAcids'

type Props = {
    refLabel: string
    altLabel: string
    refValue: number
    altValue: number
}

const MID = 70
const UNIT = 13

export default function HydropathyChart({ refLabel, altLabel, refValue, altValue }: Props) {
    const bars = [
        { label: refLabel, value: refValue, x: 50, cls: 'fill-brand' },
        { label: altLabel, value: altValue, x: 140, cls: 'fill-hot' },
    ]

    return (
        <Card title="Hydropathy" tag="Calculated by app" className="md:col-span-2">
            <svg viewBox="0 0 240 150" className="w-full" role="img" aria-label="Hydropathy of reference and variant residues">
                <line x1="10" x2="230" y1={MID} y2={MID} className="stroke-line" strokeWidth="1.5" />
                {bars.map((b) => {
                    const h = Math.abs(b.value) * UNIT
                    const y = b.value >= 0 ? MID - h : MID
                    return (
                        <g key={b.label} className="transition duration-200 hover:opacity-80">
                            <rect x={b.x} y={y} width="48" height={h} rx="8" className={b.cls} />
                            <text
                                x={b.x + 24}
                                y={b.value >= 0 ? y - 6 : y + h + 14}
                                textAnchor="middle"
                                className="fill-ink font-mono text-[11px] font-semibold"
                            >
                                {signed(b.value)}
                            </text>
                            <text x={b.x + 24} y="146" textAnchor="middle" className="fill-muted text-[11px] font-semibold">
                                {b.label}
                            </text>
                        </g>
                    )
                })}
            </svg>
        </Card>
    )
}