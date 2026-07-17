import type { Metadata } from 'next'
import ContactClient from './ContactClient'
import { fetchContactUs } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Contact Us | JL Morison',
  description:
    'Get in touch with J.L. Morison (India) Ltd. — our Kolkata and Mumbai offices, and a quick contact form.',
}

export const revalidate = 60

export default async function ContactPage() {
  const cms = await fetchContactUs()
  return <ContactClient cms={cms ?? undefined} />
}
