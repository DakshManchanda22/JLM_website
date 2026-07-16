'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'

/* ─────────────── CMS overrides via Context ───────────────
   Every text + image on this page can be overridden from
   Sanity. Each block reads the Context and falls back to
   its existing hardcoded default when a field is missing. */

export type LifeCms = {
  introImages?: { url: string }[]
  introFinalImage?: string
  heroImage?: string
  heroImageLqip?: string
  heroLine1?: string
  heroLine2?: string
  heroCaptionSmall?: string
  heroCaptionLarge?: string
  anchors?: { num: string; label: string; targetId: string; image: string }[]
  captionStrip?: { src: string; caption: string; aspect?: number }[]
  peopleLabel?: string
  peopleHeadline?: string
  peopleTagline?: string
  peopleBody?: string
  arentEyebrow?: string
  arentHeadline?: string
  arentBody?: string
  testimonials?: { quote: string; name: string; role: string }[]
  workplaceLabel?: string
  workplaceHeadline?: string
  workplaceTagline?: string
  workplaceBody?: string
  workplaceImages?: { src: string; cap: string; aspect?: number }[]
  carouselSpeed?: number
  togetherLabel?: string
  togetherHeadline?: string
  togetherTagline?: string
  togetherBody?: string
  togetherBrands?: { name: string; tag: string }[]
  togetherClosingMark?: string
  togetherClosingLine?: string
  togetherCtaLabel?: string
  togetherCtaHref?: string
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

/* ─────────────────────────── data ─────────────────────────── */

/* Placeholder employee testimonials — marketing replaces these in Sanity
   (Life at JL Morison → Employee testimonials). */
const DEFAULT_TESTIMONIALS = [
  {
    quote:
      'In fifteen years here, the thing that’s never changed is the feeling that the work matters — and that the people beside you care just as much as you do.',
    name: 'Priya Nair',
    role: 'R&D · Emoform',
  },
  {
    quote:
      'I joined straight out of college and was trusted with real responsibility within months. You’re never just a cog here; your ideas actually make it to the shelf.',
    name: 'Arjun Mehta',
    role: 'Brand Marketing · Baby Dreams',
  },
  {
    quote:
      'What I value most is the honesty. We talk openly about what’s working and what isn’t, and then we fix it together. That’s rare in a company this old.',
    name: 'Fatima Sheikh',
    role: 'Supply Chain',
  },
  {
    quote:
      'A hundred-year-old company that still feels like it’s just getting started. The pace is real, but so is the patience to get things right.',
    name: 'Rohan Desai',
    role: 'Sales · West Region',
  },
]

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
}: {
  items: T[]
  renderItem: (item: T, i: number) => ReactNode
  direction?: 'left' | 'right'
  duration?: number
  gap?: number
  className?: string
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
        className="marquee-track flex w-max"
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
const DEFAULT_INTRO_SRCS = [
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&h=1100&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&h=1100&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=1100&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=1100&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=1100&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=1600&h=1100&fit=crop&auto=format',
]
const DEFAULT_INTRO_FINAL_SRC =
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1800&h=1200&fit=crop&auto=format'

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
  const cmsSrcs = cms.introImages?.map((i) => i.url).filter(Boolean) as string[] | undefined
  /* Render exactly the photos provided — no padding, so no image repeats. */
  const SRCS = cmsSrcs && cmsSrcs.length > 0 ? cmsSrcs : DEFAULT_INTRO_SRCS
  const FINAL_SRC = cms.introFinalImage ?? DEFAULT_INTRO_FINAL_SRC
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
              src={src}
              alt=""
              fill
              priority={i < 3}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
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
        <Image
          src={FINAL_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
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
  const introCount =
    cms.introImages && cms.introImages.length > 0
      ? cms.introImages.length
      : DEFAULT_INTRO_SRCS.length
  /* On portrait viewports (taller than wide) the collage curtain is skipped, so
     the headline reveals shortly after load instead of waiting for the (absent)
     curtain to lift. Only the delay changes, so it's hydration-safe. */
  const [skipIntro] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches,
  )
  const HERO_REVEAL_DELAY = skipIntro
    ? 0.35
    : introTiming(introCount).liftMs / 1000 + 0.5 // headline rises as curtain pulls away

  const HERO_IMG =
    cms.heroImage ??
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=2400&h=1600&fit=crop&auto=format'
  const LINE1 = cms.heroLine1 ?? 'Life at'
  const LINE2 = cms.heroLine2 ?? 'JL Morison'
  const CAP_SMALL = cms.heroCaptionSmall ?? 'Since 1920'
  const CAP_LARGE = cms.heroCaptionLarge ?? 'A century of building goodness, together.'

  return (
    <section
      className="relative w-full"
      style={{
        minHeight: '92vh',
        backgroundColor: FAINT,
        overflow: 'hidden',
      }}
    >
      {/* full-bleed group photo background */}
      <div className="absolute inset-0">
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
        className="absolute bottom-[6vh] left-0 right-0 flex flex-col items-center z-10"
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
        At JL Morison, we believe that a great organisation is built on both performance and
        purpose. We&rsquo;ve created a workplace that carries the energy and mobility of a growing
        company while offering the stability and openness of an established MNC — giving our people
        a rare kind of foundation to grow from. Collaboration, honest communication, and a
        genuinely positive culture aren&rsquo;t aspirations here; they&rsquo;re simply how we work.
        Everything we do is grounded in{' '}
        <span className="italic" style={{ fontWeight: 400 }}>
          values we hold ourselves to
        </span>
        , every single day.
      </motion.p>
    </section>
  )
}


