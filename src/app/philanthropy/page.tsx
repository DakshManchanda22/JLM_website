import type { Metadata } from 'next'
import PhilanthropyClient from './PhilanthropyClient'
import { fetchPhilanthropy, fetchHomepage } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

export const metadata: Metadata = {
  title: 'Philanthropy | JL Morison',
  description:
    'Building goodness beyond the shelf. Through Project Kaamyaab, JL Morison skills underprivileged new mothers to rejoin the workforce.',
}

export const revalidate = 60

export default async function PhilanthropyPage() {
  // The Kaamyaab video is the same one configured for the homepage hero, so we
  // pull it from the homepage document and reuse it at the top of this page.
  const [cms, homepage] = await Promise.all([fetchPhilanthropy(), fetchHomepage()])

  const hv = homepage?.heroVideo
  const video = hv?.videoUrl
    ? { videoUrl: hv.videoUrl, poster: resolveImageUrl(hv.poster, 2000) }
    : undefined

  return <PhilanthropyClient cms={cms ?? undefined} video={video} />
}
