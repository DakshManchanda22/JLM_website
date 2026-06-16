'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_LINES: string[] = [
  'For over a century, we have been',
  'building goodness for every',
  'Indian family — one trusted brand,',
  'one product, one promise at a time.',
]

const DEFAULT_ATTRIBUTION = 'J.L. Morison · Since 1920'

export default function QuoteSection({
  lines,
  attribution,
}: {
  lines?: string[]
  attribution?: string
}) {
  const LINES = lines && lines.length > 0 ? lines : DEFAULT_LINES
  const ATTRIBUTION = attribution && attribution.length > 0 ? attribution : DEFAULT_ATTRIBUTION

  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('[data-word]')

      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: 'none',
          duration: 0.3,
          stagger: 0.06,
          scrollTrigger: {
            trigger: root,
            scroller: scroller ?? undefined,
            start: 'top 65%',
            end: 'bottom 80%',
            scrub: 1,
          },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FFFFFF] py-16 md:py-24 px-6 md:px-12"
    >
      <blockquote className="max-w-5xl mx-auto">
        <p
          className="font-serif text-[#111111] leading-[1.25] tracking-tight"
          style={{ fontSize: 'clamp(1.75rem, 4.2vw, 4rem)' }}
        >
          {LINES.map((line, li) => (
            <span
              key={li}
              className="block"
            >
              {line.split(' ').map((word, wi) => (
                <span
                  key={`${li}-${wi}`}
                  data-word
                  className="inline-block mr-[0.25em]"
                  style={{ opacity: 0.12 }}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </p>

        <footer className="mt-10 md:mt-14">
          <span className="block text-[#555555] text-xs tracking-[0.3em] uppercase">
            {ATTRIBUTION}
          </span>
        </footer>
      </blockquote>
    </section>
  )
}
