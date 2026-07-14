/**
 * Seed the "Footer & site settings" singleton with the current footer content
 * so marketing sees everything pre-filled and can edit it in Sanity. Uses
 * createIfNotExists, so it never clobbers edits once the doc exists.
 *
 * Run:  node --env-file=.env.local scripts/seed-site-settings.mjs
 */
import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing env. Run with: node --env-file=.env.local scripts/seed-site-settings.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

const doc = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  footerCompanyLinks: [
    { _key: key(), label: 'About', href: '/our-story', external: false },
    { _key: key(), label: 'Careers', href: '/careers', external: false },
    { _key: key(), label: 'Contact Us', href: '/contact-us', external: false },
    {
      _key: key(),
      label: 'Privacy Policy',
      href: 'https://storage.googleapis.com/jlm_website_v2/Privacy-Policy.pdf',
      external: true,
    },
  ],
  footerAddress: [
    'J. L. Morison (India) Limited',
    'Peninsula Business Park, 8th Floor, Tower A,',
    'Senapati Bapat Marg, Lower Parel,',
    'Mumbai 400013',
  ],
  footerSocial: {
    linkedin: 'https://www.linkedin.com/company/j-l-morison/',
  },
  footerFollowText:
    "Follow our journey — products, stories, and the goodness we're building every day.",
  footerCopyright: '© 2024 JL Morison India Ltd. All rights reserved.',
}

const res = await client.createIfNotExists(doc)
console.log('Site settings seeded:', res._id)
