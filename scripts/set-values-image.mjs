/**
 * Upload JLMValues.jpg to the Sanity CDN, attach it as the homepage "values
 * image" (shown below the quote), turn its visibility switch ON, and update the
 * stats heading to the new copy. Patches both the published and draft homepage
 * documents so the change is live and editable.
 *
 * Run:  node --env-file=.env.local scripts/set-values-image.mjs
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env. Run with: node --env-file=.env.local scripts/set-values-image.mjs'
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

const STATS_HEADING = 'Building Goodness Everyday for over a Century'

// 1) Upload the image as a Sanity asset.
const buffer = readFileSync(new URL('../JLMValues.jpg', import.meta.url))
const asset = await client.assets.upload('image', buffer, {
  filename: 'JLMValues.jpg',
})
console.log('Uploaded image asset:', asset._id)

// 2) Patch both homepage docs (published + draft, whichever exist).
const ids = await client.fetch(
  '*[_id in ["homepage","drafts.homepage"]]._id'
)
if (!ids.length) {
  console.error('No homepage document found to patch.')
  process.exit(1)
}

for (const id of ids) {
  const res = await client
    .patch(id)
    .set({
      showValuesImage: true,
      valuesImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
      statsHeading: STATS_HEADING,
    })
    .commit()
  console.log('Patched', res._id)
}

console.log('Done.')
