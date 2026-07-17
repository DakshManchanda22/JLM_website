/**
 * One-off content publish for the "named" pages so Sanity is the single source
 * of truth (code defaults are being removed). It:
 *
 *   1. Splits ESG out of the Philanthropy document into its own `esg` document
 *      (re-using the existing image assets — nothing is re-uploaded).
 *   2. Removes the leftover `together*` fields from Life at JL Morison and fills
 *      in the hero / intro / workplace copy + workplace photos.
 *   3. Publishes the full Our Story copy.
 *   4. Adds the homepage "Our Vision" statement if missing.
 *   5. Creates the Careers + Contact Us documents, including the editable
 *      recipient email(s) and the contact photo wheel.
 *
 * Idempotent: existing values are preserved (setIfMissing), the ESG split only
 * runs while the `esg` document doesn't exist yet, and image uploads only happen
 * when the target array is still empty.
 *
 * Run with:  node --env-file=.env.local scripts/seed-named-pages.mjs
 */
import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Run with: node --env-file=.env.local scripts/seed-named-pages.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)
const withKeys = (arr) => arr.map((o) => ({ _key: key(), ...o }))

async function uploadFromUrl(url, filename) {
  console.log(`   ↑ uploading ${filename} …`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, { filename })
  return { _type: 'image', _key: key(), asset: { _type: 'reference', _ref: asset._id } }
}

/* ─────────────────────────── 1. ESG split ─────────────────────────── */

const ESG_FIELDS = [
  'purposeEyebrow',
  'purposeHeading',
  'purposeBackgroundWord',
  'purposeImages',
  'beliefEyebrow',
  'beliefText',
  'statCards',
  'esgWord',
  'esgIntro',
  'esgGallery',
  'socialWord',
  'socialGallery',
  'carouselSpeed',
  'policiesHeading',
  'policiesIntro',
  'policiesImage',
  'policyDocuments',
]

async function splitEsg() {
  console.log('\n• ESG split')
  const existing = await client.fetch(`*[_type=="esg"][0]._id`)
  if (existing) {
    console.log('  esg document already exists — skipping split.')
    return
  }
  const proj = ESG_FIELDS.join(', ')
  const src = await client.fetch(`*[_id=="philanthropy"][0]{ ${proj} }`)
  if (!src) {
    console.log('  no philanthropy document found — skipping.')
    return
  }
  const doc = { _id: 'esg', _type: 'esg' }
  for (const f of ESG_FIELDS) if (src[f] !== undefined && src[f] !== null) doc[f] = src[f]
  if (doc.carouselSpeed === undefined) doc.carouselSpeed = 2

  await client.createOrReplace(doc)
  console.log(`  created esg document with ${Object.keys(doc).length - 2} fields.`)

  // Remove the ESG fields from the philanthropy document.
  await client.patch('philanthropy').unset(ESG_FIELDS).commit()
  console.log('  removed ESG fields from philanthropy document.')
}

/* ─────────────────────── 2. Life at JL Morison ─────────────────────── */

const LIFE_INTRO =
  'At JL Morison, we believe that a great organisation is built on both ' +
  'performance and purpose. We’ve created a workplace that carries the energy ' +
  'and mobility of a growing company while offering the stability and openness ' +
  'of an established MNC — giving our people a rare kind of foundation to grow ' +
  'from. Collaboration, honest communication, and a genuinely positive culture ' +
  'aren’t aspirations here; they’re simply how we work. Everything we do is ' +
  'grounded in values we hold ourselves to, every single day.'

const LIFE_TEXT = {
  heroLine1: 'Life at',
  heroLine2: 'JL Morison',
  heroCaptionSmall: 'Since 1920',
  heroCaptionLarge: 'A century of building goodness, together.',
  introStatement: LIFE_INTRO,
  arentHeadline: 'What our employees say',
  arentBody:
    'A hundred years of building goodness — in the words of the people who do it every day.',
  workplaceLabel: 'Life at JL Morison',
  workplaceHeadline: 'A working day that makes room for actual thinking.',
  workplaceBody:
    'A dynamic, engaging place where creativity thrives, collaboration is ' +
    'encouraged, and every milestone is celebrated together.',
  carouselSpeed: 2,
}

const LIFE_WORKPLACE_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&auto=format', caption: 'Teams at work' },
  { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=1200&fit=crop&auto=format', caption: 'Heads down, building' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop&auto=format', caption: 'In the room together' },
  { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&h=1000&fit=crop&auto=format', caption: 'Milestones, marked' },
  { url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&h=800&fit=crop&auto=format', caption: 'Celebrating together' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=1200&fit=crop&auto=format', caption: 'The everyday rhythm' },
]

