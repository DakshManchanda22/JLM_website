/**
 * Removes the WPML/Polylang artifact line "This post is also available in: …"
 * from every blog post's body.
 *
 * Run:  node --env-file=.env.local scripts/strip-translation-line.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const RE = /this post is also available in/i
const blockText = (b) => (b.children || []).map((c) => c.text || '').join('')

async function main() {
  const posts = await client.fetch(`*[_type=="post"]{_id, body}`)
  let changed = 0
  for (const p of posts) {
    if (!Array.isArray(p.body)) continue
    const cleaned = p.body.filter((b) => !(b._type === 'block' && RE.test(blockText(b))))
    if (cleaned.length !== p.body.length) {
      await client.patch(p._id).set({ body: cleaned }).commit()
      changed++
      if (changed % 25 === 0) console.log(`  …${changed} cleaned`)
    }
  }
  console.log(`Done. Removed the line from ${changed} post(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
