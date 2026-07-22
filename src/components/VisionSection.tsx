'use client'

import { useEffect, useRef } from 'react'
import {
  KineticTextReveal,
  type KineticTextRevealRef,
} from '@/components/ui/kinetic-text-reveal'

/**
 * "Our Vision" statement. As the section scrolls into view, the words rise into
 * place with a soft blur and staggered timing (kinetic text reveal). Respects
 * reduced-motion via the reveal component's own handling. Content comes from
 * Sanity (Homepage → Vision).
 */
export default function VisionSection({
  label = '',
  text = '',
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

  if (!text) return null

  return (
    <section ref={sectionRef} className="w-full bg-white px-4 pt-16 pb-6 md:px-8 md:pt-24 md:pb-8">
      <div className="mx-auto max-w-6xl text-center">
        {label && (
          <span
            className="mb-6 block font-serif font-light leading-[1.05] tracking-tight text-[#111111] md:mb-8"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4.25rem)' }}
          >
            {label}
          </span>
        )}
        <p
          className="mx-auto max-w-4xl font-serif font-light leading-[1.3] tracking-tight text-[#111111]"
          style={{ fontSize: 'clamp(1.15rem, 2.4vw, 2rem)' }}
        >
          <KineticTextReveal
            ref={revealRef}
            text={text}
            className="w-full justify-center"
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
