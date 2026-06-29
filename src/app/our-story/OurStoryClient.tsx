'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Anton, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
})

/* ─────────────── palette ─────────────── */
const INK = '#111111'
const MUTED = '#555555'
const BEIGE = '#E8E0D5'

const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────────── types ─────────────── */

export type Era = {
  number: string
  dateRange: string
  title: string
  body: string
  image?: string
  lqip?: string
}

export type JourneyStage = {
  period?: string
  name: string
  note?: string
}

export type Pillar = {
  name: string
  description?: string
}

export type OurStoryCms = {
  eyebrow?: string
  headlineTop?: string
  headlineBottom?: string
  heroTagline?: string
  heroImage?: string
  establishedMark?: string
  journeyEyebrow?: string
  journeyHeadline?: string
  journeyStages?: JourneyStage[]
  erasEyebrow?: string
  erasHeadline?: string
  eras?: Era[]
  pillarsEyebrow?: string
  pillarsHeadline?: string
  pillars?: Pillar[]
  closingLine?: string
  closingSubline?: string
}

/* ─────────────── defaults ─────────────── */

const DEFAULT_STAGES: JourneyStage[] = [
  { period: '1920s', name: 'Trading Company', note: 'A heritage in fair, considered commerce.' },
  { period: '1940s — 2000s', name: 'Global Brand Partner', note: 'Bringing the world’s best to India.' },
  { period: '1980s onward', name: 'Manufacturer & Distributor', note: 'Building real capability on the ground.' },
  { period: '2011 onward', name: 'Own Brand Builder', note: 'Morisons Baby Dreams leads the way.' },
  { period: 'Today', name: 'Modern FMCG Company', note: 'Three brands, one promise, every Indian home.' },
]

const DEFAULT_ERAS: Era[] = [
  {
    number: '01',
    dateRange: '1920 — 1940',
    title: 'Global Origins',
    body: 'The story begins in the UK, with a small trading house carrying European craft to a still-young Indian market. From the very first shipment, the choice is set: stand for trust, stand for quality, and let the work speak for itself.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&h=1700&fit=crop&auto=format',
  },
  {
    number: '02',
    dateRange: '1940 — 2000',
    title: 'Strategic Partnerships',
    body: 'Six decades of patient brand-building alongside the world’s most discerning names. Each collaboration deepens our distribution, sharpens our standards, and earns the trust of Indian shopkeepers and Indian families alike.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&h=1700&fit=crop&auto=format',
  },
  {
    number: '03',
    dateRange: '2001 — 2010',
    title: 'Brand Reinvention',
    body: 'A decisive turn. The company pivots from carrying others’ brands to building our own — led by Morisons Baby Dreams, a brand made specifically for Indian mothers and the babies they raise.',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1400&h=1700&fit=crop&auto=format',
  },
  {
    number: '04',
    dateRange: '2011 — 2020',
    title: 'Digital & Manufacturing Transformation',
    body: 'We invest in our own factories, our own systems, and our own omnichannel presence. Production capability moves in-house. Technology moves alongside it. Distribution reaches every postcode that matters.',
    image: 'https://images.unsplash.com/photo-1565728744382-61accd4aa148?w=1400&h=1700&fit=crop&auto=format',
  },
  {
    number: '05',
    dateRange: '2021 — Present',
    title: 'Future-Focused Growth',
    body: 'Baby care widens. ESG, analytics, and modern retail are no longer adjacent — they are how we operate. A hundred-year company keeps its first principles while writing its next chapter.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1400&h=1700&fit=crop&auto=format',
  },
]

const DEFAULT_PILLARS: Pillar[] = [
  { name: 'Trusted Legacy', description: 'A century of trust, earned product by product, generation by generation.' },
  { name: 'Consumer Centric', description: 'The Indian family sits at the centre of every decision we make.' },
  { name: 'Innovation Driven', description: 'Curiosity is the engine — we test, we measure, we keep improving.' },
  { name: 'Sustainable Future', description: 'Goodness for the families of today, and the planet of tomorrow.' },
  { name: 'People First', description: 'Our people are our foundation. Their growth is our growth.' },
]

