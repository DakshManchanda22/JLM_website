'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, animate, useInView, useReducedMotion } from 'framer-motion'
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
  valuesLabel?: string
  valuesHeadline?: string
  valuesTagline?: string
  values?: { icon: string; title: string; body: string; img: string }[]
  workplaceLabel?: string
  workplaceHeadline?: string
  workplaceTagline?: string
  workplaceBody?: string
  workplaceImages?: { src: string; cap: string }[]
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

const DEFAULT_VALUES = [
  {
    icon: '',
    title: 'Customer & Quality Focus',
    body: 'We deliver high-quality products and services to delight our customers by recognising areas of improvement and continuously exploring new ways of improving our offerings.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=1200&fit=crop&auto=format',
  },
  {
    icon: '',
    title: 'Trust & Empowerment',
    body: 'We weave employee empowerment into the daily roles of our people. We enable, inspire, and encourage individuals to take steps to improve their work experience, increase their engagement, and help build an inclusive culture.',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=1200&fit=crop&auto=format',
  },
  {
    icon: '',
    title: 'Cost Focus',
    body: 'We identify the drivers of cost in the value chain and control them — without compromising on quality or identity.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=1200&fit=crop&auto=format',
  },
  {
    icon: '',
    title: 'Corporate Citizenship',
    body: 'Corporate citizenship is our company\'s responsibility towards society. We adhere to the highest standards in ethical behaviour, environmental sustainability, and legal responsibility — balancing the needs of our customers, our community, and the environment around us.',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&h=1200&fit=crop&auto=format',
  },
  {
    icon: '',
    title: 'Care & Respect For People',
    body: 'We believe in a responsible and supportive environment where people treat each other respectfully regardless of origin, education, religion, beliefs, physical ability, gender, or sexual identity.',
    img: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=900&h=1200&fit=crop&auto=format',
  },
  {
    icon: '',
    title: 'Learning & Experimentation',
    body: 'JLM is committed to a culture that encourages professionalism and excellence through learning and development — supporting innovative approaches, fresh solutions, and the continuous search for new ways to advance our goals.',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&h=1200&fit=crop&auto=format',
  },
  {
    icon: '',
    title: 'Executing with Accountability & Collaboration',
    body: 'Accountability is the duty of every Morisoner to be answerable for their actions and decisions, and to accept responsibility for them. Collaboration between teams reduces redundancy and improves the quality of our work — and wherever possible, we work closely with others to coordinate our efforts.',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=1200&fit=crop&auto=format',
  },
]

/* ─────────────────────── reusable bits ─────────────────────── */

function Sporting({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`${serifClass} italic`}
      style={{
        fontWeight: 400,
        fontSize: 'clamp(20px, 2.2vw, 28px)',
        color: INK,
        lineHeight: 1.35,
      }}
    >
      {children}
    </p>
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
  const HERO_REVEAL_DELAY = introTiming(introCount).liftMs / 1000 + 0.5 // headline rises as curtain pulls away

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
            }}
          >
            {LINE1}
          </motion.h1>
        </div>

        <div className="overflow-hidden">
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
              marginTop: '-0.4vw',
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
  const HEADLINE = cms.arentHeadline ?? 'What our employees say'
  const BODY =
    cms.arentBody ??
    'A hundred years of building goodness — in the words of the people who do it every day.'
  const ITEMS =
    cms.testimonials && cms.testimonials.length > 0 ? cms.testimonials : DEFAULT_TESTIMONIALS

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
          {HEADLINE}
        </h2>
        <p
          className={`${dmSans.className} mt-6 max-w-[52ch]`}
          style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.7 }}
        >
          {BODY}
        </p>
      </div>

      {/* horizontal, snap-scrolling row of quote cards */}
      <div
        className="hide-scrollbar mt-[8vh] flex items-stretch gap-5 overflow-x-auto overflow-y-hidden pb-4 snap-x snap-mandatory"
        style={{ paddingLeft: '6vw', paddingRight: '6vw', scrollPaddingLeft: '6vw' }}
      >
        {ITEMS.map((t, i) => {
          const s = CARD_STYLES[i % CARD_STYLES.length]
          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.08 }}
              className="snap-start shrink-0 flex flex-col justify-between"
              style={{
                width: 'min(80vw, 380px)',
                minHeight: 460,
                backgroundColor: s.bg,
                color: s.fg,
                border: s.border,
                borderRadius: 20,
                padding: '32px 30px',
              }}
            >
              <blockquote
                className={dmSans.className}
                style={{ fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.45, fontWeight: 400 }}
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
            </motion.figure>
          )
        })}
      </div>
    </section>
  )
}

