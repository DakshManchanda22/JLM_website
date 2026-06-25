/**
 * One-time seed for the Bigen Sanity document.
 *
 * Run with:  node --env-file=.env.local scripts/seed-bigen.mjs
 *
 * Uploads the page's images as Sanity assets and creates (or replaces) the
 * singleton `bigen` document with all the default copy + reels, so marketing
 * opens Studio to pre-filled content. Re-running re-uploads the images, so
 * run it once.
 */
import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { basename } from 'node:path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing env. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are set in .env.local,\n' +
      'and run with:  node --env-file=.env.local scripts/seed-bigen.mjs'
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

async function uploadImage(path) {
  const asset = await client.assets.upload('image', createReadStream(path), {
    filename: basename(path),
  })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  console.log('Uploading images…')
  const [heroImage, ritualImage, shineImage, pOil, pColour, pSpeedy, pCond] =
    await Promise.all([
      uploadImage('public/jadeja.png'),
      uploadImage('public/2-trim.png'),
      uploadImage('public/4-trim.png'),
      uploadImage('public/beard oil.jpg'),
      uploadImage('public/beard colour.jpg'),
      uploadImage('public/speedy colour.jpg'),
      uploadImage('public/hair conditioner.jpg'),
    ])

  const doc = {
    _id: 'bigen',
    _type: 'bigen',
    // hero
    heroHeadline1: 'Specially',
    heroHeadline2: 'formulated',
    heroHeadline3: "for men's beard",
    heroEyebrow: "Japan's No.1 · Men's Beard",
    heroCtaLabel: 'Shop now',
    heroCtaHref: 'https://www.amazon.in/s?k=bigen',
    heroImage,
    // video
    videoHeadline: 'Confidence, in one stroke',
    videoUrl:
      'https://storage.googleapis.com/jlm_website_v2/BIGEN%20JADEJA%2010%20SEC%20English%20new%20PW%20%20HD%205.mp4',
    // ritual
    ritualHeadlinePlain: 'Salon-like finish',
    ritualHeadlineItalic1: 'in just',
    ritualHeadlineItalic2: '10 minutes',
    ritualBody:
      'Smooth, controlled application that behaves the way you want it to — start to grey-free in the time it takes to read the morning headlines.',
    ritualFeatures: [
      { _key: 'f1', label: 'Leaves no stains', icon: 'sparkle' },
      { _key: 'f2', label: 'Non-drip cream', icon: 'drop' },
      { _key: 'f3', label: 'Mess-free application', icon: 'sparkle' },
    ],
    ritualImage,
    // shine
    shineBannerTop: 'Darker, bolder beard',
    shineBannerBottom: 'In just 1 stroke',
    shineHeadline: 'Gives a natural shine\nto your beard',
    shineBody:
      'With the goodness of olive oil and taurine, every stroke conditions as it colours — for a softer, healthier-looking beard with a subtle, natural sheen.',
    shineHighlight: 'olive oil',
    shinePillLabel: 'No Ammonia formula',
    shineImage,
    // testimonials
    testimonialsHeadline: 'Decades of Trust. Endorsed by icons.',
    reels: [
      'DLU2lZiNZLW',
      'DKrg_FStMLF',
      'DUqS6xViPnq',
      'C2UrjpmpxtS',
      'C7Wm8eWSkTN',
      'DUBDgnxARBn',
      'C7wj2GDPRjH',
      'DBIfWYGSb-3',
      'C2KbXlcy4-P',
      'C7wj2GDPRjH',
    ].map((code, i) => ({
      _key: `r${i}`,
      url: `https://www.instagram.com/reel/${code}/`,
    })),
    // range
    rangeEyebrow: "The Men's Range",
    rangeHeadline: 'Explore our entire product range',
    products: [
      {
        _key: 'p1',
        name: 'Beard Oil',
        desc: 'Argan & rosehip for a shiny, smooth, conditioned beard.',
        href: 'https://www.amazon.in/dp/B0BLSSWY2Y',
        image: pOil,
      },
      {
        _key: 'p2',
        name: 'Beard Colour',
        desc: 'No-ammonia cream for beard, moustache & sideburns.',
        href: 'https://www.amazon.in/dp/B00EIMAA3S',
        image: pColour,
      },
      {
        _key: 'p3',
        name: 'Speedy Colour',
        desc: 'Greys gone in 10 minutes with olive oil & taurine.',
        href: 'https://www.amazon.in/dp/B00DRE3NZA',
        image: pSpeedy,
      },
      {
        _key: 'p4',
        name: 'Speedy Hair Colour Conditioner',
        desc: 'Darkens grey hair in 5 minutes, with natural herbs.',
        href: 'https://www.amazon.in/dp/B007E9E16O',
        image: pCond,
      },
    ],
  }

  console.log('Writing bigen document…')
  await client.createOrReplace(doc)
  console.log('✓ Seeded the "bigen" document. Open Studio → Our Brands → Bigen.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
