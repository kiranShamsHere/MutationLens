import { useEffect, useState } from 'react'
import { loadProtein } from '../lib/uniprot'
import type { ProteinInfo } from '../types'

type Done = { acc: string; info?: ProteinInfo; error?: string }
type Result =
    | { status: 'idle' | 'loading' }
    | { status: 'ready'; info: ProteinInfo }
    | { status: 'error'; error: string }

// Loads the plain description of a protein from its UniProt ID.
export function useProtein(acc: string, enabled: boolean): Result {
    const [done, setDone] = useState<Done | null>(null)

    useEffect(() => {
        if (!acc || !enabled) return
        const ctrl = new AbortController()
        loadProtein(acc, ctrl.signal)
            .then((info) => setDone({ acc, info }))
            .catch((e) => {
                if (!ctrl.signal.aborted) setDone({ acc, error: e instanceof Error ? e.message : 'Something went wrong.' })
            })
        return () => ctrl.abort()
    }, [acc, enabled])

    if (!acc || !enabled) return { status: 'idle' }
    if (done?.acc !== acc) return { status: 'loading' }
    return done.info ? { status: 'ready', info: done.info } : { status: 'error', error: done.error ?? 'Something went wrong.' }
}