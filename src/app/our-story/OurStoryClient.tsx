'use client'

import type { ReactNode } from 'react'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { motion, useReducedMotion } from 'framer-motion'
import Footer from '@/components/Footer'
import InlineVideo from '@/components/InlineVideo'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

/* ─────────────── palette ─────────────── */
const INK = '#111111'
const MUTED = '#555555'
const HAIRLINE = '#E6E2D9'

/* Five sequential era tones — navy → teal → moss → ochre → plum. Darkened from
   the reference so every one clears 4.5:1 on white and stays legible as small
   label text, while still reading as its hue. */
const TONES = ['#16324F', '#14706F', '#55731D', '#8F5B0C', '#5F3F82'] as const

const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────────── types (Sanity-editable) ─────────────── */

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
  videoUrl?: string
  videoPoster?: string
  videoPosterLqip?: string
  journeyEyebrow?: string
  journeyHeadline?: string
  journeyStages?: JourneyStage[]
  erasEyebrow?: string
  erasHeadline?: string
  eras?: Era[]
  pillars?: Pillar[]
  closingLine?: string
  closingSubline?: string
  signatureName?: string
  signatureNote?: string
}

/* ─────────────── icons ─────────────── */

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </svg>
  )
}

const STEP_ICONS: ReactNode[] = [
  <path key="d" d="M3 17h18M4 17l1.5-8h13L20 17M9 9V6a3 3 0 013-3 3 3 0 013 3v3" />,
  <path key="d" d="M8 12l3 3 6-7M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />,
  <path key="d" d="M3 21V10l6-4 6 4v11M15 21V13l6-3v11H15z" />,
  <path key="d" d="M12 2l2.4 5.5L20 8.3l-4 4 1 6-5-2.8-5 2.8 1-6-4-4 5.6-.8z" />,
  <path key="d" d="M4 19h16M6 19V9l4-3 4 3v10M14 19v-6l3-2 3 2v6" />,
]

const VALUE_ICONS: ReactNode[] = [
  <path key="d" d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
  <path key="d" d="M12 21s-8-4.5-8-11a4 4 0 018-1 4 4 0 018 1c0 6.5-8 11-8 11z" />,
  <g key="d">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </g>,
  <path key="d" d="M4 20c8-1 12-6 12-14 0 0-9 0-12 6-2 4-1 6 0 8z" />,
  <g key="d">
    <circle cx="9" cy="8" r="3" />
    <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M17 8a3 3 0 100 6M22 20c0-2.8-1.9-5-4.5-5.7" />
  </g>,
]

/* ─────────────── small bits ─────────────── */

/** Renders text with *asterisk-wrapped* segments turned italic in `color`. */
function Emphasis({ text, color }: { text: string; color: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') ? (
          <em key={i} style={{ fontStyle: 'italic', color }}>
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-11 flex items-baseline gap-4 md:mb-16 md:gap-5">
      <h2
        className={cormorant.className}
        style={{
          margin: 0,
          fontStyle: 'italic',
          fontWeight: 500,
          fontSize: 'clamp(24px, 3vw, 34px)',
          letterSpacing: '-0.01em',
          color: INK,
        }}
      >
        {children}
      </h2>
      <span aria-hidden className="h-px flex-1" style={{ backgroundColor: HAIRLINE }} />
    </div>
  )
}

/* ────────────────────────── INTRO ────────────────────────── */

function StoryVideo({ cms }: { cms: OurStoryCms }) {
  return (
    <section className="w-full bg-white px-6 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto max-w-[1100px]">
        <InlineVideo
          videoUrl={cms.videoUrl}
          poster={cms.videoPoster}
          posterLqip={cms.videoPosterLqip}
        />
      </div>
    </section>
  )
}

