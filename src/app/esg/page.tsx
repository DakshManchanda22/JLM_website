import type { Metadata } from 'next'
import EsgClient from './EsgClient'
import { fetchEsg } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'ESG | JL Morison',
  description:
    'Environment, Social and Governance at JL Morison — sustainable practices, community impact and the standards that guide how we work.',
}

export const revalidate = 60

export default async function EsgPage() {
  const cms = await fetchEsg()
  return <EsgClient cms={cms ?? undefined} />
}
