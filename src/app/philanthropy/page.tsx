import type { Metadata } from 'next'
import PhilanthropyClient from './PhilanthropyClient'
import { fetchPhilanthropy } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Philanthropy | JL Morison',
  description:
    'Building goodness beyond the shelf. Through Project Kaamyaab, JL Morison skills underprivileged new mothers to rejoin the workforce.',
}

export const revalidate = 60

export default async function PhilanthropyPage() {
  const cms = await fetchPhilanthropy()

  // The Kaamyaab film is now managed on the Philanthropy document itself
  // (Sanity → Philanthropy → Video).
  const video = cms?.videoUrl
    ? { videoUrl: cms.videoUrl, poster: cms.videoPoster, posterLqip: cms.videoPosterLqip }
    : undefined

  return <PhilanthropyClient cms={cms ?? undefined} video={video} />
}
