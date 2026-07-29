import type { Metadata, Viewport } from 'next'
import SiteChrome from '@/components/SiteChrome'
import SmoothScroll from '@/components/SmoothScroll'
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import { fetchSiteSettings } from '@/sanity/queries'
import { SITE_URL } from '@/sanity/seo'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'JL Morison | Trusted FMCG Brands Since 1920 | India',
    template: '%s | JL Morison',
  },
  description:
    'Morisons Baby Dreams, Emoform & Bigen — three trusted brands built by ' +
    'JL Morison over 100 years for Indian families.',
  keywords: [
    'JL Morison',
    'Morisons Baby Dreams',
    'Emoform',
    'Bigen',
    'FMCG India',
    'baby care India',
    'dental care India',
    'hair care India',
  ],
  authors: [{ name: 'JL Morison India Ltd' }],
  creator: 'JL Morison India Ltd',
  publisher: 'JL Morison India Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'JL Morison',
    title: 'JL Morison | Trusted FMCG Brands Since 1920 | India',
    description:
      'Morisons Baby Dreams, Emoform & Bigen — three trusted brands built by ' +
      'JL Morison over 100 years for Indian families.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'JL Morison — Building Goodness Since 1920',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JL Morison | Trusted FMCG Brands Since 1920',
    description: 'Three trusted FMCG brands for Indian families.',
    images: ['/og-default.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

// Dark browser chrome (status bar / address bar tint) on iOS + Android, matching
// the navbar so the browser UI blends into one seamless dark header.
export const viewport: Viewport = {
  themeColor: '#111111',
}

// Refresh the Sanity-managed footer/site settings without a redeploy.
export const revalidate = 60

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await fetchSiteSettings()

  // Verified social profiles for the Organization schema's `sameAs`.
  const sameAs = Object.values(settings?.footerSocial ?? {}).filter(
    (url): url is string => Boolean(url),
  )

  return (
    <html lang="en">
      <head>
        {/* Warm up the Sanity image CDN so hero media starts downloading sooner. */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <OrganizationSchema sameAs={sameAs} />
        <SmoothScroll />
        <SiteSettingsProvider value={settings}>
          <SiteChrome>{children}</SiteChrome>
        </SiteSettingsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