const LIFE_TOGETHER_FIELDS = [
  'togetherLabel',
  'togetherHeadline',
  'togetherTagline',
  'togetherBody',
  'togetherBrands',
  'togetherClosingMark',
  'togetherClosingLine',
  'togetherCtaLabel',
  'togetherCtaHref',
]

async function seedLifeAtJlm() {
  console.log('\n• Life at JL Morison')
  const doc = await client.fetch(
    `*[_id=="lifeAtJlm"][0]{ _id, "hasWorkplace": count(workplaceImages) > 0 }`,
  )
  if (!doc?._id) {
    console.log('  no lifeAtJlm document — skipping.')
    return
  }

  const patch = client.patch('lifeAtJlm').unset(LIFE_TOGETHER_FIELDS).setIfMissing(LIFE_TEXT)

  if (!doc.hasWorkplace) {
    console.log('  uploading workplace photos …')
    const images = []
    for (const p of LIFE_WORKPLACE_PHOTOS) {
      const img = await uploadFromUrl(p.url, `life-workplace-${key()}.jpg`)
      images.push({ _type: 'workplaceImage', _key: key(), image: img, caption: p.caption })
    }
    patch.setIfMissing({ workplaceImages: images })
  } else {
    console.log('  workplace photos already set — skipping upload.')
  }

  await patch.commit()
  console.log('  removed together* fields + filled copy.')
}

/* ─────────────────────────── 3. Our Story ─────────────────────────── */

const OUR_STORY = {
  _id: 'ourStory',
  _type: 'ourStory',
  eyebrow: 'Our Story',
  headlineTop:
    'One family business, *five reinventions*, and a century of showing up for Indian homes.',
  heroTagline:
    'From a trading company navigating colonial routes to a modern FMCG house ' +
    'building brands people welcome into their homes — over 100 years of evolving ' +
    'with India, while building brands that families trust for generations.',
  establishedMark: 'EST. 1920',
  journeyHeadline: 'The journey in a nutshell',
  journeyStages: withKeys(
    ['Trading Company', 'Global Brand Partner', 'Manufacturer & Distributor', 'Own Brand Builder', 'Modern FMCG Company'].map(
      (name) => ({ _type: 'journeyStage', name }),
    ),
  ),
  erasHeadline: 'Five defining eras',
  eras: withKeys([
    {
      _type: 'era',
      number: '01',
      dateRange: '1920 — 1940',
      title: 'Global Origins',
      body: 'The story begins in the UK, with a small trading house carrying European craft into a still-young Indian market — and a first principle that never changes: stand for trust, stand for quality.',
    },
    {
      _type: 'era',
      number: '02',
      dateRange: '1940 — 2000',
      title: 'Strategic Partnerships',
      body: 'Six decades of patient brand-building alongside the world’s most discerning names. Each collaboration deepens our distribution, sharpens our standards, and earns lasting credibility.',
    },
    {
      _type: 'era',
      number: '03',
      dateRange: '2001 — 2010',
      title: 'Brand Reinvention',
      body: 'A decisive turn — from carrying others’ brands to building our own, led by Morisons Baby Dreams, a brand made specifically for Indian mothers and the babies they raise.',
    },
    {
      _type: 'era',
      number: '04',
      dateRange: '2011 — 2020',
      title: 'Digital & Manufacturing Transformation',
      body: 'We invest in our own factories, our own systems, and our own omnichannel presence. Production moves in-house, technology moves alongside it, and distribution reaches every postcode that matters.',
    },
    {
      _type: 'era',
      number: '05',
      dateRange: '2021 — Present',
      title: 'Future-Focused Growth',
      body: 'Baby care widens. ESG, analytics, and modern retail are no longer adjacent — they are how we operate. A hundred-year company keeps its first principles while writing its next chapter.',
    },
  ]),
  pillarsHeadline: 'Guiding pillars',
  pillars: withKeys(
    ['Trusted Legacy', 'Consumer Centric', 'Innovation Driven', 'Sustainable Future', 'People First'].map(
      (name) => ({ _type: 'pillar', name }),
    ),
  ),
  closingLine:
    '“From global partnerships to homegrown leadership — J.L. Morison’s journey ' +
    'reflects over 100 years of evolving with consumer needs, while building ' +
    'trusted brands for generations.”',
}

async function seedOurStory() {
  console.log('\n• Our Story')
  const published = await client.fetch(`*[_id=="ourStory"][0]{ _id, eyebrow }`)
  if (published?.eyebrow) {
    console.log('  already published — skipping.')
    return
  }
  await client.createOrReplace(OUR_STORY)
  // Drop the empty draft so the Studio shows the published content cleanly.
  await client.delete('drafts.ourStory').catch(() => {})
  console.log('  published Our Story content.')
}

