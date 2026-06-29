'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export type Slide = {
  image: string
  lqip?: string
  brand: string
  tagline: string
}

export type HeroVideo = {
  videoUrl: string
  poster?: string
  brand?: string
  tagline?: string
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

export default function HeroSlideshow({
  slides,
  video,
  intervalMs = SLIDE_DURATION,
}: {
  slides?: Slide[]
  video?: HeroVideo
  intervalMs?: number
}) {
  /* A video set in Sanity replaces the image slideshow entirely. Each branch
     is its own component so hooks are never called conditionally. */
  if (video?.videoUrl) {
    return <HeroVideoPlayer video={video} />
  }
  return <ImageSlideshow slides={slides} intervalMs={intervalMs} />
}

function ImageSlideshow({
  slides,
  intervalMs,
}: {
  slides?: Slide[]
  intervalMs: number
}) {
  const SLIDES = slides && slides.length > 0 ? slides : DEFAULT_SLIDES

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      intervalMs
    )
    return () => window.clearTimeout(id)
  }, [index, paused, SLIDES.length, intervalMs])

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
            {...(slide.lqip
              ? { placeholder: 'blur' as const, blurDataURL: slide.lqip }
              : {})}
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

/* ───────────────────────── Hero video ───────────────────────── */

function HeroVideoPlayer({ video }: { video: HeroVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = () => {
    const el = videoRef.current
    if (!el) return
    const next = !muted
    el.muted = next
    if (!next) {
      // Ensure it's actually playing with sound after the user opts in
      el.play().catch(() => {})
    }
    setMuted(next)
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-[#111111]"
      style={{ height: '100vh' }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={video.videoUrl}
        poster={video.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Bottom-weighted dark gradient for headline legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

      {/* Mute / unmute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-7 right-5 md:right-8 z-20 flex items-center gap-2 rounded-full border border-white/30 bg-black/30 backdrop-blur px-4 py-2 text-white/90 text-xs tracking-[0.2em] uppercase hover:bg-black/50 hover:text-white transition-colors"
      >
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        )}
        <span>{muted ? 'Sound off' : 'Sound on'}</span>
      </button>

      {/* Headline overlay — bottom-left, huge (only if text is set) */}
      {(video.brand || video.tagline) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
          className="absolute bottom-16 left-6 md:left-12 right-6 md:right-32 z-10"
        >
          {video.tagline && (
            <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-3 md:mb-5">
              {video.tagline}
            </p>
          )}
          {video.brand && (
            <h1
              className="text-white font-black uppercase leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(2.75rem, 8.5vw, 9rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {video.brand}
            </h1>
          )}
        </motion.div>
      )}
    </section>
  )
}
