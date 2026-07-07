import type { Metadata } from 'next'
import PhilanthropyClient from './PhilanthropyClient'
import { fetchPhilanthropy } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Philanthropy | JL Morison',
  description:
    'Building goodness beyond the shelf. Through Project Kaamyaab, JL Morison skills underprivileged new mothers to rejoin the workforce.',
}

export const revalidate = 60

export default async function PhilanthropyPage() {
  const cms = await fetchPhilanthropy()
  return <PhilanthropyClient cms={cms ?? undefined} />
}
