import type { Metadata } from 'next'
import LifeAtJlmClient, { type LifeCms } from './LifeAtJlmClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchLifeAtJlm } from '@/sanity/queries'
import { resolveImage } from '@/sanity/resolveImage'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('lifeAtJlm'),
    title: 'Life at JLM | JL Morison',
    description:
      'Life at JL Morison — the people, culture and everyday moments behind a ' +
      'century of building goodness.',
    path: '/life-at-jlm',
  })
}

export default async function LifeAtJlmPage() {
  const data = await fetchLifeAtJlm()

  /* Turn every Sanity image ref into a usable URL.
     Fields with no Sanity value just stay undefined, letting the
     client fall back to its hardcoded default for that field. */
  const cms: LifeCms = data
    ? {
        // Default ON when the flag is unset so existing content keeps the intro.
        showIntro: data.showIntro ?? true,
        introImages: data.introImages
          ?.map((img) => {
            const r = resolveImage(img, 1600)
            return r ? { url: r.url, lqip: r.lqip } : null
          })
          .filter((x): x is { url: string; lqip: string | undefined } => x !== null),
        introFinalImage: resolveImage(data.introFinalImage, 1800)?.url,
        introFinalImageLqip: resolveImage(data.introFinalImage, 1800)?.lqip,
        heroImage: resolveImage(data.heroImage, 2400)?.url,
        heroImageLqip: resolveImage(data.heroImage, 2400)?.lqip,
        heroLine1: data.heroLine1,
        heroLine2: data.heroLine2,
        heroCaptionSmall: data.heroCaptionSmall,
        heroCaptionLarge: data.heroCaptionLarge,
        captionStrip: data.captionStrip
          ?.map((c) => {
            // A photo only needs an image to appear in the carousel; the italic
            // caption is optional, so photos added without one still render.
            const r = resolveImage(c.image, 1100)
            return r ? { src: r.url, lqip: r.lqip, caption: c.caption, aspect: c.aspect } : null
          })
          .filter(
            (x): x is { src: string; lqip: string | undefined; caption: string | undefined; aspect: number | undefined } =>
              x !== null,
          ),
        introStatement: data.introStatement,
        arentHeadline: data.arentHeadline,
        arentBody: data.arentBody,
        testimonials: data.testimonials?.filter((t) => t.quote && t.name),
        carouselSpeed: data.carouselSpeed,
      }
    : {}

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Life at JLM', url: '/life-at-jlm' },
        ]}
      />
      <LifeAtJlmClient cms={cms} />
    </>
  )
}
