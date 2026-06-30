import type { Metadata, Viewport } from 'next'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'JL Morison (India) Ltd.',
  description: 'Building goodness for every Indian family since 1920.',
}

// Dark browser chrome (status bar / address bar tint) on iOS + Android, matching
// the navbar so the browser UI blends into one seamless dark header.
export const viewport: Viewport = {
  themeColor: '#111111',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {/* The rounded white "card" the page lives in. It flows in the normal
            document so the WINDOW scrolls natively (mobile toolbars collapse like
            Apple). `overflow: clip` clips children to the rounded corners without
            making this a scroll container — so position:sticky / GSAP pins inside
            still resolve against the viewport. */}
        <main
          style={{
            minHeight: 'calc(100dvh - var(--nav-h))',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            overflow: 'clip',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  )
}