/* ───────────── Editorial caption-image strip ─────────────── */

function CaptionStrip() {
  const cms = useLife()
  const DEFAULT_ITEMS = [
    {
      src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=1100&fit=crop&auto=format',
      caption: 'Powered by chai (and a little chocolate)',
    },
    {
      src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900&h=1100&fit=crop&auto=format',
      caption: 'Quietly, unmistakably all in',
    },
  ]
  const ITEMS = (cms.captionStrip && cms.captionStrip.length > 0 ? cms.captionStrip : DEFAULT_ITEMS).map(
    (it, i) => ({
      src: it.src,
      caption: it.caption,
      // Match the frame to the photo's real proportions so nothing gets
      // cropped — whatever aspect marketing uploads is what shows. Falls back
      // to a portrait frame only when the ratio is unknown.
      aspect: 'aspect' in it && it.aspect ? String(it.aspect) : '4 / 5',
      offset: i % 2 === 0 ? 0 : 64,
    }),
  )
  return (
    <section
      className="relative w-full px-[4vw] pt-[3vh] pb-[12vh] grid grid-cols-1 md:grid-cols-2 gap-x-[4vw] gap-y-16"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {ITEMS.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
          style={{ marginTop: it.offset }}
        >
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: 16, aspectRatio: it.aspect, backgroundColor: FAINT }}
          >
            <Image src={it.src} alt={it.caption} fill sizes="(max-width: 768px) 90vw, 42vw" style={{ objectFit: 'cover' }} />
          </div>
          <p
            className={`${serifClass} italic mt-4`}
            style={{ fontSize: 20, color: MUTED, fontWeight: 400 }}
          >
            {it.caption}
          </p>
        </motion.div>
      ))}
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

function TestimonialsBlock() {
  const cms = useLife()
  const reduce = useReducedMotion()
  const HEADLINE = cms.arentHeadline ?? 'What our employees say'
  const BODY =
    cms.arentBody ??
    'A hundred years of building goodness — in the words of the people who do it every day.'
  const ITEMS =
    cms.testimonials && cms.testimonials.length > 0 ? cms.testimonials : DEFAULT_TESTIMONIALS
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
        renderItem={(t, i) => {
          const s = CARD_STYLES[i % CARD_STYLES.length]
          // Longer quotes step the font down so every card stays the same size,
          // but the floor stays large enough to fill the card comfortably.
          const len = t.quote.length
          const qFont =
            len > 260 ? 20 : len > 210 ? 21.5 : len > 160 ? 23 : len > 110 ? 25 : 27
          return (
            <figure
              className="flex flex-col justify-between overflow-hidden"
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
              <blockquote
                className={dmSans.className}
                style={{ fontSize: qFont, lineHeight: 1.42, fontWeight: 400 }}
              >
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-8">
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
        }}
      />
    </section>
  )
}

/* ───────────────── /3 WORKPLACE block ───────────────── */

