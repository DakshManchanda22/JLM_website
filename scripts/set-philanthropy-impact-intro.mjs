/**
 * Update the Philanthropy "Impact (5 years)" supporting line (impactIntro) to the
 * new Project Kaamyaab paragraph. Patches both the published and draft docs if
 * present so the change reflects in Studio and on the site.
 *
 * Run:  node --env-file=.env.local scripts/set-philanthropy-impact-intro.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const NEW_INTRO =
  "Through Project Kaamyaab, JL Morison's Corporate Philanthropy Program, we provide vocational training to young mothers from lower socio-economic backgrounds — helping them build the skills, confidence, and workplace readiness to re-enter the workforce and create stronger futures for themselves and their families."

const ids = await client.fetch(
  '*[_type == "philanthropy"]._id'
)

if (!ids.length) {
  console.error('No philanthropy document found.')
  process.exit(1)
}

for (const id of ids) {
  const res = await client.patch(id).set({ impactIntro: NEW_INTRO }).commit()
  console.log('Updated impactIntro on:', res._id)
}
