import OurStoryClient, { type Era, type OurStoryCms } from './OurStoryClient'
import { fetchOurStory } from '@/sanity/queries'
import { resolveImage } from '@/sanity/resolveImage'

export const revalidate = 60

export default async function OurStoryPage() {
  const data = await fetchOurStory()

  const eras: Era[] | undefined = data?.eras?.map((e) => {
    const r = resolveImage(e.image, 1400)
    return {
      number: e.number,
      dateRange: e.dateRange,
      title: e.title,
      body: e.body,
      image: r?.url,
      lqip: r?.lqip,
    }
  })

  const videoPoster = resolveImage(data?.introVideo?.poster, 1600)

  const cms: OurStoryCms = {
    eyebrow: data?.eyebrow,
    headlineTop: data?.headlineTop,
    headlineBottom: data?.headlineBottom,
    heroTagline: data?.heroTagline,
    establishedMark: data?.establishedMark,
    videoUrl: data?.introVideo?.videoUrl,
    videoPoster: videoPoster?.url,
    videoPosterLqip: videoPoster?.lqip,
    journeyEyebrow: data?.journeyEyebrow,
    journeyHeadline: data?.journeyHeadline,
    journeyStages: data?.journeyStages,
    erasEyebrow: data?.erasEyebrow,
    erasHeadline: data?.erasHeadline,
    eras,
    pillars: data?.pillars,
    closingLine: data?.closingLine,
    closingSubline: data?.closingSubline,
    signatureName: data?.signatureName,
    signatureNote: data?.signatureNote,
  }

  return <OurStoryClient cms={cms} />
}
