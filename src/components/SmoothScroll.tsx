'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Site-wide smooth scrolling (Lenis), synced with GSAP ScrollTrigger so every
 * scrubbed/pinned animation stays in lock-step with the smoothed scroll.
 *
 * The window still scrolls natively — Lenis just eases the wheel — so mobile
 * browser toolbars keep collapsing (Apple-like) and Cmd/Ctrl+F, anchors and
 * scroll restoration all behave. Touch is left un-smoothed on purpose. Studio
 * and reduced-motion users get plain native scrolling.
 */
export default function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    // Pages that manage their own scrolling opt out of Lenis:
    //  • /studio — the Sanity Studio scrolls itself.
    //  • /emoform — a bespoke sticky/observer scrollytelling tuned for native
    //    scroll; Lenis' inertia makes its active-step boundary flicker.
    const NATIVE_SCROLL_ROUTES = ['/studio', '/emoform']
    if (NATIVE_SCROLL_ROUTES.some((r) => pathname?.startsWith(r))) return
    // Honour reduced-motion — keep scrolling fully native.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
    })

    // Keep ScrollTrigger updating off Lenis' smoothed scroll, and drive Lenis
    // from GSAP's ticker so there's a single rAF loop for the whole page.
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [pathname])

  return null
}
