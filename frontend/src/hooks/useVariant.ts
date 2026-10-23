import { useEffect, useState } from 'react'
import { loadVariant } from '../lib/uniprot'
import type { LoadedVariant } from '../types'

type State = { status: 'idle' | 'loading' | 'ready' | 'error'; data?: LoadedVariant; error?: string }

export function useVariant(acc: string, v: string) {
    const [state, setState] = useState<State>({ status: 'idle' })
    const [tick, setTick] = useState(0)
    const activeState = !acc || !v ? { status: 'idle' as const } : state

    useEffect(() => {
        if (!acc || !v) {
            return
        }
        const ctrl = new AbortController()
        queueMicrotask(() => {
            setState({ status: 'loading' })
        })
        loadVariant(acc, v, ctrl.signal)
            .then((data) => setState({ status: 'ready', data }))
            .catch((e) => {
                if (ctrl.signal.aborted) return
                setState({ status: 'error', error: e instanceof Error ? e.message : 'Something went wrong.' })
            })
        return () => ctrl.abort()
    }, [acc, v, tick])

    return { ...activeState, retry: () => setTick((t) => t + 1) }
}