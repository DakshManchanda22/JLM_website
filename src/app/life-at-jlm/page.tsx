import LifeAtJlmClient, { type LifeCms } from './LifeAtJlmClient'
import { fetchLifeAtJlm } from '@/sanity/queries'
import { resolveImage, resolveImageUrl } from '@/sanity/resolveImage'

export const revalidate = 60

export default async function LifeAtJlmPage() {
  const data = await fetchLifeAtJlm()

  /* Turn every Sanity image ref into a usable URL.
     Fields with no Sanity value just stay undefined, letting the
     client fall back to its hardcoded default for that field. */
  const cms: LifeCms = data
    ? {
        introImages: data.introImages
          ?.map((img) => {
            const url = resolveImageUrl(img, 1600)
            return url ? { url } : null
          })
          .filter((x): x is { url: string } => x !== null),
        introFinalImage: resolveImageUrl(data.introFinalImage, 1800),
        heroImage: resolveImage(data.heroImage, 2400)?.url,
        heroImageLqip: resolveImage(data.heroImage, 2400)?.lqip,
        heroLine1: data.heroLine1,
        heroLine2: data.heroLine2,
        heroCaptionSmall: data.heroCaptionSmall,
        heroCaptionLarge: data.heroCaptionLarge,
        anchors: data.anchors
          ?.map((a) => {
            const url = resolveImageUrl(a.image, 800)
            if (!url || !a.num || !a.label || !a.targetId) return null
            return { num: a.num, label: a.label, targetId: a.targetId, image: url }
          })
          .filter(
            (x): x is { num: string; label: string; targetId: string; image: string } =>
              x !== null,
          ),
        captionStrip: data.captionStrip
          ?.map((c) => {
            const url = resolveImageUrl(c.image, 1100)
            return url && c.caption
              ? { src: url, caption: c.caption, aspect: c.aspect }
              : null
          })
          .filter(
            (x): x is { src: string; caption: string; aspect: number | undefined } =>
              x !== null,
          ),
        introStatement: data.introStatement,
        arentHeadline: data.arentHeadline,
        arentBody: data.arentBody,
        testimonials: data.testimonials?.filter((t) => t.quote && t.name),
        workplaceLabel: data.workplaceLabel,
        workplaceHeadline: data.workplaceHeadline,
        workplaceTagline: data.workplaceTagline,
        workplaceBody: data.workplaceBody,
        workplaceImages: data.workplaceImages
          ?.map((w) => {
            const url = resolveImageUrl(w.image, 1400)
            return url ? { src: url, cap: w.caption ?? '', aspect: w.aspect } : null
          })
          .filter(
            (x): x is { src: string; cap: string; aspect: number | undefined } =>
              x !== null,
          ),
        carouselSpeed: data.carouselSpeed,
      }
    : {}

  return <LifeAtJlmClient cms={cms} />
}
