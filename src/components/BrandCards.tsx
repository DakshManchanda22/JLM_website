'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export type Brand = {
  name: string
  shortName: string
  tagline: string
  href: string
  image: string
  lqip?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

function BrandCard({
  brand,
  index,
  isActive,
  dimmed,
  viewportMode,
  setRef,
  onEnter,
  onLeave,
}: {
  brand: Brand
  index: number
  isActive: boolean
  /** Another card is active, so this one has shrunk — its label must shrink too. */
  dimmed: boolean
  /** Touch devices have no hover — the card is activated when scrolled to centre. */
  viewportMode: boolean
  setRef: (el: HTMLDivElement | null) => void
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <motion.div
      ref={setRef}
      data-index={index}
      style={{ flex: '1 1 0', minWidth: 0 }}
      animate={{ flexGrow: isActive ? 2.5 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <Link
        href={brand.href}
        onMouseEnter={viewportMode ? undefined : onEnter}
        onMouseLeave={viewportMode ? undefined : onLeave}
        className="relative block h-[60vh] md:h-[72vh] overflow-hidden rounded-2xl cursor-pointer group"
      >
        {/* Image */}
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          {...(brand.lqip
            ? { placeholder: 'blur' as const, blurDataURL: brand.lqip }
            : {})}
        />

        {/* Dark wash — touch devices only. On desktop (a real cursor) the image
            stays clear: no fade. */}
        {viewportMode && (
          <motion.div
            className="absolute inset-0 bg-black"
            animate={{ opacity: isActive ? 0.22 : 0.55 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        )}

        {/* Localised bottom scrim so the brand name stays legible over any image
            without darkening the whole photo. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />

        {/* Brand name — always shown on desktop; on touch it hides on the active
            (lit-up) card so the tagline can take its place. */}
        {(!viewportMode || !isActive) && (
          <div className="absolute inset-x-6 bottom-6 pointer-events-none">
            <motion.p
              className="text-white/90 font-black uppercase leading-[0.95] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 3rem)', transformOrigin: 'left bottom' }}
              animate={{ scale: dimmed ? 0.72 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {brand.name}
            </motion.p>
          </div>
        )}

        {/* Active footer tagline — touch only. */}
        <AnimatePresence>
          {isActive && viewportMode && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-x-6 bottom-6 z-10 pointer-events-none"
            >
              <p className="text-white/85 text-[11px] md:text-xs tracking-[0.25em] uppercase max-w-[70%]">
                {brand.tagline}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  )
}

export default function BrandCards({
  brands,
  heading,
}: {
  brands?: Brand[]
  /** May be null (GROQ returns null for an unset Sanity field). */
  heading?: string | null
}) {
  const BRANDS = brands ?? []
  // Fall back to the default when Sanity hasn't set a heading (null / empty).
  const HEADING = heading?.trim() ? heading : 'Trusted in every Indian home.'
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [viewportMode, setViewportMode] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  /* Touch devices have no hover. Detect them and switch to viewport mode, where
     the card centred on screen is the active ("lit up") one. */
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    const apply = () => setViewportMode(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  /* In viewport mode, light up whichever card crosses the centre of the screen. */
  useEffect(() => {
    if (!viewportMode) {
      setActiveIndex(null)
      return
    }
    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      // Fire when a card's centre band crosses the viewport centre.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [viewportMode, BRANDS.length])

  return (
    <section className="bg-[#111111] pt-8 pb-20 md:pt-10 md:pb-28 px-6 md:px-10">
      <div className="mb-12 md:mb-16 flex justify-center text-center">
        <h2
          className="text-white font-serif font-light tracking-tight leading-[1.05]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 4.25rem)' }}
        >
          {HEADING}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {BRANDS.map((brand, i) => (
          <BrandCard
            key={brand.name}
            brand={brand}
            index={i}
            isActive={activeIndex === i}
            dimmed={activeIndex !== null && activeIndex !== i}
            viewportMode={viewportMode}
            setRef={(el) => {
              cardRefs.current[i] = el
            }}
            onEnter={() => setActiveIndex(i)}
            onLeave={() => setActiveIndex(null)}
          />
        ))}
      </div>
    </section>
  )
}