function WorkplaceBlock() {
  const cms = useLife()
  const HEADLINE =
    cms.workplaceHeadline ?? 'A working day that makes room for actual thinking.'
  const KICKER = cms.workplaceLabel ?? 'Life at JL Morison'
  const BODY =
    cms.workplaceBody ??
    'A dynamic, engaging place where creativity thrives, collaboration is encouraged, and every milestone is celebrated together.'

  // Mixed orientations so the default state already reads as a Pinterest wall.
  const DEFAULT_PHOTOS = [
    { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&auto=format', cap: 'Teams at work', aspect: 1.5 },
    { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=1200&fit=crop&auto=format', cap: 'Heads down, building', aspect: 0.75 },
    { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop&auto=format', cap: 'In the room together', aspect: 1.5 },
    { src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&h=1000&fit=crop&auto=format', cap: 'Milestones, marked', aspect: 1 },
    { src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&h=800&fit=crop&auto=format', cap: 'Celebrating together', aspect: 1.5 },
    { src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=1200&fit=crop&auto=format', cap: 'The everyday rhythm', aspect: 0.75 },
  ]
  // Show every image marketing adds — the masonry just keeps growing.
  const photos =
    cms.workplaceImages && cms.workplaceImages.length > 0
      ? cms.workplaceImages
      : DEFAULT_PHOTOS
  // Sanity carousel speed multiplier (default 2× faster than the base durations).
  const speed = cms.carouselSpeed && cms.carouselSpeed > 0 ? cms.carouselSpeed : 2

  return (
    <section
      id="workplace"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: INK, padding: '16vh 0' }}
    >
      {/* centered header */}
      <div className="mx-auto max-w-[940px] px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className={dmSans.className}
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          {KICKER}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
          className={`${serifClass} mt-5`}
          style={{
            fontSize: 'clamp(34px, 4.6vw, 68px)',
            lineHeight: 1.06,
            fontWeight: 300,
            color: '#FFFFFF',
            textWrap: 'balance',
          }}
        >
          {HEADLINE}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          className={`${dmSans.className} mx-auto mt-6 max-w-[62ch]`}
          style={{ color: 'rgba(255,255,255,0.66)', fontSize: 16, lineHeight: 1.7 }}
        >
          {BODY}
        </motion.p>
      </div>

      {/* Three auto-scrolling rows, alternating direction (→, ←, →). Each row
          is a full-bleed marquee that pauses on hover. */}
      <div className="mt-10 flex flex-col gap-3 sm:mt-14 sm:gap-4">
        {([
          { dir: 'right', dur: 55 },
          { dir: 'left', dur: 48 },
          { dir: 'right', dur: 62 },
        ] as const).map((row, r) => (
          <Marquee
            key={r}
            items={photos.map((_, i) => photos[(i + r * 2) % photos.length])}
            direction={row.dir}
            duration={row.dur / speed}
            gap={14}
            renderItem={(p) => (
              <div
                className="relative overflow-hidden"
                style={{
                  width: 'clamp(200px, 56vw, 300px)',
                  aspectRatio: '3 / 4',
                  borderRadius: 16,
                  backgroundColor: '#1E1E1E',
                }}
              >
                <Image
                  src={p.src}
                  alt={p.cap ?? ''}
                  fill
                  sizes="300px"
                  style={{ objectFit: 'cover' }}
                />
                {p.cap && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0"
                      style={{
                        height: '55%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0))',
                      }}
                    />
                    <div
                      className={`${serifClass} absolute inset-x-4 bottom-4 text-white`}
                      style={{ fontSize: 'clamp(16px, 1.4vw, 20px)', fontWeight: 500, lineHeight: 1.2 }}
                    >
                      {p.cap}
                    </div>
                  </>
                )}
              </div>
            )}
          />
        ))}
      </div>
    </section>
  )
}


/* ─────────────────────────── PAGE ─────────────────────────── */

export default function LifeAtJlmClient({ cms = {} }: { cms?: LifeCms }) {
  const [introDone, setIntroDone] = useState(false)

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
        <WorkplaceBlock />
        {/* Section above is black (#111111); a rounded footer top would reveal
            white notches, so sit flush for a seamless black expanse. */}
        <Footer roundedTop={false} />
      </div>
    </LifeCtx.Provider>
  )
}
