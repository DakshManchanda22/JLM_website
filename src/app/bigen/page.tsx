import type { Metadata } from 'next'
import BigenClient from './BigenClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchBigen } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('bigen'),
    title: "Bigen Men's Beard Colour | JL Morison",
    description:
      "Japan's No.1 men's beard colour. A no-ammonia colour cream enriched with olive oil and taurine — salon-grade depth in ten minutes, at home.",
    path: '/bigen',
  })
}

export default async function BigenPage() {
  const cms = await fetchBigen()
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Bigen', url: '/bigen' },
        ]}
      />
      <BigenClient cms={cms ?? {}} />
    </>
  )
}
