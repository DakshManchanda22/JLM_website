'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Anton, Caveat_Brush, Cormorant_Garamond, DM_Sans } from 'next/font/google'
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

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const BEIGE = '#E8E0D5'
const INK = '#111111'
const EASE = [0.16, 1, 0.3, 1] as const

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

const DEFAULT_PURPOSE_IMAGES: CardImage[] = [
  { url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80&auto=format&fit=crop' },
]

const DEFAULT_BELIEF_TEXT =
  'We believe sustainable growth goes beyond business. By nurturing our ' +
  'environment and empowering our communities, we strive to create a positive ' +
  'impact that lasts.'

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

// Bold every occurrence of "Project Kaamyaab" in the difference paragraph.
function renderWithBrand(text: string) {
  return text.split(/(Project Kaamyaab)/g).map((part, i) =>
    part === 'Project Kaamyaab' ? (
      <strong key={i} style={{ fontWeight: 600 }}>
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
  const ctaLabel = cms?.differenceCtaLabel ?? 'Get involved'
  const ctaHref = cms?.differenceCtaHref ?? '/contact-us'
  const diffImage = cms?.differenceImage ?? DIFFERENCE_IMAGE
  const diffImageLqip = cms?.differenceImageLqip

  const programsHeading = cms?.programsHeading ?? 'Programs'
  const programsIntro = cms?.programsIntro ?? DEFAULT_PROGRAMS_INTRO

  // Build the four cards. Prefer Sanity stages; fall back to code defaults.
  // A stage's images fall back to its default photo (matched by title) when
  // nothing has been uploaded for it yet.
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

  const purposeHeading = cms?.purposeHeading ?? 'Environmental responsibility'
  const purposeImages =
    cms?.purposeImages && cms.purposeImages.length > 0
      ? (cms.purposeImages as CardImage[])
      : DEFAULT_PURPOSE_IMAGES

  const beliefEyebrow = cms?.beliefEyebrow ?? 'Our commitment'
  const beliefText = cms?.beliefText ?? DEFAULT_BELIEF_TEXT

  const heroLines = [heroLine1, heroLine2]

  return (
    <div className={`${caveatBrush.variable} ${cormorant.variable} ${dmSans.variable}`}>
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
            alt="Building goodness beyond the shelf"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
            {...(heroImageLqip
              ? { placeholder: 'blur' as const, blurDataURL: heroImageLqip }
              : {})}
          />
        </motion.div>

        {/* dark wash for legibility, heavier at the bottom-left where the quote sits */}
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
                {/* Highlighter sweep: a beige marker band + ink text are revealed
                    together, left→right, so the text always sits on the band. */}
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
              className={cormorant.className}
              style={{
                margin: 0,
                color: INK,
                fontWeight: 400,
                fontSize: 'clamp(44px, 6vw, 88px)',
                lineHeight: 0.98,
                letterSpacing: '-0.01em',
              }}
            >
              {diffLine1}
              <br />
              {diffLine2}
              {/* hand-drawn beige underline flourish */}
              <span
                aria-hidden
                className="mt-3 block"
                style={{ width: 'clamp(160px, 22vw, 300px)', height: 10 }}
              >
                <svg viewBox="0 0 300 12" width="100%" height="100%" fill="none" preserveAspectRatio="none">
                  <path
                    d="M2 8C60 3 130 3 180 6C220 8 270 6 298 4"
                    stroke={BEIGE}
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

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.24 }}
              className={`${dmSans.className} mt-10 flex flex-wrap justify-center gap-3`}
            >
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 transition-all duration-300 hover:scale-[1.03]"
                style={{
                  backgroundColor: BEIGE,
                  color: INK,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {ctaLabel}
                <span aria-hidden>&hearts;</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================= PROGRAMS ========================= */}
      <section
        className="px-[5vw] py-24 md:py-32"
        style={{ backgroundColor: '#141414', color: '#FFFFFF' }}
      >
        {/* centred header block */}
        <div className="mx-auto max-w-[820px] text-center">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.06 }}
            className={anton.className}
            style={{
              margin: 0,
              color: '#FFFFFF',
              fontSize: 'clamp(64px, 13vw, 200px)',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
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
              color: 'rgba(255,255,255,0.78)',
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

      {/* ========================= PURPOSE COLLAGE ========================= */}
      <PurposeCollage
        heading={purposeHeading}
        images={purposeImages}
        reduce={!!reduce}
      />

      {/* ========================= BELIEF ========================= */}
      <section className="bg-white px-[7vw] pb-24 pt-10 text-center md:pb-32 md:pt-12">
        {beliefEyebrow && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, ease: EASE }}
            className={dmSans.className}
            style={{
              margin: 0,
              color: '#555555',
              fontSize: 'clamp(11px, 1.1vw, 14px)',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            {beliefEyebrow}
          </motion.p>
        )}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
          className={cormorant.className}
          style={{
            margin: '0.7em auto 0',
            maxWidth: 'min(1100px, 100%)',
            color: INK,
            fontWeight: 400,
            fontSize: 'clamp(28px, 4.4vw, 58px)',
            lineHeight: 1.14,
            letterSpacing: '-0.01em',
          }}
        >
          {beliefText}
        </motion.p>
      </section>

      <Footer />
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
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
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
          fontSize: 15,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.62)',
        }}
      >
        {stage.lead && (
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{stage.lead} </span>
        )}
        {stage.body}
      </p>
    </motion.div>
  )
}

