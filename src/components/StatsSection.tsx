'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type Stat = {
  number: string
  label: string
  /** Short supporting line under the label. */
  body?: string
  /** Inlined icon SVG markup (colours stripped so it inherits currentColor). */
  iconSvg?: string
  /** Card background colour. Defaults to the warm beige. */
  cardColor?: string
  /** Whether to show the coloured box behind the icon (default true). */
  showIconBox?: boolean
  /** Icon box background colour. */
  iconBgColor?: string
  /** Icon glyph colour. */
  iconColor?: string
  /** Icon glyph size in px (default 28). */
  iconSize?: number
}

const CARD_FALLBACK = '#F6F3EE'
const ICON_BG_FALLBACK = '#E8E0D5'
const ICON_FALLBACK = '#111111'
const ICON_SIZE_FALLBACK = 34

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

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-10 md:pb-14">
        {/* Single-line editorial heading */}
        <h2
          ref={headingRef}
          data-stat-reveal
          className="font-serif font-normal tracking-tight leading-[1.05] text-[#111111] text-center"
          style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3rem)' }}
        >
          {HEADING}
        </h2>

        {/* Static metric grid — three cards per row on desktop, stacking to two
            then one on smaller screens. The numbers count up when the grid is
            about to scroll into view. */}
        <div
          ref={gridRef}
          className="mt-8 md:mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 mx-auto w-[95%]"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={started || reduce ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.1 }}
              className="flex flex-col rounded-[22px] p-5 md:p-6"
              style={{ backgroundColor: stat.cardColor || CARD_FALLBACK }}
            >
              {stat.iconSvg &&
                (() => {
                  const size = stat.iconSize || ICON_SIZE_FALLBACK
                  // The icon SVG is inlined with its fills stripped, so it
                  // inherits `currentColor` from the wrapper's text colour.
                  const glyph = (
                    <span
                      aria-hidden
                      className="block [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
                      style={{
                        width: size,
                        height: size,
                        color: stat.iconColor || ICON_FALLBACK,
                      }}
                      dangerouslySetInnerHTML={{ __html: stat.iconSvg }}
                    />
                  )
                  // No box: show the icon on its own.
                  if (stat.showIconBox === false) {
                    return <div className="mb-4">{glyph}</div>
                  }
                  // Boxed: coloured tile that grows with the icon size.
                  return (
                    <div
                      className="mb-4 inline-flex w-max items-center justify-center rounded-xl p-2.5"
                      style={{ backgroundColor: stat.iconBgColor || ICON_BG_FALLBACK }}
                    >
                      {glyph}
                    </div>
                  )
                })()}
              <span
                className="font-serif font-light leading-none text-[#111111]"
                style={{ fontSize: 'clamp(2.25rem, 3.6vw, 3.25rem)' }}
              >
                <CountUp value={stat.number} reduce={!!reduce} start={started} />
              </span>
              <span className="mt-3 text-[#111111] text-[13px] font-medium tracking-[0.16em] uppercase">
                {stat.label}
              </span>
              {stat.body && (
                <p className="mt-2 text-[#555555] text-[13px] leading-snug">
                  {stat.body}
                </p>
              )}
            </motion.div>
          ))}
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
