'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.16, 1, 0.3, 1] as const

export type FeatureImage = { url: string; lqip?: string }

export type HomeFeature = {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel: string
  href: string
  /** Slideshow images — cross-fade when more than one. */
  images: FeatureImage[]
  /** Seconds each image is shown before fading to the next. */
  intervalMs?: number
  /** When true the image sits on the right, text on the left. */
  imageRight?: boolean
}

/* A stacked deck of a feature's images. Cards sit on top of one another with a
   slight offset; every `intervalMs` the card at the BACK animates up to the
   FRONT, swapping the visible image. Every card stays mounted (only its
   transform/opacity changes) so the section never blanks out. Honours
   reduced-motion with a plain swap. With a single image it's just that image. */
function FeatureImages({
  images,
  alt,
  intervalMs = 3000,
}: {
  images: FeatureImage[]
  alt: string
  intervalMs?: number
}) {
  const reduce = useReducedMotion()
  const n = images.length
  const [front, setFront] = useState(0)
  const deckRef = useRef<HTMLDivElement>(null)
  // Only shuffle while this section is actually on screen — the timer is paused
  // before the user reaches it and the moment they scroll past.
  const inView = useInView(deckRef, { amount: 0.5 })

  useEffect(() => {
    if (n <= 1 || !inView) return
    // Bring the back card to the front each tick.
    const id = window.setTimeout(() => setFront((f) => (f - 1 + n) % n), intervalMs)
    return () => window.clearTimeout(id)
  }, [front, n, intervalMs, inView])

  return (
    <div ref={deckRef} className="absolute inset-0">
      {images.map((im, i) => {
        const order = (i - front + n) % n // 0 = front of the deck
        const depth = Math.min(order, 3)
        const hidden = order > 3
        return (
          <motion.div
            key={`${im.url}-${i}`}
            className="absolute inset-0"
            initial={false}
            animate={
              reduce
                ? { opacity: order === 0 ? 1 : 0 }
                : {
                    x: depth * 9,
                    y: depth * 11,
                    scale: 1 - depth * 0.04,
                    rotate: order === 0 ? 0 : depth % 2 ? -2 : 2,
                    opacity: hidden ? 0 : 1,
                  }
            }
            transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
            style={{ zIndex: n - order }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[28px] shadow-[0_22px_44px_-26px_rgba(17,17,17,0.55)]">
              <Image
                src={im.url}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={order === 0}
                {...(im.lqip ? { placeholder: 'blur' as const, blurDataURL: im.lqip } : {})}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
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
            {/* Image card deck */}
            <div
              data-feature-reveal
              className={`relative w-full aspect-[3/2] md:aspect-[3/2] md:w-[86%] md:mx-auto ${
                f.imageRight ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <FeatureImages
                images={f.images}
                alt={f.headline}
                intervalMs={f.intervalMs}
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
