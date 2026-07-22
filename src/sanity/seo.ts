/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next'
import { groq } from 'next-sanity'

import { client } from './client'
import { imageWithLqip, resolveImage } from './resolveImage'

/** Canonical production origin — no trailing slash. */
export const SITE_URL = 'https://www.jlmorison.com'

/** Default social share image (lives in /public). */
export const DEFAULT_OG_IMAGE = '/og-default.jpg'

export type PageSeo = {
  seoTitle?: string
  seoDescription?: string
  ogImage?: string
  ogImageAlt?: string
}

/**
 * GROQ projection for the shared SEO fields (see schemas/seoFields.ts).
 * Spread into any document query: `*[_type == "esg"][0]{ ..., ${seoProjection} }`.
 */
export const seoProjection = groq`
  seoTitle,
  seoDescription,
  ogImage{ ${imageWithLqip} },
  ogImageAlt
`

/** Turn the raw projected SEO fields into a resolved {@link PageSeo}. */
export function resolveSeo(raw: any): PageSeo | undefined {
  if (!raw) return undefined
  const og = resolveImage(raw.ogImage, 1200)
  return {
    seoTitle: raw.seoTitle || undefined,
    seoDescription: raw.seoDescription || undefined,
    ogImage: og?.url,
    ogImageAlt: raw.ogImageAlt || undefined,
  }
}

/**
 * Fetch just the SEO fields for a singleton document type (e.g. 'philanthropy',
 * 'esg', 'careers'). Returns undefined when Sanity isn't configured or the doc
 * has no SEO set, so pages fall back to their hard-coded defaults.
 */
export async function fetchPageSeo(type: string): Promise<PageSeo | undefined> {
  if (!client) return undefined
  const raw = await client.fetch(
    groq`*[_type == $type][0]{ ${seoProjection} }`,
    { type },
  )
  return resolveSeo(raw)
}

type BuildMetadataArgs = {
  /** Sanity-managed SEO overrides (optional). */
  seo?: PageSeo
  /** Fallback title used when no `seoTitle` is set. Include the brand suffix. */
  title: string
  /** Fallback description used when no `seoDescription` is set. */
  description: string
  /** Absolute path for the canonical URL, e.g. '/philanthropy' ('' for home). */
  path: string
}

/**
 * Build a Next.js Metadata object from Sanity SEO fields + fallbacks.
 * Sets title/description, a canonical URL, and Open Graph + Twitter cards
 * (falling back to the site's default OG image). `title` is emitted as
 * `absolute` so the root layout's title template never double-appends the brand.
 */
export function buildMetadata({
  seo,
  title,
  description,
  path,
}: BuildMetadataArgs): Metadata {
  const finalTitle = seo?.seoTitle || title
  const finalDescription = seo?.seoDescription || description
  const canonical = `${SITE_URL}${path}`
  const ogUrl = seo?.ogImage || DEFAULT_OG_IMAGE
  const ogImage = {
    url: ogUrl,
    width: 1200,
    height: 630,
    alt: seo?.ogImageAlt || finalTitle,
  }

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogUrl],
    },
  }
}
