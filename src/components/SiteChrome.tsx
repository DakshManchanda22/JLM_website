'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

/**
 * Wraps page content in the site chrome (fixed navbar + the rounded white
 * "card" that the marketing pages live in) — EXCEPT on the embedded Sanity
 * Studio at /studio, which needs the full viewport to itself. Without this the
 * site navbar + top padding push the Studio down until its Publish bar falls
 * below the viewport and becomes unclickable.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Studio renders bare, full-viewport — no navbar, no padding, no card.
  if (pathname?.startsWith('/studio')) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />

      {/* The dark spacer sits behind the fixed navbar (var(--nav-h) tall) so the
          rounded white card below starts flush under it — replaces the old
          body padding-top, which used to leak onto /studio too. */}
      <div style={{ paddingTop: 'var(--nav-h)', backgroundColor: '#111111' }}>
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
      </div>
    </>
  )
}
