/**
 * One-off migration: move the last remaining `public/` image fallbacks into Sanity
 * so the CMS is the sole source of truth for images.
 *
 * Uploads:
 *   - the 3 homepage brand-card images  → homepage.brands[].image
 *   - the Bigen logo                    → bigen.heroLogo
 *
 * Idempotent: skips any field that is already populated, so it's safe to re-run.
 *
 * Run with:  node --env-file=.env.local scripts/migrate-images-to-sanity.mjs
 */
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env. Run with: node --env-file=.env.local scripts/migrate-images-to-sanity.mjs'
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

/** Upload a public image and return a Sanity image field value (asset ref). */
async function uploadImage(filename) {
  const path = join(PUBLIC, filename)
  console.log(`  ↑ uploading ${filename} …`)
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename,
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

/* ─── Brand cards — mirrors DEFAULT_BRANDS in src/components/BrandCards.tsx ─── */
const BRANDS = [
  {
    name: 'Morisons Baby Dreams',
    shortName: 'Baby Dreams',
    tagline: 'Care your baby deserves.',
    href: '/morisons-baby-dreams',
    file: 'morisons-baby-dreams-homepage.jpg',
  },
  {
    name: 'Emoform',
    shortName: 'Emoform',
    tagline: 'Dental health, perfected.',
    href: '/emoform',
    file: 'emoform-homepage.jpg',
  },
  {
    name: 'Bigen',
    shortName: 'Bigen',
    tagline: 'Colour with confidence.',
    href: '/bigen',
    file: 'bigen-homepage.jpg',
  },
]

async function migrateHomepage() {
  const doc = await client.fetch(
    `*[_type=="homepage"][0]{_id, "brandCount": count(brands)}`
  )
  if (!doc?._id) {
    console.log('• Homepage: no document found — skipping.')
    return
  }
  if (doc.brandCount > 0) {
    console.log('• Homepage: brands already populated — skipping.')
    return
  }
  console.log('• Homepage: uploading 3 brand images …')
  const brands = []
  for (const b of BRANDS) {
    const image = await uploadImage(b.file)
    brands.push({
      _type: 'brand',
      _key: b.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: b.name,
      shortName: b.shortName,
      tagline: b.tagline,
      href: b.href,
      image,
    })
  }
  await client.patch(doc._id).set({ brands }).commit()
  console.log('  ✓ homepage.brands set')
}

async function migrateBigenLogo() {
  const doc = await client.fetch(
    `*[_type=="bigen"][0]{_id, "hasLogo": defined(heroLogo.asset)}`
  )
  if (!doc?._id) {
    console.log('• Bigen: no document found — skipping.')
    return
  }
  if (doc.hasLogo) {
    console.log('• Bigen: heroLogo already set — skipping.')
    return
  }
  console.log('• Bigen: uploading logo …')
  const image = await uploadImage('bigen-logo.svg')
  await client.patch(doc._id).set({ heroLogo: image }).commit()
  console.log('  ✓ bigen.heroLogo set')
}

await migrateHomepage()
await migrateBigenLogo()
console.log('\nDone.')
