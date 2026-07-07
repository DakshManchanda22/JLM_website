/**
 * Publish Morisons Baby Dreams content into Sanity so the
 * /morisons-baby-dreams page renders the real assets and the marketing team
 * sees them pre-filled in Studio.
 *
 * Uploads the banner creatives from ./creatives and the product-category photos
 * from ./"product images", and sets the GCS video URL, the banner interval and
 * the social links on the singleton document.
 *
 * Run:  node --env-file=.env.local scripts/baby-dreams-publish.mjs
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

/* ── Banners (wide 1464×600 creatives) ── */
const BANNER_FILES = [
  { path: 'creatives/Diaper A+ 1.jpg', alt: 'Morisons Baby Dreams diapers' },
  { path: 'creatives/MBD wipes A+ 1.jpg', alt: 'Morisons Baby Dreams wipes' },
  {
    path: 'creatives/Morison_FeedingBottle_v1A.jpg',
    alt: 'Morisons Baby Dreams feeding bottles',
  },
  { path: 'creatives/PC range .jpg', alt: 'Morisons Baby Dreams personal care range' },
  { path: 'creatives/Toothpaste A+ 1.png', alt: 'Morisons oral care' },
  { path: 'creatives/Toothpaste A+ 2.png', alt: 'Morisons oral care' },
]

/* ── Product categories (portrait product photos) ── */
const CATEGORY_FILES = [
  {
    title: 'Baby Diaper & Wipes',
    blurb: 'All-night dryness and gentle, everyday cleaning.',
    path: 'product images/diapers.jpg',
    tint: 'mint',
    href: 'https://www.amazon.in/stores/page/36A878CB-4BED-43C9-A652-F333BD6621C4',
  },
  {
    title: 'Baby Personal & Oral Care',
    blurb: 'Tear-free baths, soft lotions and first-tooth care.',
    path: 'product images/oral care.jpg',
    tint: 'blush',
    href: 'https://www.amazon.in/stores/page/FDF13965-1A18-46AC-9BFA-741DF7C6DF5C',
  },
  {
    title: 'Feeding Bottle & Accessories',
    blurb: 'Anti-colic bottles, teats and sterilising essentials.',
    path: 'product images/feeding bottle.jpg',
    tint: 'butter',
    href: 'https://www.amazon.in/stores/page/1F922250-175C-4D29-AEC7-62F960539139',
  },
  {
    title: 'Mommy Needs',
    blurb: 'Thoughtful care for the months before and after.',
    path: 'product images/mommy needs.jpg',
    tint: 'lilac',
    href: 'https://amzn.in/d/02IJ9Pgh',
  },
  {
    title: 'Baby Accessories',
    blurb: 'The soft, useful extras that make each day easier.',
    path: 'product images/baby accessories.jpg',
    tint: 'sky',
    href: 'https://www.amazon.in/stores/page/06000500-6A4F-4E43-A8A0-06FC43E029A9',
  },
]

console.log('Uploading banners...')
const banners = []
for (const b of BANNER_FILES) {
  banners.push({ _key: key(), _type: 'banner', image: await upload(b.path), alt: b.alt })
  console.log('  ', b.path)
}

console.log('Uploading product-category photos...')
const categories = []
for (const c of CATEGORY_FILES) {
  categories.push({
    _key: key(),
    _type: 'category',
    title: c.title,
    blurb: c.blurb,
    image: await upload(c.path),
    tint: c.tint,
    href: c.href,
  })
  console.log('  ', c.path)
}

await client.createIfNotExists({ _id: 'babyDreams', _type: 'babyDreams' })

await client
  .patch('babyDreams')
  .set({
    banners,
    bannerInterval: 5,
    productsHeadline: 'Explore our product range',
    productsIntro:
      'Everything the nursery needs, thoughtfully made for delicate skin, tiny hands and busy mums.',
    categories,
    videoHeadline: 'Made for the tenderest moments',
    videoUrl: 'https://storage.googleapis.com/jlm_website_v2/MBD-Teaser-25-11%201.mp4',
    blogsHeadline: 'Advice, written by doctors',
    instagramUrl: 'https://www.instagram.com/morisonsbabydreams',
    facebookUrl: 'https://www.facebook.com/share/19C4RpxqBs/',
    youtubeUrl: 'https://youtube.com/@morisonsbabydreams',
  })
  .commit()

await client.delete('drafts.babyDreams').catch(() => {})

console.log(
  `Published Baby Dreams: ${banners.length} banners, ${categories.length} categories.`,
)
console.log('Done.')