/* ─────────────── small bits ─────────────── */

/** Renders text with *asterisk-wrapped* segments turned italic. */
function MaybeItalic({ children }: { children: string }) {
  const parts = children.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <span key={i} className="italic" style={{ fontWeight: 500 }}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function Eyebrow({ children, color = MUTED }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="block h-px w-8" style={{ backgroundColor: color, opacity: 0.45 }} />
      <span
        className={`${dmSans.className} uppercase`}
        style={{ fontSize: 11, letterSpacing: '0.3em', color, fontWeight: 500 }}
      >
        {children}
      </span>
    </div>
  )
}

/* ────────────────────────── HERO ────────────────────────── */

function Hero({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const top = cms.headlineTop ?? 'A hundred years of'
  const bottom = cms.headlineBottom ?? 'building *goodness*.'
  const tagline =
    cms.heroTagline ??
    'From global partnerships to homegrown leadership, a century of evolving with India while building brands that families trust for generations.'
  const est = cms.establishedMark ?? 'Est. 1920'
  const estYear = est.replace(/[^0-9]/g, '') || '1920'
  const heroImage =
    cms.heroImage ??
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&h=1800&fit=crop&auto=format'

  // staggered rise, motivated as the statement assembling on load
  const rise = (delay: number) =>
    reduce
      ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: EASE, delay },
        }

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col lg:block"
      style={{ backgroundColor: '#FFFFFF', minHeight: '100dvh' }}
    >
      {/* IMAGE — full-bleed right on desktop, top band on mobile; left-wiping curtain reveal */}
      <motion.div
        initial={reduce ? false : { clipPath: 'inset(0 0 0 100%)' }}
        animate={{ clipPath: 'inset(0 0 0 0%)' }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
        className="relative w-full h-[42vh] lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[46%]"
      >
        <motion.div
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.15 }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="JL Morison, a century of building goodness"
            fill
            sizes="(max-width: 1024px) 100vw, 46vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </motion.div>
        {/* left fade — lets the headline overlap the photo and stay legible */}
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 26%)' }}
        />
        {/* top fade — keeps the navbar legible over the photo */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: 120, background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 100%)' }}
        />
      </motion.div>

      {/* COPY — left column, vertically centred on desktop */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-[62%] lg:min-h-[100dvh] px-[7vw] lg:pl-[6vw] lg:pr-10 pt-12 lg:pt-0 pb-14">
        <h1 className={`${cormorant.className}`} style={{ margin: 0 }}>
          <motion.span
            {...rise(0.1)}
            className="block"
            style={{
              fontSize: 'clamp(44px, 5.6vw, 96px)',
              fontWeight: 300,
              lineHeight: 1.02,
              color: INK,
              letterSpacing: '-0.015em',
            }}
          >
            {top}
          </motion.span>
          <motion.span
            {...rise(0.26)}
            className="block"
            style={{
              fontSize: 'clamp(44px, 5.6vw, 96px)',
              fontWeight: 300,
              lineHeight: 1.12,
              color: INK,
              letterSpacing: '-0.015em',
              marginTop: '0.02em',
              paddingBottom: '0.12em',
            }}
          >
            <MaybeItalic>{bottom}</MaybeItalic>
          </motion.span>
        </h1>

        <motion.p
          {...rise(0.45)}
          className={`${cormorant.className} italic mt-8`}
          style={{
            fontSize: 'clamp(17px, 1.4vw, 23px)',
            lineHeight: 1.55,
            fontWeight: 400,
            color: MUTED,
            maxWidth: '44ch',
          }}
        >
          {tagline}
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-12">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden className="block" style={{ height: 1, width: 40, backgroundColor: INK, opacity: 0.5 }} />
            <span
              className={`${dmSans.className} uppercase`}
              style={{ fontSize: 10, letterSpacing: '0.34em', color: MUTED }}
            >
              Established
            </span>
          </div>
          <span
            className={`${anton.className} block`}
            style={{ fontSize: 'clamp(26px, 3vw, 44px)', lineHeight: 1, color: INK, letterSpacing: '0.01em' }}
          >
            {estYear}
          </span>
        </motion.div>
      </div>
    </section>
  )
}

