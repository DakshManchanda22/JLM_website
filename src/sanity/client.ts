import { createClient } from 'next-sanity'

import { apiVersion, dataset, isSanityConfigured, projectId, useCdn } from './env'

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
