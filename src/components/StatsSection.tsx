'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type Stat = {
  number: string
  label: string
  body: string
}

const DEFAULT_STATS: Stat[] = [
  {
    number: '100+',
    label: 'Years',
    body: 'From 1920 to today, J.L. Morison has stood for trust, honesty, and the small everyday goodness that holds a family together.',
  },
  {
    number: '4',
    label: 'Brands',
    body: 'Each beloved in its category, each shaped by the same uncompromising values that have defined Morison since 1920.',
  },
  {
    number: '1',
    label: 'Promise',
    body: 'To make products that earn a permanent place on every Indian shelf — gently, honestly, generation after generation.',
  },
  {
    number: '—',
    label: 'Turnover',
    body: 'Steady, responsible growth built on brands Indian families reach for year after year.',
  },
  {
    number: '—',
    label: 'Distributors',
    body: 'A trusted distribution network that carries our brands into homes across the country.',
  },
  {
    number: '400+',
    label: 'Employee Strength',
    body: 'The people behind the promise — a growing team building goodness every single day.',
  },
]

/* White scallop bumps that sit on top of the dark brand section above,
   creating the soft curvy intersection. Each tile is a true semicircle
   (width = 2 × height) so the bumps read as round, not flattened ovals. */
const SCALLOP =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='48'%3E%3Cpath d='M0 48 A48 48 0 0 1 96 48 Z' fill='%23ffffff'/%3E%3C/svg%3E\")"

const DEFAULT_HEADING = 'Building Goodness Everyday for over a Century'
const DEFAULT_NOTE = 'Since 1920'

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
  note,
}: {
  stats?: Stat[]
  heading?: string
  note?: string
}) {
  const STATS = stats && stats.length > 0 ? stats : DEFAULT_STATS
  const HEADING = heading && heading.length > 0 ? heading : DEFAULT_HEADING
  const NOTE = note && note.length > 0 ? note : DEFAULT_NOTE
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useFitLines(2)

  /* Fade-up reveal of the header row (heading + note) */
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-10 md:pb-14">
        {/* Header row — big editorial heading left, small note right */}
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2
            ref={headingRef}
            data-stat-reveal
            className="font-serif font-normal tracking-tight leading-[0.95] text-[#111111] max-w-[22rem] md:max-w-[38rem] [text-wrap:balance]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.25rem)' }}
          >
            {HEADING}
          </h2>
          <p
            data-stat-reveal
            className="text-[#555555] text-xs tracking-[0.3em] uppercase mb-2"
          >
            {NOTE}
          </p>
        </div>

      </div>

      {/* Moving metric carousel — cards scroll continuously left. The list is
          duplicated so a −50% shift loops seamlessly. Edges fade out via a mask
          so cards enter/exit softly. */}
      <div
        className="relative overflow-hidden pb-24 md:pb-32"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          maskImage:
            'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <motion.div
          className="flex w-max gap-5 px-6 md:gap-6 md:px-12"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
          style={{ willChange: 'transform' }}
        >
          {[...STATS, ...STATS].map((stat, i) => (
            <div
              key={`${stat.label}-${i}`}
              className="flex w-[270px] shrink-0 flex-col rounded-[28px] bg-[#F6F3EE] p-8 md:w-[340px] md:p-10"
            >
              <span
                className="font-serif font-light leading-none text-[#111111]"
                style={{ fontSize: 'clamp(3.25rem, 6vw, 5.5rem)' }}
              >
                {stat.number}
              </span>
              <span className="mt-4 text-[#111111] text-sm font-medium tracking-[0.18em] uppercase">
                {stat.label}
              </span>
              <p className="mt-4 text-[#555555] text-sm leading-relaxed">
                {stat.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
