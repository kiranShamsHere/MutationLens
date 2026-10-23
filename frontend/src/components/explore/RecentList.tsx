import { Link } from 'react-router-dom'
import { exploreLink } from '../../lib/examples'
import type { HistoryItem } from '../../hooks/useHistory'

type Props = { items: HistoryItem[]; onClear: () => void }

export default function RecentList({ items, onClear }: Props) {
    if (items.length === 0) return null
    return (
        <div className="mt-8 border-t border-line pt-6">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Your recent searches</p>
                <button onClick={onClear} className="text-xs font-bold text-muted transition duration-200 hover:text-hot">
                    Clear
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((i) => (
                    <Link
                        key={`${i.acc}${i.v}`}
                        to={exploreLink(i.acc, i.v)}
                        title={i.name}
                        className="rounded-full border border-line bg-soft px-4 py-2 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                    >
                        {i.gene || i.acc} {i.v}
                    </Link>
                ))}
            </div>
            <p className="mt-3 text-xs text-muted">Saved on this device only.</p>
        </div>
    )
}