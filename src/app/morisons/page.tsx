import type { Metadata } from 'next'
import MorisonsClient from './MorisonsClient'
import { fetchMorisons } from '@/sanity/queries'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const cms = await fetchMorisons()
  return {
    title: cms?.seoTitle ?? 'Morisons | JL Morison',
    description:
      cms?.seoDescription ??
      'The house of Morison — building goodness Indian families have trusted since 1920, across Morisons Baby Dreams, Emoform, and Bigen.',
    ...(cms?.ogImage ? { openGraph: { images: [cms.ogImage] } } : {}),
  }
}

export default async function MorisonsPage() {
  const cms = await fetchMorisons()
  return (
    <MorisonsClient
      poster={cms?.poster}
      posterLqip={cms?.posterLqip}
      posterAlt={cms?.posterAlt}
    />
  )
}
