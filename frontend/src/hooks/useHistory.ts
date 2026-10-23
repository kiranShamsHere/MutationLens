import { useCallback, useState } from 'react'

export type HistoryItem = { acc: string; v: string; name: string; gene: string }

const KEY = 'ml-history'
const MAX = 8

function read(): HistoryItem[] {
    try {
        const raw = localStorage.getItem(KEY)
        const parsed: unknown = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? (parsed as HistoryItem[]) : []
    } catch {
        return []
    }
}

function write(items: HistoryItem[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
        // storage unavailable, ignore
    }
}

export function useHistory() {
    const [items, setItems] = useState<HistoryItem[]>(read)

    const add = useCallback((item: HistoryItem) => {
        const next = [item, ...read().filter((i) => !(i.acc === item.acc && i.v === item.v))].slice(0, MAX)
        write(next)
        setItems(next)
    }, [])

    const clear = useCallback(() => {
        write([])
        setItems([])
    }, [])

    return { items, add, clear }
}