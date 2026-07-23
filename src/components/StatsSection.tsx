'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type Stat = {
  number: string
  label: string
  /** Optional hex overrides for the number / label text colour. */
  numberColor?: string
  labelColor?: string
  /** Optional background photo. When set, the image fills the card behind a
      bottom-weighted gradient, with the number + label in white over it. */
  image?: string
  lqip?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

/* White scallop bumps that sit on top of the dark brand section above,
   creating the soft curvy intersection. Each tile is a true semicircle
   (width = 2 × height) so the bumps read as round, not flattened ovals. */
const SCALLOP =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='48'%3E%3Cpath d='M0 48 A48 48 0 0 1 96 48 Z' fill='%23ffffff'/%3E%3C/svg%3E\")"

/* Scales the heading's font-size down until it wraps onto exactly `lines` rows,
   so the copy always fills the same number of lines no matter how long it is.
   The heading has a font-independent (rem) width, so the wrap point is stable. */
function useFitLines(lines = 2, maxPx = 84, minPx = 16) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fit = () => {
      let lo = minPx
      let hi = maxPx
      let best = minPx
      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        el.style.fontSize = `${mid}px`
        const lh = parseFloat(getComputedStyle(el).lineHeight) || mid
        const rows = Math.round(el.scrollHeight / lh)
        if (rows <= lines) {
          best = mid
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }
      el.style.fontSize = `${best}px`
    }

    fit()
    // Re-fit when the container width changes (observe the parent, not the
    // heading itself, so setting its font-size doesn't loop the observer).
    const ro = new ResizeObserver(fit)
    if (el.parentElement) ro.observe(el.parentElement)
    return () => ro.disconnect()
  }, [lines, maxPx, minPx])

  return ref
}

