/**
 * Migration for the latest round of homepage + Life at JLM changes:
 *   1. Homepage features: copy each feature's existing single `image` into the
 *      new `images` array (so the rotating slideshow field is pre-filled with the
 *      current photo and marketing just adds more).
 *   2. Life at JL Morison: unset the removed Workplace fields (the section was
 *      deleted from the site).
 *
 * Idempotent: features already carrying `images` are left alone.
 *
 * Run with:  node --env-file=.env.local scripts/migrate-home-and-life.mjs
 */
import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Run with: node --env-file=.env.local scripts/migrate-home-and-life.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

async function migrateFeatures() {
  console.log('\n• Homepage feature images')
  const doc = await client.fetch(`*[_id=="homepage"][0]{ features }`)
  if (!doc?.features?.length) {
    console.log('  no features — skipping.')
    return
  }
  let changed = false
  const features = doc.features.map((f) => {
    if ((!f.images || f.images.length === 0) && f.image) {
      changed = true
      return { ...f, images: [{ ...f.image, _key: key() }] }
    }
    return f
  })
  if (!changed) {
    console.log('  features already have images — skipping.')
    return
  }
  await client.patch('homepage').set({ features }).commit()
  console.log('  copied each feature image into its new images array.')
}

async function cleanLife() {
  console.log('\n• Life at JL Morison — remove Workplace fields')
  await client
    .patch('lifeAtJlm')
    .unset([
      'workplaceLabel',
      'workplaceHeadline',
      'workplaceTagline',
      'workplaceBody',
      'workplaceImages',
    ])
    .commit()
    .then(() => console.log('  unset workplace* fields.'))
    .catch((e) => console.log('  skip:', e.message))
}

await migrateFeatures()
await cleanLife()
console.log('\nDone.')
