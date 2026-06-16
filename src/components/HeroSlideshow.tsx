'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export type Slide = {
  image: string
  brand: string
  tagline: string
}

const DEFAULT_SLIDES: Slide[] = [
  {
    image:
      'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=2000&q=80',
    brand: 'Morisons Baby Dreams',
    tagline: 'Care your baby deserves.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=2000&q=80',
    brand: 'Emoform',
    tagline: 'Dental health, perfected.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=2000&q=80',
    brand: 'Bigen',
    tagline: 'Colour with confidence.',
  },
]

const SLIDE_DURATION = 5500 // ms
const EASE = [0.16, 1, 0.3, 1] as const

export default function HeroSlideshow({ slides }: { slides?: Slide[] }) {
  const SLIDES = slides && slides.length > 0 ? slides : DEFAULT_SLIDES

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_DURATION
    )
    return () => window.clearTimeout(id)
  }, [index, paused, SLIDES.length])

  const advance = () => setIndex((i) => (i + 1) % SLIDES.length)
  const goTo = (i: number) => setIndex(i)

  const slide = SLIDES[index]

  return (
    <section
      className="relative w-full overflow-hidden bg-[#111111]"
      style={{ height: '85vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Crossfading slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.brand}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Bottom-weighted dark gradient for headline legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Headline overlay — bottom-left, huge */}
      <div className="absolute bottom-16 left-6 md:left-12 right-6 md:right-32 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`headline-${index}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-3 md:mb-5">
              {slide.tagline}
            </p>
            <h1
              className="text-white font-black uppercase leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(2.75rem, 8.5vw, 9rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {slide.brand}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right-side advance arrow */}
      <button
        onClick={advance}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 transition-colors"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Bottom-centre dot indicators */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: i === index ? '28px' : '8px',
              backgroundColor:
                i === index ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
