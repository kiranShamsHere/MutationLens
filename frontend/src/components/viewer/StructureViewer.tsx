import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, TriangleAlert } from 'lucide-react'
import 'molstar/build/viewer/molstar.css'
import Card from '../layout/Card'
import type { StructureInput } from '../../types'

type Props = { structure: StructureInput; label: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function focusResidue(plugin: any, chain: string, residue: number) {
    const [{ Script }, { StructureSelection }] = await Promise.all([
        import('molstar/lib/mol-script/script'),
        import('molstar/lib/mol-model/structure'),
    ])
    const data = plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj?.data
    if (!data) return
    const sel = Script.getStructureSelection(
        (Q) =>
            Q.struct.generator.atomGroups({
                'chain-test': Q.core.rel.eq([Q.struct.atomProperty.macromolecular.auth_asym_id(), chain]),
                'residue-test': Q.core.rel.eq([Q.struct.atomProperty.macromolecular.auth_seq_id(), residue]),
            }),
        data,
    )
    const loci = StructureSelection.toLociWithSourceUnits(sel)
    plugin.managers.interactivity.lociSelects.select({ loci })
    plugin.managers.camera.focusLoci(loci)
}

export default function StructureViewer({ structure, label }: Props) {
    const host = useRef<HTMLDivElement>(null)
    const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
    const { pdbId, chain, residue, verified } = structure
    const highlight = Boolean(pdbId && chain && residue && verified)
    const activeState = !pdbId ? 'idle' : state

    useEffect(() => {
        if (!pdbId) {
            return
        }
        let disposed = false
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let viewer: any = null
            ; (async () => {
                try {
                    queueMicrotask(() => {
                        if (!disposed) setState('loading')
                    })
                    const { Viewer } = await import('molstar/lib/apps/viewer/app')
                    if (disposed || !host.current) return
                    const v = await Viewer.create(host.current, {
                        layoutIsExpanded: false,
                        layoutShowControls: false,
                        layoutShowRemoteState: false,
                        layoutShowSequence: false,
                        layoutShowLog: false,
                        layoutShowLeftPanel: false,
                        viewportShowExpand: false,
                        viewportShowSelectionMode: false,
                        viewportShowAnimation: false,
                    })
                    if (disposed) {
                        v.plugin.dispose()
                        return
                    }
                    viewer = v
                    await v.loadPdb(pdbId)
                    if (highlight && residue) await focusResidue(v.plugin, chain, residue)
                    if (!disposed) setState('ready')
                } catch (e) {
                    console.error(e)
                    if (!disposed) setState('error')
                }
            })()
        return () => {
            disposed = true
            viewer?.plugin.dispose()
        }
    }, [pdbId, chain, residue, highlight])

    return (
        <Card title="3D structure" tag={pdbId || 'No structure linked'} className="flex min-h-[420px] flex-col">
            <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl bg-soft">
                {!pdbId && (
                    <div className="grid h-full place-items-center p-6 text-center">
                        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
                            <path d="M40 220C90 80 150 260 200 150S300 60 360 170" className="stroke-brand" strokeWidth="18" fill="none" strokeLinecap="round" />
                            <path d="M70 90C140 30 190 120 250 80S330 230 300 250" className="stroke-grape" strokeWidth="13" fill="none" strokeLinecap="round" />
                        </svg>
                        <p className="relative max-w-xs rounded-2xl bg-surface/90 p-4 text-sm font-semibold text-muted">
                            Add a PDB id under Structure options to load the 3D viewer.
                        </p>
                    </div>
                )}
                {pdbId && <div ref={host} className="absolute inset-0" />}
                {activeState === 'loading' && (
                    <div className="absolute inset-0 grid animate-pulse place-items-center bg-soft/80 text-sm font-semibold text-muted">
                        Loading {pdbId}
                    </div>
                )}
                {activeState === 'error' && (
                    <div className="absolute inset-0 grid place-items-center bg-soft p-6 text-center text-sm font-semibold text-muted">
                        Could not load {pdbId}. Check the id and try again.
                    </div>
                )}
                <span className="absolute left-3 top-3 z-10 rounded-full bg-surface/90 px-3 py-1 font-mono text-xs font-semibold">
                    {label}
                </span>
            </div>

            <div className="mt-4">
                {highlight ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1.5 text-xs font-bold text-link">
                        <ShieldCheck size={14} /> Mapping verified, residue {residue} on chain {chain} is highlighted
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1.5 text-xs font-bold text-ink">
                        <TriangleAlert size={14} /> Mapping not verified, nothing is highlighted
                    </span>
                )}
            </div>
        </Card>
    )
}