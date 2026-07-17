'use client'

import { useEffect, useRef } from 'react'
import {
  KineticTextReveal,
  type KineticTextRevealRef,
} from '@/components/ui/kinetic-text-reveal'

export default function QuoteSection({
  lines,
  attribution,
}: {
  lines?: string[]
  attribution?: string
}) {
  // All content comes from Sanity (Homepage → Quote); no hardcoded fallback.
  const LINES = lines ?? []
  // No default — if marketing clears the attribution in Sanity, it disappears
  // (and its spacing goes with it) instead of falling back to hardcoded text.
  const ATTRIBUTION = attribution?.trim()

  const sectionRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(KineticTextRevealRef | null)[]>([])

  // Trigger the kinetic reveal once the quote scrolls into view, cascading
  // line by line so the words rise like an editorial pull-quote.
  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const timeouts: number[] = []
    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          lineRefs.current.forEach((line, i) => {
            timeouts.push(window.setTimeout(() => line?.play(), i * 200))
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    io.observe(root)
    return () => {
      io.disconnect()
      timeouts.forEach((t) => window.clearTimeout(t))
    }
  }, [LINES.length])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FFFFFF] py-16 md:py-24 px-6 md:px-12"
    >
      <blockquote className="max-w-5xl mx-auto">
        <p
          className="font-serif text-[#111111] leading-[1.3] tracking-tight [text-wrap:balance]"
          style={{ fontSize: 'clamp(1.5rem, 3.2vw, 3rem)' }}
        >
          {LINES.map((line, li) => (
            <span key={li} className="block">
              <KineticTextReveal
                ref={(el) => {
                  lineRefs.current[li] = el
                }}
                text={line}
                autoPlay={false}
                splitBy="words"
                direction="up"
                distance={22}
                stagger={0.055}
                blur
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          ))}
        </p>

        {ATTRIBUTION && (
          <footer className="mt-10 md:mt-14">
            <span className="block text-[#555555] text-xs tracking-[0.3em] uppercase">
              {ATTRIBUTION}
            </span>
          </footer>
        )}
      </blockquote>
    </section>
  )
}
