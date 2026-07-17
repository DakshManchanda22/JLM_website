import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Investor Relations | JL Morison',
  description:
    'Investor relations for J.L. Morison (India) Ltd. — financial reports, disclosures and shareholder information.',
}

export default function InvestorRelationsPage() {
  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`}>
      <section
        className="flex w-full flex-col items-center justify-center text-center"
        style={{ minHeight: 'calc(100svh - var(--nav-h))', padding: '16vh 6vw 10vh', backgroundColor: '#E8E0D5' }}
      >
        <p
          className={`${dmSans.className} uppercase`}
          style={{ fontSize: 11, letterSpacing: '0.22em', color: '#555555', fontWeight: 500 }}
        >
          Investor Relations
        </p>
        <h1
          className={`${cormorant.className} mt-6`}
          style={{ fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 1.04, fontWeight: 300, color: '#111111' }}
        >
          Coming{' '}
          <span className="italic" style={{ fontWeight: 400 }}>
            soon
          </span>
        </h1>
        <p
          className={`${dmSans.className} mt-6 max-w-[54ch]`}
          style={{ color: '#555555', fontSize: 15, lineHeight: 1.7 }}
        >
          Financial reports, disclosures and shareholder information will be available here shortly.
        </p>
      </section>
      <Footer />
    </div>
  )
}