/* ──────────────────── CHAPTERS (interactive) ──────────────────── */

type Chapter = Era & { role?: string }

function ChapterRow({
  chapter,
  active,
  onActivate,
  reduce,
}: {
  chapter: Chapter
  active: boolean
  onActivate: () => void
  reduce: boolean
}) {
  return (
    <div
      style={{
        borderTop: `1px solid ${active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.16)'}`,
        transition: 'border-color 0.45s ease',
      }}
    >
      <button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        aria-expanded={active}
        className="w-full text-left"
        style={{ padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex items-center gap-5 md:gap-8">
          <span
            className={`${anton.className}`}
            style={{
              fontSize: 'clamp(18px, 1.9vw, 28px)',
              color: active ? BEIGE : 'rgba(255,255,255,0.35)',
              lineHeight: 1,
              transition: 'color 0.45s ease',
              minWidth: 40,
            }}
          >
            {chapter.number}
          </span>
          <span
            className={`${dmSans.className} uppercase hidden sm:block`}
            style={{ fontSize: 11, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.55)', minWidth: 128 }}
          >
            {chapter.dateRange}
          </span>
          <span
            className={`${cormorant.className} italic flex-1`}
            style={{
              fontSize: 'clamp(26px, 3.4vw, 48px)',
              lineHeight: 1.04,
              fontWeight: 400,
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              transition: 'color 0.45s ease',
            }}
          >
            {chapter.title}
          </span>
          <span
            aria-hidden
            style={{
              position: 'relative',
              width: 20,
              height: 20,
              flexShrink: 0,
              transform: active ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
              opacity: active ? 0.9 : 0.5,
            }}
          >
            <span style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 1, backgroundColor: '#FFFFFF' }} />
            <span style={{ position: 'absolute', left: '50%', top: 0, height: '100%', width: 1, backgroundColor: '#FFFFFF' }} />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="drawer"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center pb-12 md:pb-14"
              style={{ paddingTop: 4 }}
            >
              {chapter.image && (
                <div className="md:col-span-5">
                  <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: '4 / 5', maxWidth: 340, backgroundColor: BEIGE, borderRadius: 6 }}
                  >
                    <Image
                      src={chapter.image}
                      alt={chapter.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 340px"
                      style={{ objectFit: 'cover' }}
                      {...(chapter.lqip
                        ? { placeholder: 'blur' as const, blurDataURL: chapter.lqip }
                        : {})}
                    />
                  </div>
                </div>
              )}
              <div className={chapter.image ? 'md:col-span-7' : 'md:col-span-12'}>
                {chapter.role && (
                  <div className="flex items-center gap-3 mb-5">
                    <span className="block h-px w-6" style={{ backgroundColor: BEIGE, opacity: 0.6 }} />
                    <span
                      className={`${dmSans.className} uppercase`}
                      style={{ fontSize: 11, letterSpacing: '0.28em', color: BEIGE }}
                    >
                      {chapter.role}
                    </span>
                  </div>
                )}
                <p
                  className={`${dmSans.className}`}
                  style={{
                    fontSize: 'clamp(16px, 1.25vw, 19px)',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.72)',
                    maxWidth: '56ch',
                  }}
                >
                  {chapter.body}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Chapters({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const eyebrow = cms.erasEyebrow ?? 'Five Defining Eras'
  const headline = cms.journeyHeadline ?? 'In a nutshell.'
  const eras = cms.eras && cms.eras.length > 0 ? cms.eras : DEFAULT_ERAS
  const stages = cms.journeyStages && cms.journeyStages.length > 0 ? cms.journeyStages : DEFAULT_STAGES
  const chapters: Chapter[] = eras.map((e, i) => ({ ...e, role: stages[i]?.name }))
  /* Each row opens its own drawer below on hover. We never auto-collapse the
     rows above, so the hovered heading never jumps upward (it just drops its
     content beneath it, the way the first row already does). */
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]))
  const openRow = (i: number) =>
    setOpen((prev) => {
      if (prev.has(i)) return prev
      const next = new Set(prev)
      next.add(i)
      return next
    })

  return (
    <section className="relative w-full" style={{ backgroundColor: INK, padding: '14vh 5vw 12vh' }}>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12 md:mb-16">
          <div>
            <Eyebrow color={BEIGE}>{eyebrow}</Eyebrow>
            <h2
              className={`${cormorant.className} mt-5`}
              style={{
                fontSize: 'clamp(40px, 5.4vw, 84px)',
                lineHeight: 1.02,
                fontWeight: 300,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              <span className="italic">{headline}</span>
            </h2>
          </div>
          <p
            className={`${dmSans.className}`}
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', maxWidth: 280, lineHeight: 1.6 }}
          >
            A century in five chapters. Select one to read it.
          </p>
        </div>

        <div>
          {chapters.map((c, i) => (
            <ChapterRow
              key={`${c.number}-${i}`}
              chapter={c}
              active={open.has(i)}
              onActivate={() => openRow(i)}
              reduce={reduce}
            />
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.16)' }} />
        </div>
      </div>
    </section>
  )
}

/* ──────────────────── PILLARS ──────────────────── */

function Pillars({ cms }: { cms: OurStoryCms }) {
  const eyebrow = cms.pillarsEyebrow ?? 'Five values that guide us'
  const headline = cms.pillarsHeadline ?? 'The next hundred years.'
  const pillars = cms.pillars && cms.pillars.length > 0 ? cms.pillars : DEFAULT_PILLARS

  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', color: INK, padding: '18vh 5vw 14vh' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-16">
          <div>
            <Eyebrow color={INK}>{eyebrow}</Eyebrow>
            <h2
              className={`${cormorant.className} mt-6`}
              style={{
                fontSize: 'clamp(48px, 6vw, 96px)',
                lineHeight: 1.02,
                fontWeight: 300,
                color: INK,
                letterSpacing: '-0.015em',
                margin: 0,
              }}
            >
              <span className="italic">{headline}</span>
            </h2>
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-5 gap-y-12 gap-x-8 border-t"
          style={{ borderColor: 'rgba(17,17,17,0.14)', paddingTop: 36 }}
        >
          {pillars.map((p, i) => (
            <div key={`${p.name}-${i}`} className="relative">
              <div
                className={`${anton.className}`}
                style={{ fontSize: 28, lineHeight: 1, color: INK, letterSpacing: '0.02em' }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3
                className={`${cormorant.className} mt-5`}
                style={{
                  fontSize: 'clamp(20px, 1.6vw, 26px)',
                  lineHeight: 1.2,
                  fontWeight: 500,
                  color: INK,
                  margin: 0,
                }}
              >
                {p.name}
              </h3>
              {p.description && (
                <p
                  className={`${dmSans.className} mt-3`}
                  style={{ fontSize: 13, lineHeight: 1.6, color: INK }}
                >
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────── CLOSING ──────────────────── */

function Closing({ cms }: { cms: OurStoryCms }) {
  const line = cms.closingLine ?? 'Three brands. One promise. Every Indian home.'

  return (
    <section className="relative w-full" style={{ backgroundColor: '#FFFFFF', padding: '18vh 5vw' }}>
      <div className="max-w-[1100px] mx-auto text-center">
        <h2
          className={`${cormorant.className}`}
          style={{
            fontSize: 'clamp(38px, 5vw, 76px)',
            lineHeight: 1.08,
            fontWeight: 300,
            fontStyle: 'italic',
            color: INK,
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {line}
        </h2>

        <div className="mx-auto mt-12" style={{ height: 1, width: 96, backgroundColor: INK, opacity: 0.4 }} />
      </div>
    </section>
  )
}

/* ──────────────────── PAGE ──────────────────── */

export default function OurStoryClient({ cms = {} }: { cms?: OurStoryCms }) {
  return (
    <div className={`${cormorant.variable} ${dmSans.variable} ${anton.variable}`}>
      <Hero cms={cms} />
      <Chapters cms={cms} />
      <Pillars cms={cms} />
      <Closing cms={cms} />
      <Footer />
    </div>
  )
}
