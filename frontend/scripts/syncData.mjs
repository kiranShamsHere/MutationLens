import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Copies the curated examples from ../data/examples into src/data/examples.json
// so the frontend can import them. Long sequences are dropped on purpose,
// the app reads the live sequence from UniProt.
const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', '..', 'data', 'examples')
const target = join(here, '..', 'src', 'data', 'examples.json')

if (!existsSync(source)) {
    console.log('sync-data: data/examples not found, keeping the committed copy')
    process.exit(0)
}

const items = readdirSync(source)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => {
        const d = JSON.parse(readFileSync(join(source, f), 'utf8'))
        delete d.protein.referenceSequence
        delete d.variant.variantSequence
        return d
    })

mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, JSON.stringify(items, null, 2) + '\n')
console.log(`sync-data: wrote ${items.length} examples`)