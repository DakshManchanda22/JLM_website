'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { Anton, Caveat_Brush, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'
import type { PhilanthropyView } from '@/sanity/queries'

// Handwritten hero quote — the "Now i've got the support" brush style.
const caveatBrush = Caveat_Brush({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-caveat-brush',
})

// Tall condensed display face for the "PROGRAMS" heading.
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const INK = '#111111'
const BEIGE = '#E8E0D5'
// Project Kaamyaab brand colours, sampled from the logo.
const KB_BLUE = '#2450A4' // royal cobalt of the Devanagari wordmark
const KB_BLUE_DEEP = '#183A7C'
const KB_YELLOW = '#F5B21B' // marigold of the woman figure
const KB_TINT = '#F4F7FC' // faintest blue wash for section backgrounds
const EASE = [0.16, 1, 0.3, 1] as const

// Scales a heading's font-size so it always fits on one line regardless of text length.
function useFitText(maxPx = 200) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fit = () => {
      el.style.fontSize = `${maxPx}px`
      const containerWidth = el.parentElement?.clientWidth ?? el.offsetWidth
      const ratio = containerWidth / el.scrollWidth
      if (ratio < 1) el.style.fontSize = `${Math.floor(maxPx * ratio)}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement ?? el)
    return () => ro.disconnect()
  }, [maxPx])

  return ref
}

type CardImage = { url: string; lqip?: string }

// ─────────────── Code defaults (used until Sanity is filled in) ───────────────

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=2000&q=80&auto=format&fit=crop'
const DIFFERENCE_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop'

const DEFAULT_DIFFERENCE_BODY =
  'Through Project Kaamyaab, JL Morison’s Corporate Philanthropy Program, we ' +
  'provide vocational training to young mothers from lower socio-economic ' +
  'backgrounds — helping them build the skills, confidence, and workplace ' +
  'readiness to re-enter the workforce and create stronger futures for ' +
  'themselves and their families.'

const DEFAULT_PROGRAMS_INTRO =
  'Goodness has always run deeper than what sits on the shelf. Across our ' +
  'factories and the communities around them, we back programmes that create ' +
  'real, lasting change — starting with the families who need it most. Here’s ' +
  'where it begins.'

// The four stages of Project Kaamyaab. Title sits on the card; the lead + body
// read below it, Apple-style.
const DEFAULT_STAGES = [
  {
    title: 'Mobilisation',
    lead: 'Finding them first.',
    body: 'We reach young mothers from lower socio-economic backgrounds in the communities around our centres and welcome them into the programme.',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'Skilling',
    lead: 'A skill for life.',
    body: 'Hands-on vocational training that builds real, job-ready skills — along with the confidence to actually use them.',
    image:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'Placement',
    lead: 'Into the workforce.',
    body: 'We connect graduates with employers and support them into their first roles, turning training into real income.',
    image:
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&q=80&auto=format&fit=crop',
  },
  {
    title: 'Aftercare',
    lead: 'We don’t stop there.',
    body: 'Ongoing mentoring, plus day-care for their children at Turbhe and Bhayandar, so mothers can stay in work and keep growing.',
    image:
      'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80&auto=format&fit=crop',
  },
]

// Five-year milestone numbers (Sanity `impactStats` overrides these).
const DEFAULT_IMPACT_HEADING = 'Five years of Project Kaamyaab'
const DEFAULT_IMPACT_INTRO =
  'Half a decade of skilling, placing and supporting new mothers — and the ' +
  'children who grow up alongside the programme.'
const DEFAULT_IMPACT_STATS = [
  { value: '5', label: 'Years of impact' },
  { value: '1,655', label: 'Women trained' },
  { value: '1,299', label: 'Placed into work' },
  { value: '220+', label: 'Children in childcare' },
]

// Bold every occurrence of "Project Kaamyaab" in the difference paragraph.
function renderWithBrand(text: string) {
  return text.split(/(Project Kaamyaab)/g).map((part, i) =>
    part === 'Project Kaamyaab' ? (
      <strong key={i} style={{ fontWeight: 600, color: KB_BLUE }}>
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function PhilanthropyClient({ cms }: { cms?: PhilanthropyView }) {
  const reduce = useReducedMotion()

  // ── Merge Sanity content over code defaults ──
  const heroLine1 = cms?.heroLine1 ?? 'Changing Lives,'
  const heroLine2 = cms?.heroLine2 ?? 'Building Futures'
  const heroImage = cms?.heroImage ?? HERO_IMAGE
  const heroImageLqip = cms?.heroImageLqip

  const diffLine1 = cms?.differenceHeadingLine1 ?? 'Making a'
  const diffLine2 = cms?.differenceHeadingLine2 ?? 'difference'
  const diffBody = cms?.differenceBody ?? DEFAULT_DIFFERENCE_BODY
  const diffImage = cms?.differenceImage ?? DIFFERENCE_IMAGE
  const diffImageLqip = cms?.differenceImageLqip

  const programsHeading = cms?.programsHeading ?? 'Programs'
  const programsIntro = cms?.programsIntro ?? DEFAULT_PROGRAMS_INTRO
  const programsHeadingRef = useFitText(280)

  const impactLogo = cms?.impactLogo ?? '/project-kaamyaab.png'
  const impactLogoLqip = cms?.impactLogoLqip
  const impactHeading = cms?.impactHeading ?? DEFAULT_IMPACT_HEADING
  const impactIntro = cms?.impactIntro ?? DEFAULT_IMPACT_INTRO
  const impactStats =
    cms?.impactStats && cms.impactStats.length > 0
      ? cms.impactStats.map((s) => ({ value: s.value ?? '', label: s.label ?? '' }))
      : DEFAULT_IMPACT_STATS

  // Build the four cards. Prefer Sanity stages; fall back to code defaults.
  const defaultImageFor = (title?: string): CardImage => {
    const d = DEFAULT_STAGES.find(
      (s) => s.title.toLowerCase() === (title ?? '').toLowerCase()
    )
    return { url: d?.image ?? DEFAULT_STAGES[0].image }
  }

  const stages =
    cms?.stages && cms.stages.length > 0
      ? cms.stages.map((s) => ({
          title: s.title ?? '',
          lead: s.lead ?? '',
          body: s.body ?? '',
          images:
            s.images && s.images.length > 0
              ? (s.images as CardImage[])
              : [defaultImageFor(s.title)],
        }))
      : DEFAULT_STAGES.map((s) => ({
          title: s.title,
          lead: s.lead,
          body: s.body,
          images: [{ url: s.image }] as CardImage[],
        }))

  const heroLines = [heroLine1, heroLine2]

  return (
    <div className={`${caveatBrush.variable} ${dmSans.variable}`}>
      {/* ============================= HERO ============================= */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100svh', backgroundColor: INK }}
      >
        {/* background photo */}
        <motion.div
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="Changing lives through Project Kaamyaab"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
            {...(heroImageLqip
              ? { placeholder: 'blur' as const, blurDataURL: heroImageLqip }
              : {})}
          />
        </motion.div>

        {/* soft dark wash for legibility, heaviest bottom-left where the quote sits */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.10) 100%)',
          }}
        />

        {/* content */}
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-start px-[7vw] pt-[15vh] pb-[12vh]">
          <h1
            className={caveatBrush.className}
            style={{
              margin: 0,
              fontSize: 'clamp(40px, 6.4vw, 118px)',
              lineHeight: 1.08,
              maxWidth: '14ch',
            }}
          >
            {heroLines.map((line, i) => (
              <span
                key={`${line}-${i}`}
                className="block"
                style={{ marginTop: i === 0 ? 0 : '0.14em' }}
              >
                {/* Highlighter sweep: a marigold marker band + ink text are
                    revealed together, left→right, so text always sits on the band. */}
                <motion.span
                  className="relative inline-block"
                  initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ clipPath: 'inset(0 0 0 0)' }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.35 + i * 0.5 }}
                >
                  <span
                    aria-hidden
                    className="absolute rounded-[0.06em]"
                    style={{
                      backgroundColor: BEIGE,
                      top: '0.16em',
                      bottom: '0.08em',
                      left: '-0.07em',
                      right: '-0.07em',
                    }}
                  />
                  <span className="relative" style={{ color: INK }}>
                    {line}
                  </span>
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* ====================== MAKING A DIFFERENCE ====================== */}
      <section id="impact" className="scroll-mt-24 bg-white px-[7vw] py-20 md:py-28 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT — image */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1, ease: EASE }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-[5/4] lg:aspect-[4/5]"
          >
            <Image
              src={diffImage}
              alt="Project Kaamyaab — skilling new mothers to rejoin the workforce"
              fill
              sizes="(max-width: 1024px) 92vw, 46vw"
              style={{ objectFit: 'cover' }}
              {...(diffImageLqip
                ? { placeholder: 'blur' as const, blurDataURL: diffImageLqip }
                : {})}
            />
          </motion.div>

          {/* RIGHT — copy */}
          <div>
            <motion.h2
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: EASE }}
              className={anton.className}
              style={{
                margin: 0,
                color: INK,
                fontSize: 'clamp(40px, 5.4vw, 82px)',
                lineHeight: 0.95,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
              }}
            >
              {diffLine1}
              <br />
              {diffLine2}
              {/* hand-drawn marigold underline flourish */}
              <span
                aria-hidden
                className="mt-3 block"
                style={{ width: 'clamp(160px, 22vw, 300px)', height: 10 }}
              >
                <svg viewBox="0 0 300 12" width="100%" height="100%" fill="none" preserveAspectRatio="none">
                  <path
                    d="M2 8C60 3 130 3 180 6C220 8 270 6 298 4"
                    stroke={KB_YELLOW}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h2>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              className={`${dmSans.className} mt-9`}
              style={{ color: INK }}
            >
              <p style={{ margin: 0, maxWidth: '54ch', fontSize: 'clamp(16px, 1.25vw, 19px)', lineHeight: 1.7 }}>
                {renderWithBrand(diffBody)}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================= PROGRAMS ========================= */}
      <section
        className="px-[5vw] py-24 md:py-32"
        style={{ backgroundColor: KB_BLUE_DEEP, color: '#FFFFFF' }}
      >
        {/* centred header block */}
        <div className="mx-auto max-w-[1180px] text-center">
          <motion.h2
            ref={programsHeadingRef}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.06 }}
            className={anton.className}
            style={{
              margin: 0,
              color: '#FFFFFF',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {programsHeading}
          </motion.h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
            className={dmSans.className}
            style={{
              margin: '1.6em auto 0',
              maxWidth: '58ch',
              color: 'rgba(255,255,255,0.82)',
              fontSize: 'clamp(15px, 1.2vw, 19px)',
              lineHeight: 1.7,
            }}
          >
            {programsIntro}
          </motion.p>
        </div>

        {/* cards */}
        <div className="mx-auto mt-16 grid max-w-[1500px] grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {stages.map((s, i) => (
            <ProgramCard key={`${s.title}-${i}`} stage={s} index={i} reduce={!!reduce} />
          ))}
        </div>
      </section>

      {/* ========================= IMPACT (5 YEARS) ========================= */}
      <ImpactSection
        logo={impactLogo}
        logoLqip={impactLogoLqip}
        heading={impactHeading}
        intro={impactIntro}
        stats={impactStats}
        reduce={!!reduce}
      />

      {/* Light backing so the footer's rounded top corners read as a curve,
          matching the footer everywhere else on the site. */}
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  )
}

// One programme card. Picks a random image from its set on mount, so a
// different photo shows on each visit (starts on image 0 to match SSR).
function ProgramCard({
  stage,
  index,
  reduce,
}: {
  stage: { title: string; lead: string; body: string; images: CardImage[] }
  index: number
  reduce: boolean
}) {
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    if (stage.images.length > 1) {
      setImgIdx(Math.floor(Math.random() * stage.images.length))
    }
  }, [stage.images.length])

  const img = stage.images[imgIdx] ?? stage.images[0]

  return (
    <motion.div
      className="group"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
    >
      {/* image with the stage name at the bottom centre */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/70">
        {img && (
          <Image
            key={img.url}
            src={img.url}
            alt={stage.title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 25vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            {...(img.lqip ? { placeholder: 'blur' as const, blurDataURL: img.lqip } : {})}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <h3
          className={anton.className}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '0.55em',
            textAlign: 'center',
            margin: 0,
            color: '#FFFFFF',
            fontSize: 'clamp(24px, 1.9vw, 34px)',
            lineHeight: 1,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
          }}
        >
          {stage.title}
        </h3>
      </div>

      {/* description below the card */}
      <p
        className={dmSans.className}
        style={{
          margin: '1.1em 0 0',
          fontSize: 16,
          lineHeight: 1.6,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.92)',
        }}
      >
        {stage.lead && (
          <span style={{ color: KB_YELLOW, fontWeight: 700 }}>{stage.lead} </span>
        )}
        {stage.body}
      </p>
    </motion.div>
  )
}

// ─────────────── Impact — five-year milestone numbers ───────────────
// The Project Kaamyaab logo over a light-blue wash, a headline, and a row of
// big counting numbers separated by hairline rules (Apple-metrics style).
function ImpactSection({
  logo,
  logoLqip,
  heading,
  intro,
  stats,
  reduce,
}: {
  logo: string
  logoLqip?: string
  heading: string
  intro: string
  stats: { value: string; label: string }[]
  reduce: boolean
}) {
  // Fire the reveal + count-up as the section approaches from below (positive
  // bottom margin extends the root downward), so the metrics animate while the
  // user is just above the section rather than only once they've reached it.
  const sectionRef = useRef<HTMLElement>(null)
  const started = useInView(sectionRef, { once: true, margin: '0px 0px 20% 0px' })

  return (
    <section
      ref={sectionRef}
      className="px-[7vw] py-20 md:py-28 lg:py-32"
      style={{ backgroundColor: KB_TINT }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* logo + headline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-[760px]"
        >
          <Image
            src={logo}
            alt="Project Kaamyaab"
            width={1208}
            height={423}
            sizes="(max-width: 640px) 340px, 560px"
            className="h-auto w-[340px] sm:w-[460px] md:w-[560px]"
            priority={false}
            {...(logoLqip ? { placeholder: 'blur' as const, blurDataURL: logoLqip } : {})}
          />
          <h2
            className={anton.className}
            style={{
              margin: '1.1em 0 0',
              color: KB_BLUE_DEEP,
              fontSize: 'clamp(34px, 4.6vw, 68px)',
              lineHeight: 0.98,
              letterSpacing: '0.005em',
              textTransform: 'uppercase',
              textWrap: 'balance',
            }}
          >
            {heading}
          </h2>
          {intro && (
            <p
              className={dmSans.className}
              style={{
                margin: '0.9em 0 0',
                maxWidth: '52ch',
                color: '#3F4A5C',
                fontSize: 'clamp(16px, 1.25vw, 19px)',
                lineHeight: 1.7,
              }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        {/* numbers row — counts up on scroll, hairline rules between */}
        <div className="mt-14 grid grid-cols-2 gap-y-12 md:mt-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={`${s.label}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={started || reduce ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              className="px-2 sm:px-6 md:[&:not(:first-child)]:border-l"
              style={{ borderColor: 'rgba(36,80,164,0.18)' }}
            >
              <div
                className={dmSans.className}
                style={{
                  color: KB_BLUE,
                  fontWeight: 700,
                  fontSize: 'clamp(44px, 6vw, 84px)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                <CountUp value={s.value} reduce={reduce} start={started} />
              </div>
              <div
                className={dmSans.className}
                style={{
                  marginTop: '0.7em',
                  color: '#3F4A5C',
                  fontSize: 'clamp(14px, 1.15vw, 17px)',
                  fontWeight: 500,
                  lineHeight: 1.35,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Counts a numeric value up from zero once it scrolls into view. Preserves a
// trailing "+" and formats with Indian digit grouping (1,299 / 1,655).
function CountUp({
  value,
  reduce,
  start,
}: {
  value: string
  reduce: boolean
  /** Begins the count when the parent section comes into view. */
  start: boolean
}) {
  const target = parseInt(value.replace(/[^0-9]/g, '') || '0', 10)
  const suffix = /\+/.test(value) ? '+' : ''
  const [display, setDisplay] = useState(reduce ? target : 0)

  useEffect(() => {
    if (reduce) {
      setDisplay(target)
      return
    }
    if (!start) return
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [start, target, reduce])

  return (
    <span>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}
