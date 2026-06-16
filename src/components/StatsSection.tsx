'use client'

import { useEffect, useRef } from 'react'
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
    number: '3',
    label: 'Brands',
    body: 'Morisons Baby Dreams, Emoform, and Bigen — each beloved in its category, each shaped by the same uncompromising values.',
  },
  {
    number: '1',
    label: 'Promise',
    body: 'To make products that earn a permanent place on every Indian shelf — gently, honestly, generation after generation.',
  },
]

const INITIAL_BG = '#FFFFFF'
const INITIAL_TEXT = '#555555'
const FINAL_BG = '#F9A8BB'
const FINAL_TEXT = '#FFFFFF'
const INITIAL_BORDER = 'rgba(85, 85, 85, 0.2)'
const FINAL_BORDER = 'rgba(255, 255, 255, 0.35)'

export default function StatsSection({ stats }: { stats?: Stat[] }) {
  const STATS = stats && stats.length > 0 ? stats : DEFAULT_STATS
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          scroller: scroller ?? undefined,
          start: 'top 75%',
          end: 'top 15%',
          scrub: 1,
        },
      })

      tl.to(root, { backgroundColor: FINAL_BG, ease: 'none' }, 0)
        .to('[data-stat-text]', { color: FINAL_TEXT, ease: 'none' }, 0)
        .to(
          '[data-stat-body]',
          { color: 'rgba(255, 255, 255, 0.88)', ease: 'none' },
          0
        )
        .to(
          '[data-divider]',
          { borderColor: FINAL_BORDER, ease: 'none' },
          0
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: INITIAL_BG }}
      className="px-6 md:px-12 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto">
        {STATS.map((stat, i) => (
          <div
            key={`${stat.number}-${stat.label}`}
            data-divider={i !== 0 ? true : undefined}
            style={
              i !== 0
                ? { borderTopColor: INITIAL_BORDER, borderTopWidth: '1px' }
                : undefined
            }
            className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 md:gap-12 py-12 md:py-20 items-end"
          >
            <h3
              data-stat-text
              style={{ color: INITIAL_TEXT }}
              className="font-serif font-light leading-[0.92] tracking-tight"
            >
              <span style={{ fontSize: 'clamp(3rem, 11vw, 10.5rem)' }}>
                {stat.number}{' '}
              </span>
              <span style={{ fontSize: 'clamp(3rem, 11vw, 10.5rem)' }}>
                {stat.label}
              </span>
            </h3>
            <p
              data-stat-body
              style={{ color: INITIAL_TEXT }}
              className="text-sm leading-relaxed md:max-w-xs"
            >
              {stat.body}
            </p>
          </div>
        ))}

      </div>
    </section>
  )
}
