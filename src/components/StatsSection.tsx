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

/* White scallop bumps that sit on top of the dark brand section above,
   creating the soft curvy intersection. Each tile is a true semicircle
   (width = 2 × height) so the bumps read as round, not flattened ovals. */
const SCALLOP =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='48'%3E%3Cpath d='M0 48 A48 48 0 0 1 96 48 Z' fill='%23ffffff'/%3E%3C/svg%3E\")"

/* Split "100+" → { prefix: "", value: 100, suffix: "+", decimals: 0 } so we can
   count up the numeric part while keeping any prefix/suffix intact. Returns null
   when there's no number to animate (e.g. a non-numeric label). */
function parseNumber(raw: string) {
  const m = String(raw).match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const decimals = m[2].includes('.') ? m[2].split('.')[1].length : 0
  return { prefix: m[1], value: parseFloat(m[2]), suffix: m[3], decimals }
}

export default function StatsSection({ stats }: { stats?: Stat[] }) {
  const STATS = stats && stats.length > 0 ? stats : DEFAULT_STATS
  const sectionRef = useRef<HTMLElement>(null)

  /* Fade-up reveal of the heading + cards, and count-up of the numbers */
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

      /* Count each number up from 0 when it scrolls into view */
      gsap.utils.toArray<HTMLElement>('[data-stat-number]').forEach((el) => {
        const value = parseFloat(el.dataset.value || '0')
        const prefix = el.dataset.prefix || ''
        const suffix = el.dataset.suffix || ''
        const decimals = parseInt(el.dataset.decimals || '0', 10)
        const counter = { v: 0 }
        const render = () =>
          (el.textContent = prefix + counter.v.toFixed(decimals) + suffix)
        render() // start at 0 before the tween fires

        gsap.to(counter, {
          v: value,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: render,
          scrollTrigger: {
            trigger: el,
            scroller: scroller ?? undefined,
            start: 'top 88%',
            once: true,
          },
        })
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-24 md:pb-32">
        {/* Header row — big editorial heading left, small note right */}
        <div className="mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
          <h2
            data-stat-reveal
            className="font-serif font-light tracking-tight leading-[0.95] text-[#111111] max-w-[16ch]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}
          >
            A century of everyday goodness
          </h2>
          <p
            data-stat-reveal
            className="text-[#555555] text-xs tracking-[0.3em] uppercase mb-2"
          >
            Since 1920
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {STATS.map((stat) => {
            const parsed = parseNumber(stat.number)
            return (
            <div
              key={`${stat.number}-${stat.label}`}
              data-stat-reveal
              className="rounded-[28px] bg-[#F6F3EE] p-8 md:p-10 flex flex-col"
            >
              <span
                className="font-serif font-light leading-none text-[#111111]"
                style={{ fontSize: 'clamp(3.25rem, 6vw, 5.5rem)' }}
                {...(parsed
                  ? {
                      'data-stat-number': true,
                      'data-value': parsed.value,
                      'data-prefix': parsed.prefix,
                      'data-suffix': parsed.suffix,
                      'data-decimals': parsed.decimals,
                    }
                  : {})}
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
