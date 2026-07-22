import type { Metadata } from 'next'
import EmoformClient from './EmoformClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchEmoform } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('emoform'),
    title: 'Emoform | JL Morison',
    description:
      'Sensitivity ka अंत, तुरंत — fast, lasting relief from tooth sensitivity with Emoform.',
    path: '/emoform',
  })
}

export default async function EmoformPage() {
  const cms = await fetchEmoform()
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Emoform', url: '/emoform' },
        ]}
      />
      <EmoformClient cms={cms ?? undefined} />
    </>
  )
}
