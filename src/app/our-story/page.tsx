import OurStoryClient, { type Era, type OurStoryCms } from './OurStoryClient'
import { fetchOurStory } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

export const revalidate = 60

export default async function OurStoryPage() {
  const data = await fetchOurStory()

  const eras: Era[] | undefined = data?.eras?.map((e) => ({
    number: e.number,
    dateRange: e.dateRange,
    title: e.title,
    body: e.body,
    image: resolveImageUrl(e.image, 1400),
  }))

  const cms: OurStoryCms = {
    eyebrow: data?.eyebrow,
    headlineTop: data?.headlineTop,
    headlineBottom: data?.headlineBottom,
    heroTagline: data?.heroTagline,
    establishedMark: data?.establishedMark,
    journeyEyebrow: data?.journeyEyebrow,
    journeyHeadline: data?.journeyHeadline,
    journeyStages: data?.journeyStages,
    erasEyebrow: data?.erasEyebrow,
    erasHeadline: data?.erasHeadline,
    eras,
    pillarsEyebrow: data?.pillarsEyebrow,
    pillarsHeadline: data?.pillarsHeadline,
    pillars: data?.pillars,
    closingLine: data?.closingLine,
    closingSubline: data?.closingSubline,
  }

  return <OurStoryClient cms={cms} />
}
