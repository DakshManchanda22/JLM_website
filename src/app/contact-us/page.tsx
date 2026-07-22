import type { Metadata } from 'next'
import ContactClient from './ContactClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchContactUs } from '@/sanity/queries'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('contactUs'),
    title: 'Contact Us | JL Morison',
    description:
      'Get in touch with J.L. Morison (India) Ltd. — our Kolkata and Mumbai offices, and a quick contact form.',
    path: '/contact-us',
  })
}

export default async function ContactPage() {
  const cms = await fetchContactUs()
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact-us' },
        ]}
      />
      <ContactClient cms={cms ?? undefined} />
    </>
  )
}
