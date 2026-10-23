import { AMINO_ACIDS, signed } from './aminoAcids'
import type { LoadedVariant, StructureInput } from '../types'

const canHighlight = (s: StructureInput) => Boolean(s.pdbId && s.chain && s.residue && s.verified)

export function buildMarkdown(d: LoadedVariant, s: StructureInput) {
    const ref = AMINO_ACIDS[d.ref]
    const alt = AMINO_ACIDS[d.alt]
    const notes = d.features.length
        ? d.features.map((f) => `- ${f.type} (${f.start === f.end ? f.start : `${f.start} to ${f.end}`}): ${f.description || 'no description'}`).join('\n')
        : '- No feature notes at this position'

    return `# MutationLens report

**Protein:** ${d.name}${d.gene ? ` (${d.gene})` : ''}, ${d.organism}
**Variant:** ${d.label} (${ref.name} to ${alt.name} at position ${d.position})
**Generated:** ${new Date().toISOString().slice(0, 10)}

## From database
- UniProt record: ${d.accession} (https://www.uniprot.org/uniprotkb/${d.accession})
- Sequence length: ${d.length} aa
- Reference residue at position ${d.position}: ${d.ref} (checked against the record)
- Listed as natural variant in UniProt: ${d.listedInUniProt ? 'yes' : 'not found in this entry'}

### UniProt notes at this position
${notes}

## Calculated by this app
- Chemistry: ${ref.group} to ${alt.group}
- Kyte and Doolittle hydropathy: ${signed(ref.kd)} to ${signed(alt.kd)} (change ${signed(alt.kd - ref.kd)})

## Structure
${s.pdbId
            ? `- PDB ${s.pdbId}, chain ${s.chain || 'not set'}, structure residue ${s.residue ?? 'not set'}
- Mapping confirmed by the user: ${canHighlight(s) ? 'yes' : 'no'}`
            : '- No structure linked'
        }

## Note
Educational and research exploration tool. Not a clinical diagnostic system.
A sequence difference alone does not prove a functional effect or a disease association.
`
}

export function buildJson(d: LoadedVariant, s: StructureInput) {
    return {
        generated: new Date().toISOString(),
        protein: { name: d.name, gene: d.gene, organism: d.organism, uniprot: d.accession, length: d.length },
        variant: { label: d.label, position: d.position, ref: d.ref, alt: d.alt, listedInUniProt: d.listedInUniProt },
        uniprotNotes: d.features,
        structure: { ...s, highlighted: canHighlight(s) },
        sequences: { reference: d.reference, variant: d.variant },
    }
}

export function download(name: string, text: string, type: string) {
    const url = URL.createObjectURL(new Blob([text], { type }))
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
}