import OurStoryClient, { type Milestone, type OurStoryCms } from './OurStoryClient'
import { fetchOurStory } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

export const revalidate = 60

export default async function OurStoryPage() {
  const data = await fetchOurStory()

  const milestones: Milestone[] | undefined = data?.milestones?.map((m) => {
    const url = resolveImageUrl(m.image, 800)
    return {
      year: m.year,
      description: m.description,
      side: m.side,
      image: url
        ? {
            src: url,
            // Sanity image URLs scale via the asset pipeline — these dims are
            // a hint for next/image's intrinsic ratio; the asset itself decides
            // the actual pixel size. 1000x800 is a sensible 5:4 default.
            width: 1000,
            height: 800,
            alt: m.year,
            offsetY: m.offsetY,
          }
        : undefined,
    }
  })

  const cms: OurStoryCms = {
    eyebrow: data?.eyebrow,
    headlineTop: data?.headlineTop,
    headlineBottom: data?.headlineBottom,
    milestones,
  }

  return <OurStoryClient cms={cms} />
}
