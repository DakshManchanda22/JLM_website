import type { Metadata } from 'next'
import EsgClient from './EsgClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchEsg } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('esg'),
    title: 'ESG | JL Morison',
    description:
      'Environment, Social and Governance at JL Morison — sustainable practices, community impact and the standards that guide how we work.',
    path: '/esg',
  })
}

export default async function EsgPage() {
  const cms = await fetchEsg()
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'ESG', url: '/esg' },
        ]}
      />
      <EsgClient cms={cms ?? undefined} />
    </>
  )
}
