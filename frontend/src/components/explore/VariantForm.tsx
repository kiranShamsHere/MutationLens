import { Search } from 'lucide-react'
import type { StructureInput } from '../../types'

export type FormValues = { acc: string; v: string; pdb: string; chain: string; res: string; ok: boolean }

type Props = {
    acc: string
    v: string
    structure: StructureInput
    onSubmit: (values: FormValues) => void
}

const input =
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm font-semibold outline-none transition duration-200 placeholder:font-normal placeholder:text-muted hover:border-brand/60 focus:border-brand'

export default function VariantForm({ acc, v, structure, onSubmit }: Props) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const f = new FormData(e.currentTarget)
                const get = (k: string) => String(f.get(k) ?? '').trim()
                onSubmit({ acc: get('acc'), v: get('v'), pdb: get('pdb'), chain: get('chain'), res: get('res'), ok: f.get('ok') === 'on' })
            }}
            className="rounded-3xl border border-line bg-surface p-5 shadow-sm"
        >
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted">UniProt accession</span>
                    <input name="acc" defaultValue={acc} placeholder="P68871" required className={input} />
                </label>
                <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted">Variant</span>
                    <input name="v" defaultValue={v} placeholder="E7V" required className={input} />
                </label>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 self-end rounded-xl bg-brand px-6 py-3 text-sm font-bold text-brand-ink transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                >
                    <Search size={16} /> Analyze
                </button>
            </div>

            <details className="group mt-4" open={Boolean(structure.pdbId)}>
                <summary className="cursor-pointer text-sm font-bold text-link transition hover:opacity-80">
                    Structure options (optional)
                </summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <input name="pdb" defaultValue={structure.pdbId} placeholder="PDB id, for example 1ABC" maxLength={4} className={input} />
                    <input name="chain" defaultValue={structure.chain} placeholder="Chain, for example A" className={input} />
                    <input name="res" defaultValue={structure.residue ?? ''} placeholder="Residue number in the structure" inputMode="numeric" className={input} />
                </div>
                <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-muted">
                    <input type="checkbox" name="ok" defaultChecked={structure.verified} className="mt-1 accent-[var(--brand)]" />
                    I checked on RCSB that this structure residue matches the variant position. Only then is it highlighted.
                </label>
            </details>
        </form>
    )
}