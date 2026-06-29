import type { Metadata } from 'next'
import EmoformClient from './EmoformClient'
import { fetchEmoform } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Emoform | JL Morison',
  description:
    'Sensitivity ka अंत, तुरंत — fast, lasting relief from tooth sensitivity with Emoform.',
}

export const revalidate = 60

export default async function EmoformPage() {
  const cms = await fetchEmoform()
  return <EmoformClient cms={cms ?? undefined} />
}
