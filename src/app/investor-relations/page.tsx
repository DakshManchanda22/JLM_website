import type { Metadata } from 'next'
import InvestorRelationsClient from './InvestorRelationsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchInvestorRelations } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('investorRelations'),
    title: 'Investor Relations | JL Morison',
    description:
      'Investor relations for J.L. Morison (India) Ltd. — policies, notices of general meetings, investor information and IEPF.',
    path: '/investor-relations',
  })
}

export default async function InvestorRelationsPage() {
  const cms = (await fetchInvestorRelations()) ?? {}
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Investor Relations', url: '/investor-relations' },
        ]}
      />
      <InvestorRelationsClient cms={cms} />
    </>
  )
}
