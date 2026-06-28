/**
 * Convert the Bigen doc's newly rich-text fields from plain strings to Portable
 * Text, so Studio shows editable content (Bold / Italic / Gold-Dark-Muted).
 * Preserves the old "olive oil" gold highlight in the shine body.
 *
 * Run:  node --env-file=.env.local scripts/bigen-richtext-migrate.mjs
 */
import { createClient } from '@sanity/client'
import crypto from 'node:crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const key = () => crypto.randomUUID().slice(0, 8)
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks })

// string → Portable Text blocks (one block per line), optionally gold-marking a word
function toBlocks(str, goldWord) {
  return String(str)
    .split('\n')
    .map((line) => {
      let children
      const i = goldWord ? line.toLowerCase().indexOf(goldWord.toLowerCase()) : -1
      if (i >= 0) {
        children = [
          line.slice(0, i) && span(line.slice(0, i)),
          span(line.slice(i, i + goldWord.length), ['gold']),
          line.slice(i + goldWord.length) && span(line.slice(i + goldWord.length)),
        ].filter(Boolean)
      } else {
        children = [span(line)]
      }
      return { _type: 'block', _key: key(), style: 'normal', markDefs: [], children }
    })
}

async function main() {
  const doc = await client.getDocument('bigen')
  if (!doc) {
    console.error('No bigen document found.')
    process.exit(1)
  }

  const fields = ['videoHeadline', 'ritualBody', 'shineHeadline', 'shineBody', 'testimonialsHeadline', 'rangeHeadline']
  const goldWord = typeof doc.shineHighlight === 'string' ? doc.shineHighlight : 'olive oil'

  const set = {}
  for (const f of fields) {
    const v = doc[f]
    if (typeof v === 'string' && v.trim()) {
      set[f] = toBlocks(v, f === 'shineBody' ? goldWord : undefined)
    } else if (Array.isArray(v)) {
      console.log(`  ${f}: already rich text, skipping`)
    } else {
      console.log(`  ${f}: empty, skipping`)
    }
  }

  const patch = client.patch('bigen').set(set)
  if (doc.shineHighlight !== undefined) patch.unset(['shineHighlight'])
  await patch.commit()
  console.log(`Migrated ${Object.keys(set).length} field(s) to Portable Text:`, Object.keys(set).join(', '))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
