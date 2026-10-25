export type AminoAcid = {
    name: string
    kd: number
    charge: number
    group: 'Negative' | 'Positive' | 'Polar' | 'Nonpolar' | 'Aromatic'
}

// Same table as analysis/mutationlens/residues.py, so the site and the Python code agree.
// kd = Kyte-Doolittle hydropathy, charge = approximate charge at pH 7.
export const AMINO_ACIDS: Record<string, AminoAcid> = {
    A: { name: 'Alanine', kd: 1.8, charge: 0, group: 'Nonpolar' },
    R: { name: 'Arginine', kd: -4.5, charge: 1, group: 'Positive' },
    N: { name: 'Asparagine', kd: -3.5, charge: 0, group: 'Polar' },
    D: { name: 'Aspartate', kd: -3.5, charge: -1, group: 'Negative' },
    C: { name: 'Cysteine', kd: 2.5, charge: 0, group: 'Polar' },
    Q: { name: 'Glutamine', kd: -3.5, charge: 0, group: 'Polar' },
    E: { name: 'Glutamate', kd: -3.5, charge: -1, group: 'Negative' },
    G: { name: 'Glycine', kd: -0.4, charge: 0, group: 'Nonpolar' },
    H: { name: 'Histidine', kd: -3.2, charge: 0, group: 'Positive' },
    I: { name: 'Isoleucine', kd: 4.5, charge: 0, group: 'Nonpolar' },
    L: { name: 'Leucine', kd: 3.8, charge: 0, group: 'Nonpolar' },
    K: { name: 'Lysine', kd: -3.9, charge: 1, group: 'Positive' },
    M: { name: 'Methionine', kd: 1.9, charge: 0, group: 'Nonpolar' },
    F: { name: 'Phenylalanine', kd: 2.8, charge: 0, group: 'Aromatic' },
    P: { name: 'Proline', kd: -1.6, charge: 0, group: 'Nonpolar' },
    S: { name: 'Serine', kd: -0.8, charge: 0, group: 'Polar' },
    T: { name: 'Threonine', kd: -0.7, charge: 0, group: 'Polar' },
    W: { name: 'Tryptophan', kd: -0.9, charge: 0, group: 'Aromatic' },
    Y: { name: 'Tyrosine', kd: -1.3, charge: 0, group: 'Aromatic' },
    V: { name: 'Valine', kd: 4.2, charge: 0, group: 'Nonpolar' },
}

export const signed = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}`
export const signedInt = (n: number) => `${n > 0 ? '+' : ''}${n}`