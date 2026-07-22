/**
 * Create the Morisons (house brand) singleton with the current poster image, so
 * the page keeps showing today's poster while becoming editable in Studio.
 * The poster is an existing Sanity asset (referenced by its asset id).
 *
 * Run:  node --env-file=.env.local scripts/seed-morisons.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Derived from the current hardcoded poster URL:
// .../de03e11f40386a7916c3252827544f3b13009864-1672x941.png
const POSTER_ASSET_ID =
  'image-de03e11f40386a7916c3252827544f3b13009864-1672x941-png'

const doc = {
  _id: 'morisons',
  _type: 'morisons',
  poster: {
    _type: 'image',
    asset: { _type: 'reference', _ref: POSTER_ASSET_ID },
  },
  posterAlt: 'Morisons — Sensitive Care for your teeth',
}

// createIfNotExists so we never clobber edits marketing may already have made.
const res = await client.createIfNotExists(doc)
console.log('Morisons document ready:', res._id)
