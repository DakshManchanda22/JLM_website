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
import InlineVideo from '@/components/InlineVideo'
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

export default function PhilanthropyClient({
  cms,
  video,
}: {
  cms?: PhilanthropyView
  video?: { videoUrl?: string; poster?: string; posterLqip?: string }
}) {
  const reduce = useReducedMotion()

  // ── All content comes from Sanity (Philanthropy document) ──
  const heroLine1 = cms?.heroLine1 ?? ''
  const heroLine2 = cms?.heroLine2 ?? ''
  const heroImage = cms?.heroImage ?? ''
  const heroImageLqip = cms?.heroImageLqip

  const programsHeading = cms?.programsHeading ?? ''
  const programsIntro = cms?.programsIntro ?? ''
  const programsHeadingRef = useFitText(280)

  const impactLogo = cms?.impactLogo ?? ''
  const impactLogoLqip = cms?.impactLogoLqip
  const impactIntro = cms?.impactIntro ?? ''
  const impactStats = (cms?.impactStats ?? []).map((s) => ({
    value: s.value ?? '',
    label: s.label ?? '',
  }))

  const stages = (cms?.stages ?? []).map((s) => ({
    title: s.title ?? '',
    lead: s.lead ?? '',
    body: s.body ?? '',
    images: (s.images ?? []) as CardImage[],
  }))

  const heroLines = [heroLine1, heroLine2]

  // The closing hero sits at the bottom of the page, so its reveal should play
  // when the user actually scrolls to it — not on mount. Drive it off an
  // in-view boolean (the same reliable pattern the Impact stats use).
  const heroRef = useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.35 })

  return (
    <div className={`${caveatBrush.variable} ${dmSans.variable}`}>
      {/* ========================= KAAMYAAB VIDEO (top) ========================= */}
      <section className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
        <InlineVideo
          videoUrl={video?.videoUrl}
          poster={video?.poster}
          posterLqip={video?.posterLqip}
          rounded={false}
        />
      </section>

      {/* ========================= IMPACT (5 YEARS) ========================= */}
      <ImpactSection
        logo={impactLogo}
        logoLqip={impactLogoLqip}
        intro={impactIntro}
        stats={impactStats}
        reduce={!!reduce}
      />

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
              textAlign: 'center',
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

      {/* ===== HERO — "Changing Lives, Building Futures" closing section ===== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: 'calc(100svh - var(--nav-h))', backgroundColor: INK }}
      >
        {/* background photo */}
        <motion.div
          initial={reduce ? false : { scale: 1.08 }}
          animate={reduce || heroInView ? { scale: 1 } : { scale: 1.08 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage}
            alt="Changing lives through Project Kaamyaab"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
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
        <div className="relative z-10 flex h-full flex-col justify-start px-[7vw] pt-[15vh] pb-[10vh]">
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
                  animate={
                    reduce || heroInView
                      ? { clipPath: 'inset(0 0 0 0)' }
                      : { clipPath: 'inset(0 100% 0 0)' }
                  }
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.5 }}
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

      {/* Dark backing so the footer's rounded top corners blend with the closing
          hero above it, rather than showing a bright notch. */}
      <div style={{ backgroundColor: INK }}>
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
  intro,
  stats,
  reduce,
}: {
  logo: string
  logoLqip?: string
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
      id="impact"
      ref={sectionRef}
      className="scroll-mt-24 px-[7vw] pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* logo on the left, intro on the right (stacks + centres on mobile) */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-center md:gap-14 md:text-left lg:gap-20"
        >
          <Image
            src={logo}
            alt="Project Kaamyaab"
            width={1208}
            height={423}
            sizes="(max-width: 640px) 300px, 460px"
            className="h-auto w-[280px] shrink-0 sm:w-[360px] md:w-[420px]"
            priority={false}
            {...(logoLqip ? { placeholder: 'blur' as const, blurDataURL: logoLqip } : {})}
          />
          {intro && (
            <p
              className={dmSans.className}
              style={{
                margin: 0,
                maxWidth: '60ch',
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
