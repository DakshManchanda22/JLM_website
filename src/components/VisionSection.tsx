'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_TEXT =
  'To be a sustainably growing, socially responsible organization that provides innovative, high-quality baby care products while becoming the market leader in the baby care industry.'

// Warm beige accent (site palette) used as the marker highlight.
const HIGHLIGHT = '#E8E0D5'

/**
 * "Our Vision" statement. As the section reaches view, a beige marker
 * highlight sweeps left→right behind the text (per line, following the ragged
 * edges) via GSAP. Respects reduced-motion by showing the highlight already
 * drawn.
 */
export default function VisionSection({
  label = 'Our Vision',
  text = DEFAULT_TEXT,
}: {
  label?: string
  text?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = sectionRef.current
    const mark = markRef.current
    if (!root || !mark) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mark.style.backgroundSize = '100% 100%'
      return
    }

    const scroller = document.getElementById('page-scroller')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mark,
        { backgroundSize: '0% 100%' },
        {
          backgroundSize: '100% 100%',
          ease: 'power2.out',
          duration: 0.9,
          scrollTrigger: {
            trigger: root,
            scroller: scroller ?? undefined,
            // Fires as the block is just coming into view.
            start: 'top 72%',
            once: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-white px-4 pt-16 pb-6 md:px-8 md:pt-24 md:pb-8">
      <div className="mx-auto max-w-6xl">
        <span
          className="mb-5 block font-serif text-[#555555] md:mb-7"
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}
        >
          {label}
        </span>
        <p
          className="font-serif font-light leading-[1.25] tracking-tight text-[#111111] [text-wrap:balance]"
          style={{ fontSize: 'clamp(1.6rem, 3.4vw, 3.1rem)' }}
        >
          <span
            ref={markRef}
            style={{
              backgroundImage: `linear-gradient(${HIGHLIGHT}, ${HIGHLIGHT})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 0',
              backgroundSize: '0% 100%',
              WebkitBoxDecorationBreak: 'clone',
              boxDecorationBreak: 'clone',
              padding: '0.04em 0.1em',
              margin: '0 -0.1em',
              borderRadius: 3,
            }}
          >
            {text}
          </span>
        </p>
      </div>
    </section>
  )
}
