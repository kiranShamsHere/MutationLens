export type AminoAcid = {
    name: string
    kd: number
    group: 'Acidic' | 'Basic' | 'Polar' | 'Nonpolar'
}

// kd = Kyte-Doolittle hydropathy value
export const AMINO_ACIDS: Record<string, AminoAcid> = {
    A: { name: 'Alanine', kd: 1.8, group: 'Nonpolar' },
    R: { name: 'Arginine', kd: -4.5, group: 'Basic' },
    N: { name: 'Asparagine', kd: -3.5, group: 'Polar' },
    D: { name: 'Aspartate', kd: -3.5, group: 'Acidic' },
    C: { name: 'Cysteine', kd: 2.5, group: 'Polar' },
    Q: { name: 'Glutamine', kd: -3.5, group: 'Polar' },
    E: { name: 'Glutamate', kd: -3.5, group: 'Acidic' },
    G: { name: 'Glycine', kd: -0.4, group: 'Nonpolar' },
    H: { name: 'Histidine', kd: -3.2, group: 'Basic' },
    I: { name: 'Isoleucine', kd: 4.5, group: 'Nonpolar' },
    L: { name: 'Leucine', kd: 3.8, group: 'Nonpolar' },
    K: { name: 'Lysine', kd: -3.9, group: 'Basic' },
    M: { name: 'Methionine', kd: 1.9, group: 'Nonpolar' },
    F: { name: 'Phenylalanine', kd: 2.8, group: 'Nonpolar' },
    P: { name: 'Proline', kd: -1.6, group: 'Nonpolar' },
    S: { name: 'Serine', kd: -0.8, group: 'Polar' },
    T: { name: 'Threonine', kd: -0.7, group: 'Polar' },
    W: { name: 'Tryptophan', kd: -0.9, group: 'Nonpolar' },
    Y: { name: 'Tyrosine', kd: -1.3, group: 'Polar' },
    V: { name: 'Valine', kd: 4.2, group: 'Nonpolar' },
}

export const signed = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}`