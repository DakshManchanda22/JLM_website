import type { Metadata } from 'next'
import MorisonsClient from './MorisonsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchMorisons } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('morisons'),
    title: 'Morisons | JL Morison',
    description:
      'The house of Morison — building goodness Indian families have trusted since ' +
      '1920, across Morisons Baby Dreams, Emoform, and Bigen.',
    path: '/morisons',
  })
}

export default async function MorisonsPage() {
  const cms = await fetchMorisons()
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Morisons', url: '/morisons' },
        ]}
      />
      <MorisonsClient
        poster={cms?.poster}
        posterLqip={cms?.posterLqip}
        posterAlt={cms?.posterAlt}
        posterAspect={cms?.posterAspect}
      />
    </>
  )
}
