/**
 * One-off migration: publish the current (code-default) homepage content into
 * Sanity so the CMS drives the whole homepage — quote, stats (+ header) and the
 * feature sections. Mirrors the defaults in:
 *   - src/components/QuoteSection.tsx
 *   - src/components/StatsSection.tsx
 *   - src/components/HomeFeatures.tsx
 *
 * Idempotent: each field is only written if it's currently empty, so it's safe
 * to re-run. Feature images are fetched from their current URLs and uploaded as
 * real Sanity assets.
 *
 * Run with:  node --env-file=.env.local scripts/migrate-homepage-content.mjs
 */
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env. Run with: node --env-file=.env.local scripts/migrate-homepage-content.mjs'
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

const QUOTE = {
  lines: [
    'For over a century, we have been',
    'building goodness for every',
    'Indian family — one trusted brand,',
    'one product, one promise at a time.',
  ],
  attribution: 'J.L. Morison · Since 1920',
}

const STATS_HEADING = 'A century of everyday goodness'
const STATS_NOTE = 'Since 1920'

const STATS = [
  {
    number: '100+',
    label: 'Years',
    body: 'From 1920 to today, J.L. Morison has stood for trust, honesty, and the small everyday goodness that holds a family together.',
  },
  {
    number: '3',
    label: 'Brands',
    body: 'Morisons Baby Dreams, Emoform, and Bigen — each beloved in its category, each shaped by the same uncompromising values.',
  },
  {
    number: '1',
    label: 'Promise',
    body: 'To make products that earn a permanent place on every Indian shelf — gently, honestly, generation after generation.',
  },
]

const FEATURES = [
  {
    eyebrow: 'Our people',
    headline: 'Life at J.L. Morison, where everyday goodness begins.',
    body: 'A century-old company with a young heart — built by people who care about the small things that make a brand worth trusting.',
    ctaLabel: 'Explore life at JLM',
    href: '/life-at-jlm',
    imageRight: false,
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80',
  },
  {
    eyebrow: 'Purpose',
    headline: 'Our mission & impact, building goodness for every Indian family.',
    body: 'From honest products to the communities we support, our purpose runs deeper than what sits on the shelf.',
    ctaLabel: 'See our impact',
    href: '/philanthropy',
    imageRight: true,
    imageUrl:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80',
  },
]

async function uploadFromUrl(url, filename) {
  console.log(`  ↑ uploading ${filename} …`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, { filename })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function run() {
  const doc = await client.fetch(
    `*[_type=="homepage"][0]{
      _id,
      "hasQuote": defined(quote.lines),
      "hasStats": count(stats) > 0,
      "hasStatsHeading": defined(statsHeading),
      "hasStatsNote": defined(statsNote),
      "hasFeatures": count(features) > 0
    }`
  )
  if (!doc?._id) {
    console.log('• Homepage: no document found — skipping.')
    return
  }

  const patch = client.patch(doc._id)
  let changed = false

  if (!doc.hasQuote) {
    console.log('• Setting quote …')
    patch.set({ quote: QUOTE })
    changed = true
  } else {
    console.log('• Quote already set — skipping.')
  }

  if (!doc.hasStatsHeading) {
    patch.set({ statsHeading: STATS_HEADING })
    changed = true
  }
  if (!doc.hasStatsNote) {
    patch.set({ statsNote: STATS_NOTE })
    changed = true
  }

  if (!doc.hasStats) {
    console.log('• Setting stats …')
    patch.set({
      stats: STATS.map((s, i) => ({ _type: 'stat', _key: `stat-${i}`, ...s })),
    })
    changed = true
  } else {
    console.log('• Stats already set — skipping.')
  }

  if (!doc.hasFeatures) {
    console.log('• Uploading + setting feature sections …')
    const features = []
    for (let i = 0; i < FEATURES.length; i++) {
      const { imageUrl, ...rest } = FEATURES[i]
      const image = await uploadFromUrl(imageUrl, `home-feature-${i + 1}.jpg`)
      features.push({ _type: 'feature', _key: `feature-${i}`, ...rest, image })
    }
    patch.set({ features })
    changed = true
  } else {
    console.log('• Feature sections already set — skipping.')
  }

  if (!changed) {
    console.log('\nNothing to do — homepage already populated.')
    return
  }

  await patch.commit()
  console.log('\nDone.')
}

await run()
