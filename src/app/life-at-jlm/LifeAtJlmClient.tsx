'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'

/* ─────────────── CMS overrides via Context ───────────────
   Every text + image on this page can be overridden from
   Sanity. Each block reads the Context and falls back to
   its existing hardcoded default when a field is missing. */

export type LifeCms = {
  /** Master on/off for the opening curtain animation (overlapping photos + wipe). */
  showIntro?: boolean
  introImages?: { url: string; lqip?: string }[]
  introFinalImage?: string
  introFinalImageLqip?: string
  heroImage?: string
  heroImageLqip?: string
  heroLine1?: string
  heroLine2?: string
  heroCaptionSmall?: string
  heroCaptionLarge?: string
  anchors?: { num: string; label: string; targetId: string; image: string }[]
  captionStrip?: { src: string; caption?: string; aspect?: number; lqip?: string }[]
  introStatement?: string
  arentHeadline?: string
  arentBody?: string
  testimonials?: { quote: string; name: string; role: string }[]
  carouselSpeed?: number
}

const LifeCtx = createContext<LifeCms>({})
const useLife = () => useContext(LifeCtx)

/* Most headings use the same system serif (Tailwind `font-serif`) as the
   homepage "A century of everyday goodness" heading. A few elements keep the
   original Cormorant Garamond (value titles, the intro statement). */
const serifClass = 'font-serif'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

/* Neutral grayscale tint — replaces the off-brand beige for placeholders,
   hairline borders and dividers. Cards use only pure black/white. */
const FAINT = '#EEEEEE'
const INK = '#111111'
const MUTED = '#555555'
/* Brand accent (CLAUDE.md) — used only as the animated highlight marker. */
const BEIGE_ACCENT = '#E8E0D5'
const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────────────────── reusable bits ─────────────────────── */

/* Infinite, auto-scrolling marquee. Renders two identical groups and slides the
   track by exactly one group width, so the loop is seamless. Pauses on hover
   and respects prefers-reduced-motion (see globals.css). */
