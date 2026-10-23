import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

export default function CopyLink() {
    const [done, setDone] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setDone(true)
            setTimeout(() => setDone(false), 1800)
        } catch {
            window.prompt('Copy this link', window.location.href)
        }
    }

    return (
        <button
            onClick={copy}
            className="no-print flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-lg active:translate-y-0"
        >
            {done ? <Check size={16} className="text-link" /> : <Link2 size={16} />}
            {done ? 'Link copied' : 'Copy link'}
        </button>
    )
}