/**
 * For every post that carries Dr. Debmita Dutta's byline/bio in its body:
 *   1. set the post's author to the Debmita author document
 *   2. strip the in-body signature block: the "By" line, her name line, the
 *      headshot image, and the bio paragraph(s) — while preserving any
 *      "Reference…" section (and anything after it).
 *
 * Run:  node --env-file=.env.local scripts/fix-debmita-byline.mjs --dry   (preview)
 *       node --env-file=.env.local scripts/fix-debmita-byline.mjs         (apply)
 */
import { createClient } from '@sanity/client'

const DRY = process.argv.includes('--dry')
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const txt = (b) => (b && b._type === 'block' ? (b.children || []).map((c) => c.text || '').join('') : '')
const isDebmita = (b) => /debmita/i.test(txt(b))
const isBy = (b) => txt(b).trim().toLowerCase() === 'by'
const isEmpty = (b) => b._type === 'block' && txt(b).trim() === ''
const isReference = (b) => /^\s*reference/i.test(txt(b))

function cleanBody(body) {
  const firstDeb = body.findIndex(isDebmita)
  if (firstDeb === -1) return null // no byline

  // signature starts at the "By" just before her name (allowing blank lines),
  // otherwise at her name block itself
  let start = firstDeb
  for (let i = firstDeb - 1; i >= 0 && i >= firstDeb - 3; i--) {
    if (isEmpty(body[i])) continue
    if (isBy(body[i])) start = i
    break
  }
  // swallow blank lines immediately above the signature
  while (start > 0 && isEmpty(body[start - 1])) start--

  // signature ends just before the first "Reference…" block at/after start,
  // or at the end of the post
  let end = body.length // exclusive
  for (let i = start; i < body.length; i++) {
    if (isReference(body[i])) {
      end = i
      break
    }
  }

  const removed = body.slice(start, end)
  const cleaned = [...body.slice(0, start), ...body.slice(end)]
  return { cleaned, removed, start, end }
}

async function main() {
  const author = await client.fetch(
    `*[_type=="author" && name match "*Debmita*"][0]{_id, name}`
  )
  if (!author) {
    console.error('No Debmita author found in Sanity. Create her first.')
    process.exit(1)
  }
  console.log(`Author: ${author.name} (${author._id})${DRY ? '  [DRY RUN]' : ''}\n`)

  const posts = await client.fetch(`*[_type=="post"]{_id, "slug":slug.current, "author":author->name, body}`)
  let count = 0
  for (const p of posts) {
    if (!Array.isArray(p.body)) continue
    const res = cleanBody(p.body)
    if (!res) continue
    count++

    if (DRY) {
      console.log(`• ${p.slug}  (author: ${p.author} → ${author.name})`)
      res.removed.forEach((b) =>
        console.log(
          `    − {${b.style || b._type}} ${JSON.stringify((txt(b) || '[' + b._type + ']').slice(0, 80))}`
        )
      )
    } else {
      await client
        .patch(p._id)
        .set({ author: { _type: 'reference', _ref: author._id }, body: res.cleaned })
        .commit()
      if (count % 10 === 0) console.log(`  …${count} updated`)
    }
  }
  console.log(`\n${DRY ? 'Would update' : 'Updated'} ${count} post(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
