import type { Metadata } from 'next'
import CareersClient from './CareersClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchCareers } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('careers'),
    title: 'Careers | JL Morison',
    description:
      'Join J.L. Morison (India) Ltd. — help us build the next hundred years of goodness for Indian families.',
    path: '/careers',
  })
}

export default async function CareersPage() {
  const cms = await fetchCareers()
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Careers', url: '/careers' },
        ]}
      />
      <CareersClient cms={cms ?? undefined} />
    </>
  )
}