/* ─────────────────────────── 4. Homepage vision ─────────────────────────── */

const HOME_VISION = {
  label: 'Our Vision',
  text:
    'To be a sustainably growing, socially responsible organization that provides ' +
    'innovative, high-quality baby care products while becoming the market leader ' +
    'in the baby care industry.',
}

async function seedHomepageVision() {
  console.log('\n• Homepage vision')
  const doc = await client.fetch(`*[_id=="homepage"][0]{ _id, "hasVision": defined(vision.text) }`)
  if (!doc?._id) {
    console.log('  no homepage document — skipping.')
    return
  }
  if (doc.hasVision) {
    console.log('  vision already set — skipping.')
    return
  }
  await client.patch('homepage').setIfMissing({ vision: HOME_VISION }).commit()
  console.log('  set Our Vision statement.')
}

/* ─────────────────────────── 5. Careers ─────────────────────────── */

const CAREERS = {
  eyebrow: 'Careers',
  headline: 'Join',
  headlineItalic: 'us',
  tagline: 'Help us build the next hundred years of goodness for Indian families.',
  body:
    'Tell us a little about yourself and attach your CV. We read every ' +
    'application — even if there isn’t an open role today, the right person stays ' +
    'on our radar.',
  submitLabel: 'Submit application',
  successMessage: 'Thank you — we’ve received your application. We’ll be in touch.',
  recipientEmails: ['hr@jlmorison.com'],
}

async function seedCareers() {
  console.log('\n• Careers')
  await client.createIfNotExists({ _id: 'careers', _type: 'careers' })
  await client.patch('careers').setIfMissing(CAREERS).commit()
  console.log('  seeded careers copy + recipient email.')
}

/* ─────────────────────────── 6. Contact Us ─────────────────────────── */

const CONTACT = {
  heading: 'Contact us',
  subcopy: "We'd love to hear from you. Fill out the form and we'll get back to you shortly.",
  offices: withKeys([
    {
      _type: 'office',
      title: 'Registered Office: Kolkata',
      address:
        'Adventz Infinity @ 5, Plot No. 5,\nBlock - BN, North Wing, No. 1106,\n11th Floor, Sector - V, Salt Lake,\nKolkata - 700 091.',
      phone: '(033) 22480114',
      phoneHref: 'tel:+913322480114',
      email: 'info@jlmorison.com',
    },
    {
      _type: 'office',
      title: 'Head Office: Mumbai',
      address:
        'Peninsula Business Park, Tower "A",\n8th Floor, Senapati Bapat Marg,\nLower Parel, Mumbai - 400 013.',
      phone: '(022) 61410300',
      phoneHref: 'tel:+912261410300',
      email: 'customercare@jlmorison.com',
    },
  ]),
  formHeading: 'Write us a message',
  formSuccessHeading: 'Message sent.',
  formSuccessBody:
    'Thank you for reaching out. Someone from our team will be in touch with you soon.',
  privacyPolicyUrl: 'https://storage.googleapis.com/jlm_website_v2/Privacy-Policy.pdf',
  wheelHeading: 'Want to work with us?',
  wheelCtaLabel: 'Join the team',
  wheelCtaHref: '/careers',
  recipientEmails: ['customercare@jlmorison.com', 'info@jlmorison.com'],
}

const CONTACT_PORTRAITS = [
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=500&fit=crop&auto=format',
]

async function seedContactUs() {
  console.log('\n• Contact Us')
  await client.createIfNotExists({ _id: 'contactUs', _type: 'contactUs' })
  const doc = await client.fetch(`*[_id=="contactUs"][0]{ "hasPortraits": count(portraits) > 0 }`)

  const patch = client.patch('contactUs').setIfMissing(CONTACT)

  if (!doc?.hasPortraits) {
    console.log('  uploading portrait photos …')
    const portraits = []
    for (const url of CONTACT_PORTRAITS) {
      try {
        portraits.push(await uploadFromUrl(url, `contact-portrait-${key()}.jpg`))
      } catch (e) {
        console.log(`   ⚠ skipped (${e.message})`)
      }
    }
    if (portraits.length > 0) patch.setIfMissing({ portraits })
  } else {
    console.log('  portraits already set — skipping upload.')
  }

  await patch.commit()
  console.log('  seeded contact copy, offices, recipient emails.')
}

/* ─────────────────────────── run ─────────────────────────── */

async function run() {
  await splitEsg()
  await seedLifeAtJlm()
  await seedOurStory()
  await seedHomepageVision()
  await seedCareers()
  await seedContactUs()
  console.log('\nDone.')
}

await run()
