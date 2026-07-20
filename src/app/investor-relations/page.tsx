import type { Metadata } from 'next'
import InvestorRelationsClient from './InvestorRelationsClient'
import { fetchInvestorRelations } from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Investor Relations | JL Morison',
  description:
    'Investor relations for J.L. Morison (India) Ltd. — policies, notices of general meetings, investor information and IEPF.',
}

export default async function InvestorRelationsPage() {
  const cms = (await fetchInvestorRelations()) ?? {}
  return <InvestorRelationsClient cms={cms} />
}
