import { AMINO_ACIDS, signed } from './aminoAcids'
import type { LoadedVariant } from '../types'

export function explain(data: LoadedVariant, structureVerified: boolean) {
    const r = AMINO_ACIDS[data.ref]
    const a = AMINO_ACIDS[data.alt]
    const delta = a.kd - r.kd
    const size = Math.abs(delta) >= 5 ? 'a big' : Math.abs(delta) >= 2 ? 'a medium' : 'a small'

    const water =
        Math.abs(delta) < 0.5
            ? 'Both behave about the same around water.'
            : delta > 0
                ? `The new one avoids water more than the old one. That is ${size} change.`
                : `The new one likes water more than the old one. That is ${size} change.`

    const simple = [
        `At spot ${data.position}, ${r.name} (${data.ref}) is swapped for ${a.name} (${data.alt}).`,
        r.group === a.group
            ? `Both are ${r.group.toLowerCase()} building blocks, so the type of chemistry stays the same.`
            : `The type of building block changes from ${r.group.toLowerCase()} to ${a.group.toLowerCase()}.`,
        water,
        'This only describes the two amino acids. It cannot tell you what happens inside a real cell. Check the UniProt notes below for evidence.',
    ]

    const technical: [string, string][] = [
        ['Reference residue', `${r.name} (${data.ref})`],
        ['Variant residue', `${a.name} (${data.alt})`],
        ['Group change', `${r.group} to ${a.group}`],
        ['Hydropathy (Kyte and Doolittle)', `${signed(r.kd)} to ${signed(a.kd)}, change ${signed(delta)}`],
        ['Position in UniProt record', `${data.position} of ${data.length}`],
        ['Listed as natural variant in UniProt', data.listedInUniProt ? 'Yes' : 'Not found in this entry'],
        ['3D mapping', structureVerified ? 'Confirmed' : 'Not confirmed'],
    ]

    return { simple, technical }
}