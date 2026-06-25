/**
 * Ensure no blog post body starts with an inline image. If a body begins with
 * one or more inline images (or blank blocks) before any real text, strip those
 * leading blocks so the first thing in the body is text.
 *
 * Run:  node --env-file=.env.local scripts/fix-leading-image.mjs --dry  (preview)
 *       node --env-file=.env.local scripts/fix-leading-image.mjs        (apply)
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

const hasText = (b) =>
  b._type === 'block' && (b.children || []).map((c) => c.text || '').join('').trim() !== ''

async function main() {
  const posts = await client.fetch(`*[_type=="post"]{_id, "slug":slug.current, body}`)
  let changed = 0
  for (const p of posts) {
    if (!Array.isArray(p.body) || p.body.length === 0) continue

    const firstText = p.body.findIndex(hasText)
    if (firstText <= 0) continue // already starts with text, or has no text at all

    // there are leading non-text blocks; only act if one is an inline image
    const leading = p.body.slice(0, firstText)
    if (!leading.some((b) => b._type === 'inlineImage')) continue

    const cleaned = p.body.slice(firstText)
    changed++
    console.log(
      `${DRY ? '[dry] ' : ''}${p.slug}: removing ${leading.length} leading block(s) [${leading
        .map((b) => b._type)
        .join(', ')}]`
    )
    if (!DRY) await client.patch(p._id).set({ body: cleaned }).commit()
  }
  console.log(`\n${DRY ? 'Would fix' : 'Fixed'} ${changed} post(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
