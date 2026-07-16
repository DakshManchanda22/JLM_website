'use client'

import { useEffect, useRef } from 'react'
import {
  KineticTextReveal,
  type KineticTextRevealRef,
} from '@/components/ui/kinetic-text-reveal'

const DEFAULT_TEXT =
  'To be a sustainably growing, socially responsible organization that provides innovative, high-quality baby care products while becoming the market leader in the baby care industry.'

/**
 * "Our Vision" statement. As the section scrolls into view, the words rise into
 * place with a soft blur and staggered timing (kinetic text reveal). Respects
 * reduced-motion via the reveal component's own handling.
 */
export default function VisionSection({
  label = 'Our Vision',
  text = DEFAULT_TEXT,
}: {
  label?: string
  text?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const revealRef = useRef<KineticTextRevealRef>(null)

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          revealRef.current?.play()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    io.observe(root)
    return () => io.disconnect()
  }, [text])

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
          className="font-serif font-light leading-[1.25] tracking-tight text-[#111111]"
          style={{ fontSize: 'clamp(1.6rem, 3.4vw, 3.1rem)' }}
        >
          <KineticTextReveal
            ref={revealRef}
            text={text}
            autoPlay={false}
            splitBy="words"
            direction="up"
            distance={26}
            stagger={0.045}
            blur
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        </p>
      </div>
    </section>
  )
}
