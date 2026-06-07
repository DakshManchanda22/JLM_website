import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'JL Morison (India) Ltd.',
  description: 'Building goodness for every Indian family since 1920.',
}

const NAV_HEIGHT = 64

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ overflow: 'hidden', height: '100vh' }}>
        <Navbar />

        {/* Single fixed wrapper — the rounded "card" the entire page lives in.
            All sections (hero, quote, etc.) scroll INSIDE this card, so the
            top corners stay permanently anchored just below the navbar. */}
        <main
          id="page-scroller"
          style={{
            position: 'fixed',
            top: `${NAV_HEIGHT}px`,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  )
}
