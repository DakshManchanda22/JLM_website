import type { Metadata } from 'next'
import PhilanthropyClient from './PhilanthropyClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchPhilanthropy } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('philanthropy'),
    title: 'Philanthropy | JL Morison',
    description:
      'Building goodness beyond the shelf. Through Project Kaamyaab, JL Morison ' +
      'skills underprivileged new mothers to rejoin the workforce.',
    path: '/philanthropy',
  })
}

export default async function PhilanthropyPage() {
  const cms = await fetchPhilanthropy()

  // The Kaamyaab film is now managed on the Philanthropy document itself
  // (Sanity → Philanthropy → Video).
  const video = cms?.videoUrl
    ? { videoUrl: cms.videoUrl, poster: cms.videoPoster, posterLqip: cms.videoPosterLqip }
    : undefined

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Philanthropy', url: '/philanthropy' },
        ]}
      />
      <PhilanthropyClient cms={cms ?? undefined} video={video} />
    </>
  )
}
