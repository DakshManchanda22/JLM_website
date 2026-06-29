/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from 'next-sanity'

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

export type ResolvedImage = { url: string; lqip?: string }

/**
 * Like {@link resolveImageUrl} but also surfaces the asset's low-quality image
 * placeholder (LQIP) for `next/image`'s `placeholder="blur"`. Pull the `lqip`
 * into the image object in GROQ with {@link imageWithLqip}.
 */
export function resolveImage(
  source: any,
  width = 2000
): ResolvedImage | undefined {
  const url = resolveImageUrl(source, width)
  if (!url) return undefined
  const lqip =
    source && typeof source === 'object'
      ? source.lqip ?? source.asset?.metadata?.lqip
      : undefined
  return { url, lqip }
}

/**
 * GROQ projection for an image field that also pulls the LQIP blur string.
 * Use as: `heroImage{ ${imageWithLqip} }` — spreads the image (asset ref +
 * hotspot) so `urlFor` still works, and adds a flat `lqip` field.
 */
export const imageWithLqip = groq`..., "lqip": asset->metadata.lqip`