export default function StatsSection({
  stats,
  heading,
}: {
  stats?: Stat[]
  heading?: string
}) {
  // Stat cards come entirely from Sanity — no code defaults.
  const STATS = stats ?? []
  const HEADING = heading ?? ''
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  // Fire the count-up + reveal as the grid approaches from below (positive
  // bottom margin extends the root downward), so the numbers animate while the
  // user is just about to reach the section — the same trigger the Philanthropy
  // impact metrics use.
  const gridRef = useRef<HTMLDivElement>(null)
  const started = useInView(gridRef, { once: true, margin: '0px 0px 15% 0px' })

  // Fit the heading into at most two lines, capped at 56px so it reads a touch
  // larger. On desktop it stays one line; on mobile it wraps to two lines at a
  // comfortably large size instead of shrinking to a tiny font.
  const headingRef = useFitLines(2, 56, 22)

  /* Fade-up reveal of the heading */
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return
    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      gsap.from('[data-stat-reveal]', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: root,
          scroller: scroller ?? undefined,
          start: 'top 78%',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  // Nothing to show until stats are added in Sanity.
  if (STATS.length === 0) return null

  return (
    <section ref={sectionRef} className="relative bg-white">
      {/* Scalloped curvy edge at the intersection with the brand section */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 -translate-y-full pointer-events-none"
        style={{
          height: '48px',
          backgroundImage: SCALLOP,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '96px 48px',
          backgroundPosition: 'center bottom',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-14 md:pb-20">
        {/* Single-line editorial heading */}
        <h2
          ref={headingRef}
          data-stat-reveal
          className="font-serif font-normal tracking-tight leading-[1.05] text-[#111111] text-center"
          style={{ fontSize: 'clamp(2.25rem, 6.2vw, 4.5rem)' }}
        >
          {HEADING}
        </h2>

        {/* Static metric grid — three cards per row on desktop, stacking to two
            then one on smaller screens. The numbers count up when the grid is
            about to scroll into view. */}
        <div
          ref={gridRef}
          className="mt-12 md:mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {STATS.map((stat, i) => {
            // Photo card, styled like the reference: the image fills the whole
            // card, content is anchored to the bottom over a gradient that goes
            // clear at the top and deep at the base so the white text stays
            // legible. With no image it falls back to a plain beige card.
            const hasImage = Boolean(stat.image)
            return (
              <motion.div
                key={`${stat.label}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={started || reduce ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.1 }}
                className={`relative flex flex-col justify-end overflow-hidden rounded-[28px] p-8 md:p-9 ${
                  hasImage ? '' : 'bg-[#F6F3EE]'
                }`}
                style={{
                  minHeight: 'clamp(340px, 32vw, 440px)',
                  ...(hasImage ? { backgroundColor: '#141414' } : {}),
                }}
              >
                {hasImage && (
                  <>
                    <Image
                      src={stat.image as string}
                      alt={stat.label ?? ''}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover"
                      {...(stat.lqip
                        ? { placeholder: 'blur' as const, blurDataURL: stat.lqip }
                        : {})}
                    />
                    {/* Frosted base under the number + label. Instead of a live
                        backdrop-filter (which forces the browser to re-sample and
                        repaint every frame — that caused the whole page to flicker),
                        we overlay a *static* blurred copy of the same photo, masked
                        to fade in toward the bottom. It composites once and never
                        repaints on scroll. Text is drawn after it, so it stays sharp. */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 overflow-hidden"
                      style={{
                        WebkitMaskImage:
                          'linear-gradient(180deg, transparent 36%, #000 60%, #000 100%)',
                        maskImage:
                          'linear-gradient(180deg, transparent 36%, #000 60%, #000 100%)',
                      }}
                    >
                      {/* The blurred copy is inset negatively and scaled up so its
                          own soft blur fringe lands well outside the card and gets
                          clipped — the frost then reaches the full left/right edges
                          instead of fading before them. */}
                      <Image
                        src={stat.image as string}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover"
                        style={{ filter: 'blur(18px)', transform: 'scale(1.22)' }}
                      />
                    </div>
                    {/* Darkening wash so the white number + label stay legible */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(15,15,17,0) 46%, rgba(15,15,17,0.42) 74%, rgba(15,15,17,0.66) 100%)',
                      }}
                    />
                  </>
                )}
                <span
                  className={`relative font-serif font-light leading-none ${
                    hasImage ? 'text-white' : 'text-[#111111]'
                  }`}
                  style={{
                    fontSize: 'clamp(3.25rem, 6vw, 5.5rem)',
                    ...(stat.numberColor ? { color: stat.numberColor } : {}),
                  }}
                >
                  <CountUp value={stat.number} reduce={!!reduce} start={started} />
                </span>
                <span
                  className={`relative mt-3 text-sm font-medium tracking-[0.18em] uppercase ${
                    hasImage ? 'text-white' : 'text-[#111111]'
                  }`}
                  style={stat.labelColor ? { color: stat.labelColor } : undefined}
                >
                  {stat.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* Counts a value up from zero once its grid scrolls into view. Animates the
   first run of digits it finds and preserves any surrounding text (e.g. a
   leading "₹", a trailing "+", "Cr" or "%"), formatting with Indian digit
   grouping. Values with no digits (or under reduced motion) render as-is. */
function CountUp({
  value,
  reduce,
  start,
}: {
  value: string
  reduce: boolean
  /** Begins the count when the parent grid comes into view. */
  start: boolean
}) {
  const match = value.match(/[\d,]*\d/)
  const target = match ? parseInt(match[0].replace(/,/g, ''), 10) : NaN
  const [display, setDisplay] = useState(reduce ? target : 0)

  useEffect(() => {
    if (Number.isNaN(target)) return
    if (reduce) {
      setDisplay(target)
      return
    }
    if (!start) return
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [start, target, reduce])

  // No number to animate — show the raw value.
  if (!match || Number.isNaN(target)) return <span>{value}</span>

  const prefix = value.slice(0, match.index)
  const suffix = value.slice((match.index ?? 0) + match[0].length)

  return (
    <span>
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
