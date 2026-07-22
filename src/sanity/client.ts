import { createClient } from 'next-sanity'

import { apiVersion, dataset, isSanityConfigured, projectId, useCdn } from './env'

// Server-only read token. `SANITY_API_TOKEN` has no NEXT_PUBLIC_ prefix, so
// Next.js never inlines it into the browser bundle — it resolves to undefined on
// the client (where we never fetch anyway). Server Components fetch WITH the token
// so we can read documents the project restricts from anonymous public access
// (the leadership team docs are published but not publicly readable). Combined
// with perspective:'published' this reads published content only — never drafts.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
      token: process.env.SANITY_API_TOKEN,
    })
  : null

export type SanityClient = NonNullable<typeof client>