// Photo collage: three photos start stacked and, once the section scrolls into
// view (just past the heading), spring out once into a scattered arrangement
// modelled on the reference. A large faded word sits behind them.
const COLLAGE_SPREAD = [
  { x: '-46%', y: '-30%', rotate: -5, z: 20 }, // top-left
  { x: '48%', y: '-6%', rotate: 3, z: 10 }, // right
  { x: '-4%', y: '32%', rotate: -4, z: 30 }, // front, bottom-centre
]

function PurposeCollage({
  heading,
  images,
  reduce,
}: {
  heading: string
  images: CardImage[]
  reduce: boolean
}) {
  const shots = images.slice(0, 3)

  return (
    <section className="overflow-hidden bg-white px-[7vw] pb-8 pt-10 md:pb-12 md:pt-14">
      {/* header */}
      <div className="text-center">
        <h2
          className={anton.className}
          style={{
            margin: '0 auto',
            maxWidth: '15ch',
            color: INK,
            fontSize: 'clamp(34px, 6vw, 92px)',
            lineHeight: 0.98,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          {heading}
        </h2>
      </div>

      {/* collage — one-shot spread animation triggered when it enters view */}
      <motion.div
        className="relative mx-auto mt-6 aspect-[3/2] w-full max-w-[1040px] md:mt-10"
        initial={reduce ? 'spread' : 'stack'}
        whileInView="spread"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* photos */}
        {shots.map((img, i) => {
          const end = COLLAGE_SPREAD[i] ?? COLLAGE_SPREAD[0]
          return (
            <div
              key={img.url}
              className="absolute left-1/2 top-1/2 w-[76%] max-w-[620px] sm:w-[58%]"
              style={{ transform: 'translate(-50%, -50%)', zIndex: end.z }}
            >
              <motion.div
                variants={{
                  stack: { x: '0%', y: '0%', rotate: 0, scale: 0.9 },
                  spread: { x: end.x, y: end.y, rotate: end.rotate, scale: 1 },
                }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden shadow-2xl">
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 76vw, 44vw"
                    style={{ objectFit: 'cover' }}
                    {...(img.lqip
                      ? { placeholder: 'blur' as const, blurDataURL: img.lqip }
                      : {})}
                  />
                </div>
              </motion.div>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}
