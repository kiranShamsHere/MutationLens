import { useEffect, useState } from 'react'
import { findStructure } from '../lib/structure'
import type { LoadedVariant, StructureInput } from '../types'

type Done = { key: string; structure: StructureInput | null }

// Looks up a 3D structure for any protein once its UniProt record is loaded.
export function useAutoStructure(data: LoadedVariant | undefined, enabled: boolean) {
    const [done, setDone] = useState<Done | null>(null)
    const key = data && enabled ? `${data.accession}:${data.position}` : ''

    useEffect(() => {
        if (!data || !enabled) return
        const ctrl = new AbortController()
        const k = `${data.accession}:${data.position}`
        findStructure(data, ctrl.signal)
            .then((structure) => setDone({ key: k, structure }))
            .catch(() => {
                if (!ctrl.signal.aborted) setDone({ key: k, structure: null })
            })
        return () => ctrl.abort()
    }, [data, enabled])

    if (!key) return { searching: false, structure: null as StructureInput | null }
    if (done?.key !== key) return { searching: true, structure: null as StructureInput | null }
    return { searching: false, structure: done.structure }
}