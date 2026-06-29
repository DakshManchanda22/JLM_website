/**
 * Publish the current Emoform page content into Sanity so the marketing team
 * sees real sample text + images pre-filled in every field. Also uploads the
 * Bigen hero (jadeja) into Sanity so it is served from Sanity's CDN.
 *
 * Run:  node --env-file=.env.local scripts/emoform-publish.mjs
 */
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import crypto from 'node:crypto'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const key = () => crypto.randomUUID().slice(0, 8)

async function upload(path) {
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: path.split('/').pop(),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

const ref = (id) => ({ _type: 'image', asset: { _type: 'reference', _ref: id } })

console.log('Uploading Emoform images...')
const heroImage = await upload('public/toothpaste_herov2.png')
const featuresImage = await upload('public/brush.png')
const gumImage = await upload('public/gum.png')
const brushingImage = await upload('public/brushing-teeth.webp')
const dentistImage = await upload('public/dentist.png')

const emoform = {
  _id: 'emoform',
  _type: 'emoform',
  heroLine1: 'Sensitivity ka',
  heroLine2: 'अंत,   तुरंत',
  heroFlag: 'Swiss Formula',
  heroImage,
  featuresTitleTop: '5 in 1',
  featuresTitleBottom: 'Unique Action',
  features: [
    'Reduces Sensitivity',
    'Strengthens Gums',
    'Prevents Cavities',
    'Removes Plaque',
    'Protects Enamel',
  ],
  featuresImage,
  steps: [
    {
      _key: key(),
      _type: 'emoformStep',
      tag: 'Sensitivity & Gums',
      title:
        'Daily relief from sensitivity & gum problems, with a triple-salt formula',
      sub: 'Containing sodium chloride, potassium nitrate & calcium carbonate.',
      image: gumImage,
      points: ['Reduces Redness', 'Relieves Swelling', 'Prevents Bleeding'],
    },
    {
      _key: key(),
      _type: 'emoformStep',
      tag: 'Enamel Protection',
      title: 'Specialized low-abrasive formula to protect enamel',
      image: brushingImage,
    },
    {
      _key: key(),
      _type: 'emoformStep',
      tag: 'Tooth & Gum Care',
      title: 'Doctor-developed toothpaste for tooth & gum care',
      image: dentistImage,
      points: ['Sugar-Free', 'Fluoride-Free', 'Swiss formula'],
    },
  ],
  ctaTitle: 'Start your daily gum-care routine',
  ctaSubtext:
    'Sugar-free, fluoride-free, Swiss formula. Relief you can feel, twice a day.',
  ctaButtonLabel: 'Shop now',
  ctaButtonHref: 'https://www.amazon.in/s?k=EMOFORM-R&ref=bl_dp_s_web_0',
}

await client.createOrReplace(emoform)
await client.delete('drafts.emoform').catch(() => {})
console.log('Published Emoform document.')

// ── Bigen hero onto Sanity's CDN ──
console.log('Uploading Bigen hero (jadeja) to Sanity CDN...')
const jadeja = await upload('public/jadeja.png')
const bigenId = await client.fetch(
  '*[_id in ["bigen","drafts.bigen"]] | order(_id desc)[0]._id'
)
if (bigenId) {
  await client.patch(bigenId).set({ heroImage: ref(jadeja.asset._ref) }).commit()
  console.log('Set Bigen heroImage on', bigenId)
} else {
  await client.createOrReplace({
    _id: 'bigen',
    _type: 'bigen',
    heroImage: ref(jadeja.asset._ref),
  })
  console.log('Created bigen doc with heroImage')
}

console.log('Done.')
