/* eslint-disable @typescript-eslint/no-explicit-any */
import { isSanityConfigured } from './env'
import { urlFor } from './image'

/**
 * Returns a usable image URL whether the source is a Sanity asset ref or a demo
 * placeholder carrying `_url`. Returns undefined when nothing usable is present.
 */
export function resolveImageUrl(source: any, width = 2000): string | undefined {
  if (!source) return undefined
  if (typeof source === 'string') return source
  if (source._url) return source._url
  if (isSanityConfigured && source.asset) {
    return urlFor(source).width(width).url()
  }
  return undefined
}
