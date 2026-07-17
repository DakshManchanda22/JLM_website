'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type HomeFeature = {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel: string
  href: string
  image: string
  lqip?: string
  /** When true the image sits on the right, text on the left. */
  imageRight?: boolean
}

export default function HomeFeatures({
  features,
}: {
  features?: HomeFeature[]
}) {
  // Feature sections come entirely from Sanity (Homepage → Features).
  const FEATURES = features ?? []
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-feature]').forEach((row) => {
        gsap.from(row.querySelectorAll('[data-feature-reveal]'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: row,
            scroller: scroller ?? undefined,
            start: 'top 78%',
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="bg-white">
      {FEATURES.map((f) => (
        <section
          key={f.headline}
          data-feature
          className="px-6 md:px-12 py-16 md:py-24"
        >
          <div
            className={`max-w-7xl mx-auto grid grid-cols-1 gap-10 md:gap-16 items-center ${
              f.imageRight
                ? 'md:grid-cols-[0.85fr_1.15fr]'
                : 'md:grid-cols-[1.15fr_0.85fr]'
            }`}
          >
            {/* Image */}
            <div
              data-feature-reveal
              className={`relative w-full aspect-[4/3] md:aspect-[5/4] rounded-[28px] overflow-hidden ${
                f.imageRight ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <Image
                src={f.image}
                alt={f.headline}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                {...(f.lqip
                  ? { placeholder: 'blur' as const, blurDataURL: f.lqip }
                  : {})}
              />
            </div>

            {/* Text */}
            <div
              className={`flex flex-col items-center text-center md:px-8 ${
                f.imageRight ? 'md:order-1' : 'md:order-2'
              }`}
            >
              <p
                data-feature-reveal
                className="text-[#555555] text-xs tracking-[0.3em] uppercase mb-5"
              >
                {f.eyebrow}
              </p>
              <h2
                data-feature-reveal
                className="font-serif font-light tracking-tight leading-[1.05] text-[#111111] max-w-[18ch]"
                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 3rem)' }}
              >
                {f.headline}
              </h2>
              {f.body && (
                <p
                  data-feature-reveal
                  className="mt-5 text-[#555555] text-sm md:text-base leading-relaxed max-w-md"
                >
                  {f.body}
                </p>
              )}
              <Link
                data-feature-reveal
                href={f.href}
                className="mt-8 inline-flex items-center justify-center border border-[#111111] text-[#111111] text-xs tracking-[0.2em] uppercase px-7 py-3.5 hover:bg-[#111111] hover:text-white transition-colors"
              >
                {f.ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
