import type { Metadata } from 'next'
import MorisonsClient from './MorisonsClient'

export const metadata: Metadata = {
  title: 'Morisons | JL Morison',
  description:
    'The house of Morison — building goodness Indian families have trusted since 1920, across Morisons Baby Dreams, Emoform, and Bigen.',
}

export const revalidate = 60

export default function MorisonsPage() {
  return <MorisonsClient />
}