function Marquee<T>({
  items,
  renderItem,
  direction = 'left',
  duration = 45,
  gap = 18,
  className = '',
  pauseOnHover = true,
}: {
  items: T[]
  renderItem: (item: T, i: number) => ReactNode
  direction?: 'left' | 'right'
  duration?: number
  gap?: number
  className?: string
  /** When false the track keeps scrolling even while hovered/tapped. */
  pauseOnHover?: boolean
}) {
  const name = direction === 'left' ? 'marquee-left' : 'marquee-right'
  const Group = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0" aria-hidden={hidden}>
      {items.map((it, i) => (
        <div key={i} className="shrink-0" style={{ marginRight: gap }}>
          {renderItem(it, i)}
        </div>
      ))}
    </div>
  )
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex w-max ${pauseOnHover ? '' : 'marquee-no-pause'}`}
        style={{ animationName: name, animationDuration: `${duration}s` }}
      >
        <Group />
        <Group hidden />
      </div>
    </div>
  )
}

/* ───────────────── INTRO CURTAIN (6-photo reveal) ───────────────── */

/* Six layered, slightly-offset team/heritage photos that fade in one
   by one (~200ms, 950ms, 1750ms, 2330ms, 2850ms, 3200ms), the whole
   stack slowly zooms scale 1→1.15 over ~4s, a final cover photo fades
   over the top around 3.5s, then the whole curtain pulls up off-screen
   at 4.5s to reveal the hero behind it. */

/* Layout (offset + scale) of each intro photo. The image URL itself can be
   overridden via CMS, but the offset/scale is part of the design. */
const INTRO_LAYOUT = [
  { left: '-1vw', top: '0vw', scale: 0.73 },
  { left: '4vw', top: '3vw', scale: 0.76 },
  { left: '-1vw', top: '0vw', scale: 0.76 },
  { left: '-4vw', top: '-0.5vw', scale: 0.74 },
  { left: '8vw', top: '-2vw', scale: 0.74 },
  { left: '-1vw', top: '3.9vw', scale: 0.74 },
]
const CURTAIN_DURATION_MS = 1500

/* Choreography derived from however many collage photos are supplied, so the
   intro adapts to the real count — never pausing on a missing frame and never
   repeating an image to fill a fixed slot. Each photo pops in ~900ms apart. */
function introTiming(count: number) {
  const START = 200
  const STEP = 900
  const n = Math.max(1, count)
  const delays = Array.from({ length: n }, (_, i) => START + i * STEP)
  const finalFadeMs = START + n * STEP + 300
  const liftMs = finalFadeMs + 1200
  return { delays, finalFadeMs, liftMs }
}

function IntroCurtain({ onDone }: { onDone: () => void }) {
  const cms = useLife()
  /* Render exactly the photos provided — no padding, so no image repeats. */
  const SRCS = (cms.introImages ?? []).filter((i) => i.url)
  const FINAL_SRC = cms.introFinalImage ?? ''
  const FINAL_LQIP = cms.introFinalImageLqip
  const {
    delays: INTRO_DELAYS_MS,
    finalFadeMs: FINAL_FADE_IN_MS,
    liftMs: CURTAIN_LIFT_MS,
  } = introTiming(SRCS.length)

  const [lifted, setLifted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    INTRO_DELAYS_MS.forEach((d, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), d))
    })
    timers.push(setTimeout(() => setLifted(true), CURTAIN_LIFT_MS))
    timers.push(setTimeout(onDone, CURTAIN_LIFT_MS + CURTAIN_DURATION_MS + 50))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: lifted ? '-100vh' : 0 }}
      transition={{ duration: CURTAIN_DURATION_MS / 1000, ease: [0.77, 0, 0.175, 1] }}
      className="fixed overflow-hidden"
      style={{
        top: 'var(--nav-h)',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 40,
        backgroundColor: '#FFFFFF',
        pointerEvents: 'none',
      }}
    >
      {/* zooming wrap for the stack of photos — keeps scaling for the whole intro */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{ duration: (CURTAIN_LIFT_MS - 200) / 1000, ease: 'linear', delay: 0.2 }}
        className="absolute inset-0"
      >
        {SRCS.map((src, i) => {
          const img = INTRO_LAYOUT[i % INTRO_LAYOUT.length]
          return (
          <div
            key={i}
            className="absolute"
            style={{
              left: img.left,
              top: img.top,
              width: '100%',
              height: '100vh',
              transform: `scale(${img.scale})`,
              transformOrigin: '50% 50%',
              visibility: i < visibleCount ? 'visible' : 'hidden',
            }}
          >
            <Image
              src={src.url}
              alt=""
              fill
              priority={i < 3}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              {...(src.lqip ? { placeholder: 'blur' as const, blurDataURL: src.lqip } : {})}
            />
          </div>
          )
        })}
      </motion.div>

      {/* final establishing cover, slides in scaling 0.8 → 1 and fading in,
          then keeps scaling slightly until the curtain lifts */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.05 }}
        transition={{
          opacity: { duration: 0.6, ease: 'easeOut', delay: FINAL_FADE_IN_MS / 1000 },
          scale: {
            duration: (CURTAIN_LIFT_MS - FINAL_FADE_IN_MS + 600) / 1000,
            ease: [0.83, 0, 0.17, 1],
            delay: (FINAL_FADE_IN_MS - 200) / 1000,
          },
        }}
        className="absolute inset-0"
      >
        {FINAL_SRC && (
          <Image
            src={FINAL_SRC}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            {...(FINAL_LQIP ? { placeholder: 'blur' as const, blurDataURL: FINAL_LQIP } : {})}
          />
        )}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(17,17,17,0.18)' }} />
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────── HERO ──────────────────────────── */

function Hero() {
  const cms = useLife()
  /* Hero is mounted behind the curtain. Headline words animate
     in once the curtain begins lifting — timed to the same choreography. */
  const introCount = cms.introImages?.length ?? 0
  /* On portrait viewports (taller than wide) the collage curtain is skipped, so
     the headline reveals shortly after load instead of waiting for the (absent)
     curtain to lift. Only the delay changes, so it's hydration-safe. */
  const [skipIntro] = useState(
    () =>
      cms.showIntro === false ||
      (cms.introImages?.length ?? 0) === 0 ||
      (typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches),
  )
  const HERO_REVEAL_DELAY = skipIntro
    ? 0.35
    : introTiming(introCount).liftMs / 1000 + 0.5 // headline rises as curtain pulls away

  const HERO_IMG = cms.heroImage ?? ''
  const LINE1 = cms.heroLine1 ?? ''
  const LINE2 = cms.heroLine2 ?? ''
  const CAP_SMALL = cms.heroCaptionSmall ?? ''
  const CAP_LARGE = cms.heroCaptionLarge ?? ''

  return (
    <section
      className="relative w-full min-h-[82svh] md:min-h-[92vh]"
      style={{
        backgroundColor: FAINT,
        overflow: 'hidden',
      }}
    >
      {/* full-bleed group photo background */}
      <div className="absolute inset-0">
        {HERO_IMG && (
          <Image
            src={HERO_IMG}
            alt="The JL Morison team"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            {...(cms.heroImageLqip
              ? { placeholder: 'blur' as const, blurDataURL: cms.heroImageLqip }
              : {})}
          />
        )}
        {/* localised gradient for headline readability — keeps the photo's
            natural top edge so the navbar curve stays visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      {/* centered two-line headline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[6vw] z-10">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '9vw' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.6, ease: [0.696, 0.108, 0.199, 0.897], delay: HERO_REVEAL_DELAY }}
            className={`${serifClass} italic text-center`}
            style={{
              fontSize: 'clamp(64px, 12vw, 180px)',
              lineHeight: 1,
              fontWeight: 400,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              margin: 0,
              // vertical room so ascenders/descenders aren't clipped by the reveal mask
              paddingTop: '0.24em',
              paddingBottom: '0.24em',
            }}
          >
            {LINE1}
          </motion.h1>
        </div>

        {/* marginTop pulls this whole mask up to cancel the 0.48em of padding
            (0.24em from each line) so the two lines keep their tight spacing */}
        <div
          className="overflow-hidden"
          style={{ marginTop: 'calc(-0.4vw - 0.48 * clamp(64px, 12vw, 180px))' }}
        >
          <motion.h1
            initial={{ y: '9vw' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.6, ease: [0.696, 0.108, 0.199, 0.897], delay: HERO_REVEAL_DELAY + 0.2 }}
            className={`${dmSans.className} text-center`}
            style={{
              fontSize: 'clamp(64px, 12vw, 180px)',
              lineHeight: 1,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              margin: 0,
              paddingTop: '0.24em',
              paddingBottom: '0.24em',
            }}
          >
            {LINE2}
          </motion.h1>
        </div>
      </div>

      {/* bottom caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: HERO_REVEAL_DELAY + 1.0 }}
        className="absolute bottom-[5svh] md:bottom-[6vh] left-0 right-0 flex flex-col items-center z-10"
      >
        <span
          className={`${dmSans.className} uppercase tracking-[0.24em]`}
          style={{ fontSize: 11, color: '#FFFFFF', opacity: 0.7 }}
        >
          {CAP_SMALL}
        </span>
        <span
          className={`${serifClass} italic mt-2 text-center max-w-[44ch]`}
          style={{ fontSize: 'clamp(16px, 1.4vw, 20px)', color: '#FFFFFF', opacity: 0.85, fontWeight: 400 }}
        >
          {CAP_LARGE}
        </span>
      </motion.div>
    </section>
  )
}

/* ─────────────────── INTRO PARAGRAPH (post-hero) ────────────────── */

function IntroParagraph() {
  const cms = useLife()
  if (!cms.introStatement) return null
  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '14vh 6vw' }}
    >
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`${cormorant.className} max-w-[1000px] mx-auto text-center`}
        style={{
          fontSize: 'clamp(22px, 2.4vw, 34px)',
          lineHeight: 1.45,
          fontWeight: 300,
          color: INK,
        }}
      >
        {cms.introStatement}
      </motion.p>
    </section>
  )
}


/* ───────────── Infinite photo carousel (below the intro statement) ─────────────── */

function CaptionStrip() {
  const cms = useLife()
  const ITEMS = (cms.captionStrip ?? []).filter((it) => it.src)
  if (ITEMS.length === 0) return null
  const speed = cms.carouselSpeed && cms.carouselSpeed > 0 ? cms.carouselSpeed : 2

  // Scale the loop duration by the number of photos so the *pixel* speed stays
  // constant no matter how many are added (otherwise more photos = faster). The
  // Sanity `carouselSpeed` is the live multiplier — higher = faster, lower =
  // slower. ~14s per photo at speed 1 keeps it calm.
  // Pixel speed stays constant regardless of how many photos land in a row.
  const rowDur = (count: number, mult: number) => (Math.max(count, 1) * 14 * mult) / speed

  // Split the photos across three rows so NO photo appears in more than one row
  // (row r takes every 3rd photo). Each row is then its own infinite loop.
  const rows = [
    { dir: 'left' as const, mult: 1.0, items: ITEMS.filter((_, i) => i % 3 === 0) },
    { dir: 'right' as const, mult: 1.14, items: ITEMS.filter((_, i) => i % 3 === 1) },
    { dir: 'left' as const, mult: 1.07, items: ITEMS.filter((_, i) => i % 3 === 2) },
  ].filter((row) => row.items.length > 0)

  const card = (it: { src: string; caption?: string; lqip?: string }) => (
    <div
      className="relative overflow-hidden"
      style={{
        // Uniform horizontal (landscape) frame for every photo; object-cover
        // fills it regardless of the original image's proportions.
        width: 'clamp(280px, 60vw, 400px)',
        aspectRatio: '3 / 2',
        borderRadius: 16,
        backgroundColor: FAINT,
      }}
    >
      <Image
        src={it.src}
        alt={it.caption ?? ''}
        fill
        sizes="340px"
        style={{ objectFit: 'cover' }}
        {...(it.lqip ? { placeholder: 'blur' as const, blurDataURL: it.lqip } : {})}
      />
      {it.caption && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: '55%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))',
            }}
          />
          <div
            className={`${serifClass} absolute inset-x-4 bottom-3 italic text-white`}
            style={{ fontSize: 'clamp(15px, 1.3vw, 18px)', fontWeight: 500 }}
          >
            {it.caption}
          </div>
        </>
      )}
    </div>
  )

  return (
    <section
      className="relative w-full overflow-hidden pt-[3vh] pb-[12vh]"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div
        className="flex flex-col gap-3 sm:gap-4"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          maskImage:
            'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
        }}
      >
        {rows.map((row, r) => (
          <Marquee
            key={r}
            items={row.items}
            direction={row.dir}
            duration={rowDur(row.items.length, row.mult)}
            gap={14}
            pauseOnHover={false}
            renderItem={(it) => card(it)}
          />
        ))}
      </div>
    </section>
  )
}

/* ──────────── Employee testimonials (card row) ──────────── */

/* Section sits on black. Cards alternate a solid white fill and a raised
   charcoal surface (clearly lighter than the black ground, with a hairline
   edge) so both read cleanly — monochrome, no hue introduced. */
const CARD_STYLES = [
  { bg: '#FFFFFF', fg: INK, sub: MUTED, border: 'none' },
  { bg: '#2A2A2A', fg: '#FFFFFF', sub: 'rgba(255,255,255,0.62)', border: '1px solid rgba(255,255,255,0.08)' },
] as const

/* A single testimonial card. The card, the quote area and the name/role block
   are a FIXED size and position on every card — only the quote's font size
   changes: it shrinks until the quote fits its (fixed) area, so the name and
   role always sit at exactly the same spot regardless of quote length. */
function QuoteCard({
  t,
  s,
}: {
  t: { quote: string; name: string; role: string }
  s: (typeof CARD_STYLES)[number]
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const box = boxRef.current
    const q = quoteRef.current
    if (!box || !q) return

    const fit = () => {
      let size = 27
      q.style.fontSize = `${size}px`
      // Shrink (never grow past 27) until the quote fits the fixed quote box.
      while (q.scrollHeight > box.clientHeight && size > 12) {
        size -= 0.5
        q.style.fontSize = `${size}px`
      }
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [t.quote])

  return (
    <figure
      className="flex flex-col overflow-hidden"
      style={{
        width: 'min(86vw, 410px)',
        height: 440,
        backgroundColor: s.bg,
        color: s.fg,
        border: s.border,
        borderRadius: 20,
        padding: '32px 30px',
      }}
    >
      <div ref={boxRef} className="min-h-0 flex-1 overflow-hidden">
        <blockquote
          ref={quoteRef}
          className={dmSans.className}
          style={{ fontSize: 27, lineHeight: 1.42, fontWeight: 400 }}
        >
          “{t.quote}”
        </blockquote>
      </div>
      <figcaption className="mt-6 shrink-0">
        <div
          className={dmSans.className}
          style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em' }}
        >
          {t.name}
        </div>
        {t.role && (
          <div className={`${dmSans.className} mt-1`} style={{ fontSize: 14, color: s.sub }}>
            {t.role}
          </div>
        )}
      </figcaption>
    </figure>
  )
}

function TestimonialsBlock() {
  const cms = useLife()
  const reduce = useReducedMotion()
  const HEADLINE = cms.arentHeadline ?? ''
  const BODY = cms.arentBody ?? ''
  const ITEMS = cms.testimonials ?? []
  const speed = cms.carouselSpeed && cms.carouselSpeed > 0 ? cms.carouselSpeed : 2

  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: INK, color: '#FFFFFF', padding: '16vh 0 10vh' }}
    >
      <div className="px-[6vw] max-w-[820px]">
        <h2
          className={serifClass}
          style={{
            fontSize: 'clamp(26px, 5.4vw, 72px)',
            lineHeight: 1.04,
            color: '#FFFFFF',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {/* Philanthropy-style highlighter: a beige band that fully wraps the
              glyphs with DARK ink text on top (high contrast, always legible).
              The band sweeps in left→right (scaleX) as the section is reached,
              revealing the ink text on beige as it goes. scaleX fires reliably
              where an animated clip-path did not. */}
          <span className="relative inline-block">
            <motion.span
              aria-hidden
              className="absolute rounded-[0.1em]"
              style={{
                backgroundColor: BEIGE_ACCENT,
                top: '-0.04em',
                bottom: '-0.14em',
                left: '-0.12em',
                right: '-0.12em',
                transformOrigin: 'left center',
                zIndex: 0,
              }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            />
            <span className="relative" style={{ color: INK, zIndex: 1 }}>
              {HEADLINE}
            </span>
          </span>
        </h2>
        <p
          className={`${dmSans.className} mt-6 max-w-[52ch]`}
          style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.7 }}
        >
          {BODY}
        </p>
      </div>

      {/* auto-scrolling marquee of quote cards (pauses on hover) */}
      <Marquee
        items={ITEMS}
        direction="left"
        duration={Math.max(28, ITEMS.length * 9) / speed}
        gap={20}
        className="mt-[8vh]"
        renderItem={(t, i) => (
          <QuoteCard t={t} s={CARD_STYLES[i % CARD_STYLES.length]} />
        )}
      />
    </section>
  )
}


/* ─────────────────────────── PAGE ─────────────────────────── */

export default function LifeAtJlmClient({ cms = {} }: { cms?: LifeCms }) {
  /* Marketing can switch the opening curtain animation off in Sanity. It also
     only makes sense when there are actually intro photos to show — with none,
     an empty curtain would just zoom + lift over a blank frame. Either case:
     the hero + title show straight away (introDone starts true → no curtain). */
  const introEnabled = cms.showIntro !== false && (cms.introImages?.length ?? 0) > 0
  const [introDone, setIntroDone] = useState(!introEnabled)

  /* On portrait viewports (taller than wide — phones held upright) skip the
     collage intro curtain entirely; only the hero text animation plays. */
  useEffect(() => {
    if (window.matchMedia('(orientation: portrait)').matches) setIntroDone(true)
  }, [])

  /* smooth scroll for in-page anchors, offset for the fixed navbar */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const a = t.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
        ) || 56
      const top = el.getBoundingClientRect().top + window.scrollY - navH - 8
      window.scrollTo({ top, behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  /* lock the page while the intro curtain is playing */
  useEffect(() => {
    if (introDone) {
      document.body.style.overflow = ''
    } else {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [introDone])

  return (
    <LifeCtx.Provider value={cms}>
      <div className={`${dmSans.variable}`}>
        {!introDone && <IntroCurtain onDone={() => setIntroDone(true)} />}
        <Hero />
        <IntroParagraph />
        <CaptionStrip />
        <TestimonialsBlock />
        {/* Section above is black (#111111); a rounded footer top would reveal
            white notches, so sit flush for a seamless black expanse. */}
        <Footer roundedTop={false} />
      </div>
    </LifeCtx.Provider>
  )
}
