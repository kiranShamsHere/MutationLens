import { useEffect, useState } from 'react'
import { loadAlphaFold } from '../lib/alphafold'
import type { LoadedVariant, StructureInput } from '../types'

type State = { key: string; result: StructureInput | null }

export function useAlphaFold(data: LoadedVariant | null | undefined, enabled: boolean): StructureInput | null {
    const [state, setState] = useState<State>({ key: '', result: null })
    const accession = data?.accession ?? ''
    const position = data?.position ?? 0
    const ref = data?.ref ?? ''
    const key = data ? `${accession}|${position}|${ref}` : ''

    useEffect(() => {
        if (!enabled || !key) return
        const ctrl = new AbortController()
        loadAlphaFold(accession, position, ref, ctrl.signal)
            .then((result) => setState({ key, result }))
            .catch(() => {
                if (!ctrl.signal.aborted) setState({ key, result: null })
            })
        return () => ctrl.abort()
    }, [enabled, key, accession, position, ref])

    return enabled && state.key === key ? state.result : null
}