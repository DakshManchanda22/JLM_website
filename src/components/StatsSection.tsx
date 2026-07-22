'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type Stat = {
  number: string
  label: string
  body: string
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
          {STATS.map((stat, i) => (
            <motion.div
              key={`${stat.label}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={started || reduce ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.1 }}
              className="flex flex-col rounded-[28px] bg-[#F6F3EE] p-8 md:p-10"
            >
              <span
                className="font-serif font-light leading-none text-[#111111]"
                style={{ fontSize: 'clamp(3.25rem, 6vw, 5.5rem)' }}
              >
                <CountUp value={stat.number} reduce={!!reduce} start={started} />
              </span>
              <span className="mt-4 text-[#111111] text-sm font-medium tracking-[0.18em] uppercase">
                {stat.label}
              </span>
              <p className="mt-4 text-[#555555] text-sm leading-relaxed">
                {stat.body}
              </p>
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
