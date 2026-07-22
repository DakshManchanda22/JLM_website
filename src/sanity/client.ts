import { createClient } from 'next-sanity'

import { apiVersion, dataset, isSanityConfigured, projectId, useCdn } from './env'

// Anonymous, read-only client — no API token. The dataset is public, so every
// published document (homepage, brands, leadership, etc.) is readable over the
// public API without credentials. Leadership docs must use plain, dot-free _ids
// (e.g. `leader-sakshi-mody`, never `leader.sakshi-mody`): Sanity treats any
// path-prefixed id (one containing a `.`, like the `drafts.` prefix) as private
// and hides it from the public API, which is what previously forced a token.
// perspective:'published' keeps drafts out of the site.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
    })
  : null

export type SanityClient = NonNullable<typeof client>