/* ────────── /2 VALUES — hover-driven list + image ────────── */

function ValuesBlock() {
  const cms = useLife()
  const HEADLINE =
    cms.valuesHeadline ?? 'Seven values we quietly refuse to compromise on.'
  const TAGLINE = cms.valuesTagline ?? 'All of the above — with long-term thinking.'
  const VALUES = cms.values && cms.values.length > 0 ? cms.values : DEFAULT_VALUES
  const [active, setActive] = useState(0)
  return (
    <section
      id="values"
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '14vh 6vw' }}
    >
      <div className="max-w-[820px]">
        <h2
          className={`${serifClass} mt-6`}
          style={{
            fontSize: 'clamp(32px, 4.2vw, 58px)',
            lineHeight: 1.08,
            fontWeight: 300,
            color: INK,
            textWrap: 'balance',
          }}
        >
          {HEADLINE}
        </h2>
        <div className="mt-6">
          <Sporting>{TAGLINE}</Sporting>
        </div>
      </div>

      <div className="mt-[10vh] grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-12">
        {/* list */}
        <div className="md:col-span-7">
          {VALUES.map((v, i) => {
            const isActive = active === i
            return (
              <div
                key={v.title}
                onMouseEnter={() => setActive(i)}
                className="group relative py-8 cursor-default"
                style={{ borderTop: `1px solid ${isActive ? INK : FAINT}`, transition: 'border-color 300ms' }}
              >
                <div className="flex items-baseline gap-6">
                  <span
                    className={`${dmSans.className}`}
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      letterSpacing: '0.08em',
                      width: 28,
                      flexShrink: 0,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <h3
                        className={cormorant.className}
                        style={{
                          fontSize: 'clamp(28px, 3.4vw, 48px)',
                          color: INK,
                          fontWeight: 400,
                          lineHeight: 1.1,
                          fontStyle: isActive ? 'italic' : 'normal',
                          transition: 'font-style 200ms',
                        }}
                      >
                        {v.title}
                      </h3>
                    </div>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className={`${dmSans.className} overflow-hidden`}
                          style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, maxWidth: '54ch' }}
                        >
                          <span className="block pt-4">{v.body}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )
          })}
          <div style={{ borderTop: `1px solid ${FAINT}` }} />
        </div>

        {/* image reveal */}
        <div className="md:col-span-5 md:sticky md:top-24 self-start">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '3 / 4', borderRadius: 18, backgroundColor: FAINT }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={VALUES[active].img}
                  alt={VALUES[active].title}
                  fill
                  sizes="(max-width: 768px) 90vw, 38vw"
                  style={{ objectFit: 'cover' }}
                />
              </motion.div>
            </AnimatePresence>
            <div
              className={`${serifClass} italic absolute bottom-5 left-5`}
              style={{ color: '#FFFFFF', fontSize: 22, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
            >
              {VALUES[active].title}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── Stat cards (below Values) ───────────────── */

/* Stat cards modelled exactly on the reference travel card: photo on top,
   coloured title, subtitle, an icon detail row, a dark pill CTA and a heart.
   Images (and the reference placeholder copy) are swappable later. */
const STAT_GREEN = '#58C15C'
const STAT_PINK = '#E85CA0'
const STAT_CARDS = [
  {
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=1000&fit=crop&auto=format',
    number: 400,
    suffix: '',
    label: 'Work strength',
    color: STAT_GREEN,
  },
  {
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1000&fit=crop&auto=format',
    number: 10,
    suffix: '%',
    label: 'Gender parity',
    color: STAT_PINK,
  },
] as const

/* Counts from 0 → `to` once the number scrolls into view. Honours
   prefers-reduced-motion by jumping straight to the final value. */
function CountUp({ to, duration = 1 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setVal(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])
  return <span ref={ref}>{val}</span>
}

function StatsBlock() {
  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '12vh 6vw' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[1000px] mx-auto">
        {STAT_CARDS.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            className="mx-auto w-full max-w-[460px]"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 30,
              padding: 20,
              boxShadow: '0 30px 60px -22px rgba(0,0,0,0.22)',
            }}
          >
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: '5 / 4', borderRadius: 22, backgroundColor: FAINT }}
            >
              <Image
                src={c.img}
                alt=""
                fill
                sizes="(max-width: 768px) 90vw, 460px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="px-3 pt-6 pb-3">
              <div
                className={dmSans.className}
                style={{
                  fontSize: 'clamp(56px, 7vw, 88px)',
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  color: c.color,
                }}
              >
                <CountUp to={c.number} />
                {c.suffix}
              </div>
              <div
                className={`${dmSans.className} mt-2`}
                style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', fontWeight: 500, color: c.color }}
              >
                {c.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────── /3 WORKPLACE block ───────────────── */

function WorkplaceBlock() {
  const cms = useLife()
  const HEADLINE =
    cms.workplaceHeadline ?? 'A working day that makes room for actual thinking.'
  const TAGLINE = cms.workplaceTagline ?? 'Heads-down work. Heads-up culture. 🪟'
  const BODY =
    cms.workplaceBody ??
    'We meet when meeting matters. The rest of the time, people are in flow — at the office in Mumbai, at home, on the factory floor, with retailers. Three brands, dozens of small teams, one shared rhythm of careful work.'

  const SPANS = [
    { span: 'col-span-12 md:col-span-7', aspect: '3 / 2' },
    { span: 'col-span-7 md:col-span-5', aspect: '3 / 4' },
    { span: 'col-span-5 md:col-span-4', aspect: '4 / 5' },
    { span: 'col-span-12 md:col-span-8', aspect: '4 / 3' },
  ]
  const DEFAULT_PHOTOS = [
    { src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=800&fit=crop&auto=format', cap: 'The office, Mumbai' },
    { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&h=1200&fit=crop&auto=format', cap: 'Mornings, before chai' },
    { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&h=1100&fit=crop&auto=format', cap: 'Hands-on always' },
    { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=900&fit=crop&auto=format', cap: 'Teamwork that travels' },
  ]
  const photos =
    cms.workplaceImages && cms.workplaceImages.length > 0
      ? cms.workplaceImages.slice(0, 4)
      : DEFAULT_PHOTOS

  return (
    <section
      id="workplace"
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '14vh 6vw' }}
    >
      <div className="max-w-[820px]">
        <h2
          className={`${serifClass} mt-6`}
          style={{
            fontSize: 'clamp(32px, 4.2vw, 58px)',
            lineHeight: 1.08,
            fontWeight: 300,
            color: INK,
            textWrap: 'balance',
          }}
        >
          {HEADLINE}
        </h2>
        <div className="mt-6">
          <Sporting>{TAGLINE}</Sporting>
        </div>
        <p
          className={`${dmSans.className} mt-6 max-w-[58ch]`}
          style={{ color: MUTED, fontSize: 15, lineHeight: 1.7 }}
        >
          {BODY}
        </p>
      </div>

      <div className="mt-[8vh] grid grid-cols-12 gap-4">
        {photos.map((p, i) => {
          const layout = SPANS[i % SPANS.length]
          const c = { src: p.src, cap: p.cap, span: layout.span, aspect: layout.aspect }
          return (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.07 }}
            className={c.span}
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: c.aspect, borderRadius: 14, backgroundColor: '#FFFFFF' }}
            >
              <Image src={c.src} alt={c.cap} fill sizes="(max-width: 768px) 90vw, 50vw" style={{ objectFit: 'cover' }} />
            </div>
            <figcaption
              className={`${dmSans.className} mt-2`}
              style={{ color: MUTED, fontSize: 12, letterSpacing: '0.04em' }}
            >
              — {c.cap}
            </figcaption>
          </motion.figure>
          )
        })}
      </div>
    </section>
  )
}


/* ─────────────────────────── PAGE ─────────────────────────── */

export default function LifeAtJlmClient({ cms = {} }: { cms?: LifeCms }) {
  const [introDone, setIntroDone] = useState(false)

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
        <ValuesBlock />
        <StatsBlock />
        <WorkplaceBlock />
        <Footer />
      </div>
    </LifeCtx.Provider>
  )
}
