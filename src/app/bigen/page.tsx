import type { Metadata } from 'next'
import BigenClient from './BigenClient'
import { fetchBigen } from '@/sanity/queries'

export const metadata: Metadata = {
  title: "Bigen Men's Beard Colour | JL Morison",
  description:
    "Japan's No.1 men's beard colour. A no-ammonia colour cream enriched with olive oil and taurine — salon-grade depth in ten minutes, at home.",
}

export const revalidate = 60

export default async function BigenPage() {
  const cms = await fetchBigen()
  return <BigenClient cms={cms ?? {}} />
}
