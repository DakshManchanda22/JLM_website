/**
 * Migration: rename blog docs from dotted ids ("post.<slug>", "author.<slug>",
 * "tag.<slug>") to hyphenated ids ("post-<slug>", …).
 *
 * WHY: Sanity's public read grant is `_id in path("*")`, which only matches
 * top-level ids. A dot creates a private namespace, so dotted-id docs are
 * invisible to anonymous (website) visitors. Hyphenated ids sit at the top
 * level and are publicly readable, while drafts (drafts.*) stay private.
 *
 * Safe: clones each doc to the new id (remapping internal author/tag refs),
 * then deletes the old one. Slugs are untouched, so URLs don't change.
 *
 * Run:  node --env-file=.env.local scripts/fix-blog-ids.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const TYPES = ['post', 'author', 'tag']
const needsFix = (id) => /^(post|author|tag)\./.test(id)
const newId = (id) => id.replace(/\./g, '-') // slugs contain no dots, so this is safe

// deep-remap any reference that points at a dotted post/author/tag id
function remapRefs(value) {
  if (Array.isArray(value)) return value.map(remapRefs)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      if (k === '_ref' && typeof v === 'string' && needsFix(v)) out[k] = newId(v)
      else out[k] = remapRefs(v)
    }
    return out
  }
  return value
}

async function main() {
  // fetch all of these types and filter dotted ids in JS (GROQ `match "*.*"`
  // is unreliable for matching dots, so it misses some docs)
  const docs = await client.fetch(`*[_type in $types]`, { types: TYPES })
  // create referenced docs (authors, tags) before the posts that point at them
  const order = { author: 0, tag: 1, post: 2 }
  const dotted = docs.filter((d) => needsFix(d._id)).sort((a, b) => (order[a._type] ?? 9) - (order[b._type] ?? 9))
  console.log(`Found ${dotted.length} dotted doc(s) to migrate.`)

  let migrated = 0
  // create all new docs first (so references resolve), then delete the old ones
  for (const doc of dotted) {
    const clone = remapRefs({ ...doc })
    clone._id = newId(doc._id)
    delete clone._rev
    delete clone._createdAt
    delete clone._updatedAt
    await client.createOrReplace(clone)
    migrated++
    if (migrated % 25 === 0) console.log(`  …created ${migrated}/${dotted.length}`)
  }
  console.log(`Created ${migrated} hyphenated doc(s). Deleting dotted originals…`)

  let deleted = 0
  // delete in reverse dependency order: posts first, then tags, then authors
  for (const doc of [...dotted].reverse()) {
    try {
      await client.delete(doc._id)
      deleted++
    } catch (e) {
      console.warn(`  ! could not delete ${doc._id}: ${e.message.split('(traceId')[0].trim()}`)
    }
  }
  console.log(`Deleted ${deleted} dotted doc(s).`)

  // verify anonymous visibility
  const anon = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-10-01',
    useCdn: false,
  })
  await new Promise((r) => setTimeout(r, 2500))
  const anonPosts = await anon.fetch(`count(*[_type=="post"])`)
  console.log(`\nDone. Anonymous (website) now sees ${anonPosts} post(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