function Intro({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const headline = cms.headlineTop ?? ''
  const tagline = cms.heroTagline ?? ''

  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        }

  return (
    <section className="w-full bg-white px-6 pb-16 pt-12 text-center md:px-8 md:pb-20 md:pt-16">
      <div className="mx-auto max-w-[820px]">
        <motion.h1
          {...rise(0.1)}
          className={cormorant.className}
          style={{
            margin: '0 auto',
            maxWidth: '18ch',
            fontSize: 'clamp(36px, 5.2vw, 64px)',
            fontWeight: 500,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: INK,
            textWrap: 'balance',
          }}
        >
          <Emphasis text={headline} color={TONES[1]} />
        </motion.h1>
        <motion.p
          {...rise(0.24)}
          className={dmSans.className}
          style={{
            margin: '28px auto 0',
            maxWidth: '58ch',
            fontSize: 'clamp(15.5px, 1.3vw, 17px)',
            lineHeight: 1.75,
            color: MUTED,
            textWrap: 'pretty',
          }}
        >
          {tagline}
        </motion.p>
      </div>
    </section>
  )
}

/* ────────────────────────── JOURNEY (stepper) ────────────────────────── */

function Journey({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const stages = (cms.journeyStages ?? []).slice(0, 5)

  return (
    <section className="w-full bg-white px-6 pb-24 pt-4 md:px-8 md:pb-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionLabel>{cms.journeyHeadline ?? ''}</SectionLabel>

        <div className="relative md:mt-8">
          {/* Connecting thread — runs between the first and last dot centres
              (each column is 20% wide, so 10% → 90%). Sits behind the dots,
              which carry a white ring so the line reads as passing behind. */}
          <div
            aria-hidden
            className="absolute hidden md:block"
            style={{
              top: 6,
              left: '10%',
              right: '10%',
              height: 2,
              opacity: 0.6,
              background: `linear-gradient(90deg, ${TONES.join(', ')})`,
            }}
          />

          <ol className="m-0 grid list-none grid-cols-1 gap-9 p-0 md:grid-cols-5 md:gap-0">
            {stages.map((s, i) => {
              const tone = TONES[i % TONES.length]
              return (
                <motion.li
                  key={`${s.name}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : i * 0.09 }}
                  className="relative flex items-center gap-5 text-left md:flex-col md:items-center md:gap-0 md:text-center"
                >
                  <span
                    aria-hidden
                    className="relative shrink-0 rounded-full"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: tone,
                      boxShadow: `0 0 0 6px #fff, 0 0 0 7px ${HAIRLINE}`,
                    }}
                  >
                    {/* Period date, sat above the dot on the desktop track. */}
                    {s.period && (
                      <span
                        className={`${dmSans.className} absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap md:block`}
                        style={{
                          bottom: 'calc(100% + 12px)',
                          fontSize: 13,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          color: tone,
                        }}
                      >
                        {s.period}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden
                    className="flex shrink-0 items-center justify-center rounded-full md:mt-6"
                    style={{ width: 46, height: 46, border: `1px solid ${HAIRLINE}`, color: tone, padding: 12 }}
                  >
                    <Svg>{STEP_ICONS[i % STEP_ICONS.length]}</Svg>
                  </span>
                  {/* On desktop this wrapper collapses (display:contents) so the name
                      stays a direct flex-col child; on mobile the date sits above the name. */}
                  <span className="flex flex-col md:contents">
                    {s.period && (
                      <span
                        className={`${dmSans.className} md:hidden`}
                        style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: tone, marginBottom: 2 }}
                      >
                        {s.period}
                      </span>
                    )}
                    <span
                      className={dmSans.className}
                      style={{ marginTop: 0, fontSize: 15, fontWeight: 700, letterSpacing: '0.01em', color: INK }}
                    >
                      {s.name}
                    </span>
                  </span>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────── ERAS (timeline) ────────────────────────── */

function Eras({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const eras = (cms.eras ?? []).slice(0, 5)

  return (
    <section className="w-full bg-white px-6 pb-24 pt-4 md:px-8 md:pb-28">
      <div className="mx-auto max-w-[1100px]">
        <SectionLabel>{cms.erasHeadline ?? ''}</SectionLabel>

        <div>
          {eras.map((e, i) => {
            const tone = TONES[i % TONES.length]
            const last = i === eras.length - 1
            return (
              <motion.div
                key={`${e.number}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="grid grid-cols-1 gap-x-7 gap-y-2 py-8 md:grid-cols-[76px_1fr] md:py-9"
                style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: last ? `1px solid ${HAIRLINE}` : undefined }}
              >
                <div
                  className={cormorant.className}
                  style={{ fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(38px, 4vw, 56px)', lineHeight: 1, color: tone }}
                >
                  {e.number}
                </div>
                <div>
                  <div
                    className={`${dmSans.className} uppercase`}
                    style={{ marginBottom: 8, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.16em', color: tone }}
                  >
                    {e.dateRange}
                  </div>
                  <h3
                    className={cormorant.className}
                    style={{ margin: '0 0 10px', fontSize: 'clamp(21px, 2.2vw, 26px)', fontWeight: 600, lineHeight: 1.2, color: INK }}
                  >
                    {e.title}
                  </h3>
                  <p
                    className={dmSans.className}
                    style={{ margin: 0, maxWidth: '62ch', fontSize: 15.5, lineHeight: 1.7, color: MUTED, textWrap: 'pretty' }}
                  >
                    {e.body}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────── PULL QUOTE ────────────────────────── */

function PullQuote({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const quote = cms.closingLine ?? ''

  return (
    <section className="w-full bg-white px-6 pb-24 md:px-8 md:pb-28">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative grid grid-cols-1 items-center gap-8 overflow-hidden md:grid-cols-[auto_1fr_auto] md:gap-9"
          style={{
            backgroundColor: INK,
            color: '#FBFAF7',
            borderRadius: '24px 24px 96px 24px',
            padding: 'clamp(40px, 6vw, 66px) clamp(28px, 5vw, 58px)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(600px 300px at 90% 115%, rgba(95,63,130,0.4), transparent 70%)' }}
          />
          <span
            aria-hidden
            className="relative flex shrink-0 items-center justify-center rounded-full"
            style={{ width: 52, height: 52, border: '1px solid rgba(251,250,247,0.28)', color: '#FBFAF7', padding: 14 }}
          >
            <Svg>{VALUE_ICONS[1]}</Svg>
          </span>
          <p
            className={cormorant.className}
            style={{
              position: 'relative',
              margin: 0,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(20px, 2.4vw, 27px)',
              lineHeight: 1.5,
            }}
          >
            {quote}
          </p>
          {(cms.signatureName || cms.signatureNote) && (
            <div className="relative md:text-right">
              {cms.signatureName && (
                <div className={cormorant.className} style={{ fontSize: 22, letterSpacing: '0.04em' }}>
                  {cms.signatureName}
                </div>
              )}
              {cms.signatureNote && (
                <div
                  className={`${dmSans.className} uppercase`}
                  style={{ marginTop: 4, fontSize: 11, letterSpacing: '0.2em', color: 'rgba(251,250,247,0.62)' }}
                >
                  {cms.signatureNote}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────── VALUES ────────────────────────── */

function Values({ cms }: { cms: OurStoryCms }) {
  const reduce = useReducedMotion() ?? false
  const values = (cms.pillars ?? []).slice(0, 5)

  return (
    <section className="w-full bg-white px-6 pb-28 md:px-8 md:pb-36">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center landscape:flex-row landscape:flex-wrap landscape:justify-center md:landscape:justify-between"
          style={{ borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}
        >
          {values.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className={`${dmSans.className} flex items-center gap-2.5 border-l-0 px-5 py-6 md:landscape:border-l md:landscape:border-[#E6E2D9] md:landscape:py-7 md:landscape:first:border-l-0`}
              style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: '0.01em', color: INK }}
            >
              <span aria-hidden className="shrink-0" style={{ width: 18, height: 18, color: INK }}>
                <Svg>{VALUE_ICONS[i % VALUE_ICONS.length]}</Svg>
              </span>
              {p.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────── PAGE ────────────────────────── */

export default function OurStoryClient({ cms = {} }: { cms?: OurStoryCms }) {
  return (
    <div className={`${cormorant.variable} ${dmSans.variable} bg-white`}>
      <StoryVideo cms={cms} />
      <Intro cms={cms} />
      <Journey cms={cms} />
      <Eras cms={cms} />
      <PullQuote cms={cms} />
      <Values cms={cms} />
      <Footer />
    </div>
  )
}
