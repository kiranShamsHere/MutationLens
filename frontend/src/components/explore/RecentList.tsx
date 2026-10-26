import { Link } from 'react-router-dom'
import { exploreLink } from '../../lib/examples'
import ScrollRow, { chipClass } from '../layout/ScrollRow'
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
            <ScrollRow>
                {items.map((i) => (
                    <Link key={`${i.acc}${i.v}`} to={exploreLink(i.acc, i.v)} title={i.name} className={`${chipClass} bg-soft`}>
                        {i.gene || i.acc} {i.v}
                    </Link>
                ))}
            </ScrollRow>
            <p className="mt-3 text-xs text-muted">Saved on this device only.</p>
        </div>
    )
}