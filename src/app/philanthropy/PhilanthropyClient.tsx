'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Anton, Caveat_Brush, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'
import type { PhilanthropyStatCard, PhilanthropyView } from '@/sanity/queries'

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

const BEIGE = '#E8E0D5'
const INK = '#111111'
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

const DEFAULT_PURPOSE_IMAGES: CardImage[] = [
  { url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80&auto=format&fit=crop' },
  { url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&q=80&auto=format&fit=crop' },
]

const DEFAULT_BELIEF_TEXT =
  'We believe sustainable growth goes beyond business. By nurturing our ' +
  'environment and empowering our communities, we strive to create a positive ' +
  'impact that lasts.'

const DEFAULT_ESG_INTRO =
  'At JL Morison, we care for the planet. By adopting eco-friendly practices, we ' +
  'are taking small steps towards a sustainable future. Our initiatives include ' +
  'paper, water and electricity saving through responsible use, tree plantation ' +
  'across our factories — with papaya, mango and other saplings — along with the ' +
  'use of solar energy and rainwater harvesting to help nurture a greener tomorrow.'

const DEFAULT_STATS: PhilanthropyStatCard[] = [
  {
    title: 'Plastic Savings',
    value: '15 MT +',
    body: 'Increased plastic savings through technical packaging innovations — UV laminate, shrink packaging and pallet reuse.',
    tag: 'Environment',
    icon: 'recycle',
  },
  {
    title: 'Green Energy',
    value: '1,27,000',
    body: 'Units of clean, green energy generated directly at the Waluj solar plant.',
    tag: 'Environment',
    icon: 'solarPanel',
  },
  {
    title: 'Gender Parity',
    value: '10%',
    body: 'Women now represent 10% of the JLM team — 40 women, up from just 16 in 2020.',
    tag: 'Social',
    icon: 'people',
  },
  {
    title: 'Community Impact',
    value: '80+',
    body: 'Volunteering programs completed across all regions and factories — supporting elders, children, and blood donation.',
    tag: 'Social',
    icon: 'community',
  },
  {
    title: 'Tree Plantations',
    value: '1000+',
    body: 'Trees planted across all our factories.',
    tag: 'Environment',
    icon: 'leaf',
  },
  {
    title: 'Water Saving',
    value: '1,17,000L',
    body: 'Water saved across factories through rainwater harvesting & spray jets. Water-saving nozzles installed across all JLM offices, leading to a 50% reduction compared to before.',
    tag: 'Environment',
    icon: 'water',
  },
]

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
  const programsHeadingRef = useFitText(200)

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

  const purposeHeading = cms?.purposeHeading ?? 'ESG'
  const purposeImages =
    cms?.purposeImages && cms.purposeImages.length > 0
      ? (cms.purposeImages as CardImage[])
      : DEFAULT_PURPOSE_IMAGES

  const beliefEyebrow = cms?.beliefEyebrow ?? 'Our commitment'
  const beliefText = cms?.beliefText ?? DEFAULT_BELIEF_TEXT
  const statCards =
    cms?.statCards && cms.statCards.length > 0 ? cms.statCards : DEFAULT_STATS
  const esgIntro = cms?.esgIntro ?? DEFAULT_ESG_INTRO
  const esgGallery = cms?.esgGallery ?? []

  // ── Lightbox for the ESG (Pinterest-style) gallery ──
  const [lightboxImg, setLightboxImg] = useState<(typeof esgGallery)[number] | null>(null)

  // Lock body scroll + allow Escape to close while the lightbox is open.
  useEffect(() => {
    if (!lightboxImg) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxImg])

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
          className={dmSans.className}
          style={{
            margin: '0.7em auto 0',
            maxWidth: 'min(1100px, 100%)',
            color: INK,
            fontWeight: 300,
            fontSize: 'clamp(24px, 3.4vw, 44px)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {beliefText}
        </motion.p>

        {/* impact stat tiles — hover / scroll to reveal the description */}
        {statCards.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-6 text-left sm:grid-cols-2 md:mt-20">
            {statCards.map((s, i) => (
              <StatCard key={i} card={s} index={i} reduce={!!reduce} />
            ))}
          </div>
        )}
      </section>

      {/* ========================= ESG PARAGRAPH + GALLERY ========================= */}
      <section className="bg-white px-[7vw] pb-24 md:pb-32">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.9, ease: EASE }}
          className={dmSans.className}
          style={{
            margin: '0 auto',
            maxWidth: '62ch',
            textAlign: 'center',
            color: INK,
            fontWeight: 300,
            fontSize: 'clamp(17px, 1.5vw, 22px)',
            lineHeight: 1.7,
          }}
        >
          {esgIntro}
        </motion.p>

        {esgGallery.length > 0 && (
          <div className="mx-auto mt-14 max-w-[1200px] columns-2 gap-2 sm:columns-3 lg:columns-4 md:mt-16">
            {esgGallery.map((img, i) => (
              <motion.div
                key={img.url}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.05 }}
                className="mb-2 overflow-hidden rounded-xl"
                style={{ breakInside: 'avoid' }}
              >
                <button
                  type="button"
                  onClick={() => setLightboxImg(img)}
                  aria-label="View image full screen"
                  className="group block w-full cursor-zoom-in overflow-hidden rounded-xl"
                >
                  <Image
                    src={img.url}
                    alt=""
                    width={img.w}
                    height={img.h}
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
                    className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    {...(img.lqip
                      ? { placeholder: 'blur' as const, blurDataURL: img.lqip }
                      : {})}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ========================= GALLERY LIGHTBOX ========================= */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              aria-label="Close full screen view"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 sm:right-6 sm:top-6"
              style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <motion.div
              initial={reduce ? false : { scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-full max-w-full items-center justify-center"
            >
              <Image
                src={lightboxImg.url}
                alt=""
                width={lightboxImg.w}
                height={lightboxImg.h}
                sizes="100vw"
                className="block h-auto max-h-[90svh] w-auto max-w-full rounded-lg object-contain"
                {...(lightboxImg.lqip
                  ? { placeholder: 'blur' as const, blurDataURL: lightboxImg.lqip }
                  : {})}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
// view (just past the heading), spring out once into a scattered arrangement.
// A rotating circular stamp sits over the top. Mobile uses a tighter spread so
// nothing runs off-screen or covers the heading.
const COLLAGE_SPREAD = [
  { x: '-46%', y: '-30%', rotate: -5, z: 20 }, // top-left
  { x: '48%', y: '-6%', rotate: 3, z: 10 }, // right
  { x: '-4%', y: '32%', rotate: -4, z: 30 }, // front, bottom-centre
]
const COLLAGE_SPREAD_MOBILE = [
  { x: '-24%', y: '-40%', rotate: -5, z: 20 },
  { x: '24%', y: '-12%', rotate: 5, z: 10 },
  { x: '-2%', y: '34%', rotate: -4, z: 30 },
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
  const [compact, setCompact] = useState(false)
  const headingRef = useFitText(220)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const on = () => setCompact(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const spread = compact ? COLLAGE_SPREAD_MOBILE : COLLAGE_SPREAD

  return (
    <section className="overflow-hidden bg-white px-[7vw] pb-8 pt-10 md:pb-12 md:pt-14">
      {/* header */}
      <div className="text-center">
        <h2
          ref={headingRef}
          className={anton.className}
          style={{
            margin: '0 auto',
            color: INK,
            lineHeight: 0.98,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {heading}
        </h2>
      </div>

      {/* collage — one-shot spread animation triggered when it enters view */}
      <motion.div
        className="relative mx-auto mt-8 aspect-square w-full max-w-[1040px] sm:aspect-[3/2] md:mt-10"
        initial={reduce ? 'spread' : 'stack'}
        whileInView="spread"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* photos */}
        {shots.map((img, i) => {
          const end = spread[i] ?? spread[0]
          return (
            <div
              key={img.url}
              className="absolute left-1/2 top-1/2 w-[66%] max-w-[620px] sm:w-[56%]"
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
                    sizes="(max-width: 640px) 66vw, 44vw"
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

// Line icons for the impact grid. Stroke follows the tile's text colour.
function ImpactIcon({ name, size = 76 }: { name?: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'solar':
      return (
        <svg {...common} aria-hidden>
          <circle cx="24" cy="24" r="8" />
          <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5 37 37M37 11l-3.5 3.5M14.5 33.5 11 37" />
        </svg>
      )
    case 'water':
      return (
        <svg {...common} aria-hidden>
          <path d="M7 17c3.5-4 6.5-4 10 0s6.5 4 10 0 6.5-4 10 0" />
          <path d="M7 26c3.5-4 6.5-4 10 0s6.5 4 10 0 6.5-4 10 0" />
          <path d="M7 35c3.5-4 6.5-4 10 0s6.5 4 10 0 6.5-4 10 0" />
        </svg>
      )
    case 'people':
      return (
        <svg {...common} aria-hidden>
          <circle cx="18" cy="18" r="5" />
          <circle cx="32" cy="19" r="4" />
          <path d="M9 36c0-6 4-9 9-9s9 3 9 9" />
          <path d="M28 27c5 0 9 3 9 9" />
        </svg>
      )
    case 'hands':
      return (
        <svg {...common} aria-hidden>
          <path d="M24 37S11 29 11 20a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 9-13 17-13 17Z" />
        </svg>
      )
    case 'skill':
      return (
        <svg {...common} aria-hidden>
          <path d="M24 7l3.6 12.4L40 23l-12.4 3.6L24 39l-3.6-12.4L8 23l12.4-3.6z" />
        </svg>
      )
    case 'recycle':
      return (
        <svg {...common} aria-hidden>
          <path d="M14 19a11 11 0 0 1 18-3" />
          <path d="M32 11v5h-5" />
          <path d="M34 29a11 11 0 0 1-18 4" />
          <path d="M16 37v-5h5" />
        </svg>
      )
    case 'solarPanel':
      return (
        <svg {...common} aria-hidden>
          <path d="M12 35l3-11h14l3 11z" />
          <path d="M14.5 30h17M20 24v11M25.5 35l-1-11" />
          <circle cx="34" cy="13" r="3" />
          <path d="M34 7v2M34 17v1M28 13h2M39 13h1M30 9l1 1M38 9l-1 1" />
        </svg>
      )
    case 'community':
      return (
        <svg {...common} aria-hidden>
          <circle cx="24" cy="13" r="3.2" />
          <circle cx="15" cy="18" r="2.6" />
          <circle cx="33" cy="18" r="2.6" />
          <path d="M11 38c1-6 4-9 6-10M37 38c-1-6-4-9-6-10M18 38c1-7 4-10 6-10s5 3 6 10" />
        </svg>
      )
    case 'leaf':
    default:
      return (
        <svg {...common} aria-hidden>
          <path d="M12 36c0-14 10-24 24-24 0 14-10 24-24 24Z" />
          <path d="M20 34C24 28 30 22 34 18" />
        </svg>
      )
  }
}

// A stat card: title + big number always visible; the description is revealed on
// hover (pointer devices) or when the card scrolls to centre (touch devices).
function StatCard({
  card,
  index,
  reduce,
}: {
  card: PhilanthropyStatCard
  index: number
  reduce: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const touch =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
    setIsTouch(touch)
    if (!touch) return
    const el = ref.current
    if (!el) return
    // Reveal while the card sits in the middle band of the viewport.
    const io = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      { rootMargin: '-38% 0px -38% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const open = reduce || revealed

  // Checker pattern of ink / beige tiles across a 2-column grid.
  const col = index % 2
  const row = Math.floor(index / 2)
  const dark = (col + row) % 2 === 0
  const bg = dark ? '#141414' : BEIGE
  const fg = dark ? '#FFFFFF' : INK
  const soft = dark ? 'rgba(255,255,255,0.72)' : 'rgba(17,17,17,0.62)'
  const chipBg = dark ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,17,0.07)'

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.08 }}
      onMouseEnter={() => !isTouch && setRevealed(true)}
      onMouseLeave={() => !isTouch && setRevealed(false)}
      className="flex flex-col rounded-3xl p-7 sm:p-8"
      style={{ backgroundColor: bg, color: fg, minHeight: 210 }}
    >
      {/* title + tag */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={dmSans.className}
          style={{
            margin: 0,
            color: fg,
            fontWeight: 700,
            fontSize: 'clamp(20px, 1.9vw, 28px)',
            lineHeight: 1.1,
          }}
        >
          {card.title}
        </h3>
        {card.tag && (
          <span
            className={dmSans.className}
            style={{
              flexShrink: 0,
              borderRadius: 999,
              padding: '4px 11px',
              backgroundColor: chipBg,
              color: fg,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {card.tag}
          </span>
        )}
      </div>

      {/* value + icon */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <span
          className={dmSans.className}
          style={{
            color: fg,
            fontWeight: 700,
            fontSize: 'clamp(38px, 4.4vw, 58px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {card.value}
        </span>
        <span aria-hidden style={{ color: fg, flexShrink: 0, lineHeight: 0, opacity: 0.9 }}>
          <ImpactIcon name={card.icon} size={54} />
        </span>
      </div>

      {/* description — revealed on hover / scroll-over */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ overflow: 'hidden' }}
      >
        <p
          className={dmSans.className}
          style={{
            margin: '0.9em 0 0',
            color: soft,
            fontSize: 'clamp(15px, 1.2vw, 17px)',
            lineHeight: 1.6,
          }}
        >
          {card.body}
        </p>
      </motion.div>
    </motion.div>
  )
}
