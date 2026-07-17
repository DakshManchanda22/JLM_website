import type { Metadata } from 'next'
import CareersClient from './CareersClient'
import { fetchCareers } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Careers | JL Morison',
  description:
    'Join J.L. Morison (India) Ltd. — help us build the next hundred years of goodness for Indian families.',
}

export const revalidate = 60

export default async function CareersPage() {
  const cms = await fetchCareers()
  return <CareersClient cms={cms ?? undefined} />
}
