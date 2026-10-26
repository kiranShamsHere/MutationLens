// Breaks a long text into short paragraphs of whole sentences.
export function splitParagraphs(text: string, maxChars = 260): string[] {
    const sentences = text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[A-Z(])/)
    const out: string[] = []
    let cur = ''
    for (const s of sentences) {
        if (cur && `${cur} ${s}`.length > maxChars) {
            out.push(cur)
            cur = s
        } else {
            cur = cur ? `${cur} ${s}` : s
        }
    }
    if (cur) out.push(cur)
    return out.filter(Boolean)
}