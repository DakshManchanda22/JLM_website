'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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
  heroLine1?: string
  heroLine2?: string
  heroCaptionSmall?: string
  heroCaptionLarge?: string
  anchors?: { num: string; label: string; targetId: string; image: string }[]
  captionStrip?: { src: string; caption: string }[]
  peopleLabel?: string
  peopleHeadline?: string
  peopleTagline?: string
  peopleBody?: string
  arentEyebrow?: string
  arentHeadline?: string
  arentBody?: string
  arentList?: { word: string; caption: string; icon: string }[]
  areList?: { word: string; caption: string; icon: string }[]
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

const BEIGE = '#E8E0D5'
const INK = '#111111'
const MUTED = '#555555'
const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────────────────────── data ─────────────────────────── */

const DEFAULT_AINT_LIST = [
  { word: 'corporate', caption: 'stiff, formal', icon: '🪑' },
  { word: 'showy', caption: 'loud, flashy', icon: '🎺' },
  { word: 'siloed', caption: 'closed, guarded', icon: '🧱' },
]

const DEFAULT_ARE_LIST = [
  { word: 'Considered', caption: 'thoughtful, deliberate', icon: '🧭' },
  { word: 'Curious', caption: 'always learning', icon: '🔎' },
  { word: 'Generous', caption: 'time, credit, knowledge', icon: '🤝' },
  { word: 'Patient', caption: 'good things take time', icon: '⏳' },
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${dmSans.className} uppercase tracking-[0.22em] text-[11px] font-medium`}
      style={{ color: MUTED }}
    >
      {children}
    </div>
  )
}

function Sporting({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`${cormorant.className} italic`}
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

/* slower staggered reveal — each photo pops in with a ~900ms wait */
const INTRO_DELAYS_MS = [200, 1100, 2000, 2900, 3800, 4700]
const FINAL_FADE_IN_MS = 5800
const CURTAIN_LIFT_MS = 7000
const CURTAIN_DURATION_MS = 1500

function IntroCurtain({ onDone }: { onDone: () => void }) {
  const cms = useLife()
  const cmsSrcs = cms.introImages?.map((i) => i.url).filter(Boolean) as string[] | undefined
  const SRCS =
    cmsSrcs && cmsSrcs.length > 0
      ? // pad/truncate to 6 to keep the layout array aligned
        Array.from({ length: 6 }, (_, i) => cmsSrcs[i % cmsSrcs.length])
      : DEFAULT_INTRO_SRCS
  const FINAL_SRC = cms.introFinalImage ?? DEFAULT_INTRO_FINAL_SRC

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
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 40,
        backgroundColor: BEIGE,
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
        {INTRO_LAYOUT.map((img, i) => (
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
              src={SRCS[i]}
              alt=""
              fill
              priority={i < 3}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            {/* subtle warm tint to bind the stack */}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(232,224,213,0.18)' }} />
          </div>
        ))}
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
     in once the curtain begins lifting — timed to the curtain. */
  const HERO_REVEAL_DELAY = CURTAIN_LIFT_MS / 1000 + 0.5 // headline rises as curtain pulls away

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
        backgroundColor: BEIGE,
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
            className={`${cormorant.className} italic text-center`}
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
          className={`${cormorant.className} italic mt-2 text-center max-w-[44ch]`}
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
    (it, i) => ({ src: it.src, caption: it.caption, offset: i % 2 === 0 ? 0 : 64 }),
  )
  return (
    <section
      className="relative w-full px-[6vw] py-[12vh] grid grid-cols-1 md:grid-cols-2 gap-x-[6vw] gap-y-16"
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
            style={{ borderRadius: 16, aspectRatio: '4 / 5', backgroundColor: BEIGE }}
          >
            <Image src={it.src} alt={it.caption} fill sizes="(max-width: 768px) 90vw, 42vw" style={{ objectFit: 'cover' }} />
          </div>
          <p
            className={`${cormorant.className} italic mt-4`}
            style={{ fontSize: 20, color: MUTED, fontWeight: 400 }}
          >
            {it.caption}
          </p>
        </motion.div>
      ))}
    </section>
  )
}

/* ─────────────────── /1 PEOPLE block ─────────────────── */

function PeopleBlock() {
  const cms = useLife()
  const LABEL = cms.peopleLabel ?? '/1 People'
  const HEADLINE = cms.peopleHeadline ?? 'A team that shows up — for each other, and for the families we serve.'
  const TAGLINE = cms.peopleTagline ?? 'No titles, no posturing — just craft. 🌱'
  const BODY =
    cms.peopleBody ??
    'Some of us have been here for decades. Some joined last year. What we share is harder to put on a CV — a quiet patience with the work, respect for the next person’s craft, and a real belief that good products are built by good teams.'
  return (
    <section
      id="people"
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '14vh 6vw' }}
    >
      <div className="max-w-[820px] mx-auto text-center">
        <SectionLabel>{LABEL}</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className={`${cormorant.className} mt-6`}
          style={{
            fontSize: 'clamp(40px, 5.4vw, 80px)',
            lineHeight: 1.04,
            fontWeight: 300,
            color: INK,
          }}
        >
          {HEADLINE}
        </motion.h2>
        <div className="mt-6">
          <Sporting>{TAGLINE}</Sporting>
        </div>
        <p
          className={`${dmSans.className} mt-6 max-w-[58ch] mx-auto`}
          style={{ color: MUTED, fontSize: 15, lineHeight: 1.7 }}
        >
          {BODY}
        </p>
      </div>
    </section>
  )
}

/* ──────────── ARE / AREN'T strikethrough block ──────────── */

function StrikeRow({ word, caption, icon }: { word: string; caption: string; icon: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref} className="relative">
      <SectionLabel>We aren’t</SectionLabel>
      <div className="relative mt-2 inline-block">
        <h3
          className={`${cormorant.className} italic`}
          style={{
            fontSize: 'clamp(40px, 5.4vw, 84px)',
            color: INK,
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          {word}
        </h3>
        {/* strikethrough line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="absolute left-0 right-0"
          style={{
            top: '52%',
            height: 2,
            backgroundColor: INK,
            transformOrigin: 'left center',
          }}
        />
      </div>
      <div
        className={`${dmSans.className} mt-3`}
        style={{ color: MUTED, fontSize: 13, letterSpacing: '0.02em' }}
      >
        <span className="mr-2">{icon}</span>
        <span style={{ textDecoration: 'line-through' }}>{caption}</span>
      </div>
    </div>
  )
}

function AreRow({ word, caption, icon }: { word: string; caption: string; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <SectionLabel>We are</SectionLabel>
      <h3
        className={`${dmSans.className} mt-2`}
        style={{
          fontSize: 'clamp(34px, 4.4vw, 64px)',
          color: INK,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1.04,
        }}
      >
        {word}
      </h3>
      <div
        className={`${dmSans.className} mt-3`}
        style={{ color: MUTED, fontSize: 13 }}
      >
        <span className="mr-2">{icon}</span>
        {caption}
      </div>
    </motion.div>
  )
}

function AreArentBlock() {
  const cms = useLife()
  const EYEBROW = cms.arentEyebrow ?? 'Not your average company'
  const HEADLINE = cms.arentHeadline ?? 'What we are — and what we’re not.'
  const BODY =
    cms.arentBody ??
    'A hundred years has taught us as much about what to avoid as what to chase. We try to be honest about both.'
  const AINT_LIST = cms.arentList && cms.arentList.length > 0 ? cms.arentList : DEFAULT_AINT_LIST
  const ARE_LIST = cms.areList && cms.areList.length > 0 ? cms.areList : DEFAULT_ARE_LIST
  return (
    <section
      className="relative w-full"
      style={{ backgroundColor: INK, color: '#FFFFFF', padding: '16vh 6vw' }}
    >
      <div className="max-w-[820px]">
        <p
          className={`${dmSans.className} uppercase tracking-[0.22em]`}
          style={{ fontSize: 11, color: '#FFFFFF', opacity: 0.65 }}
        >
          {EYEBROW}
        </p>
        <h2
          className={`${cormorant.className} mt-5`}
          style={{
            fontSize: 'clamp(42px, 5.6vw, 86px)',
            lineHeight: 1.04,
            color: '#FFFFFF',
            fontWeight: 300,
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

      <div
        className="mt-[10vh] grid gap-x-10 gap-y-14"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', color: '#FFFFFF' }}
      >
        {AINT_LIST.map((it) => (
          <StrikeRow key={it.word} {...it} />
        ))}
      </div>

      <div className="mt-[14vh] grid gap-x-10 gap-y-14" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {ARE_LIST.map((it) => (
          <AreRow key={it.word} {...it} />
        ))}
      </div>
    </section>
  )
}

/* ────────── /2 VALUES — hover-driven list + image ────────── */

function ValuesBlock() {
  const cms = useLife()
  const LABEL = cms.valuesLabel ?? '/2 Values'
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
        <SectionLabel>{LABEL}</SectionLabel>
        <h2
          className={`${cormorant.className} mt-6`}
          style={{
            fontSize: 'clamp(40px, 5.4vw, 80px)',
            lineHeight: 1.04,
            fontWeight: 300,
            color: INK,
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
                style={{ borderTop: `1px solid ${isActive ? INK : BEIGE}`, transition: 'border-color 300ms' }}
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
                        className={`${cormorant.className}`}
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
          <div style={{ borderTop: `1px solid ${BEIGE}` }} />
        </div>

        {/* image reveal */}
        <div className="md:col-span-5 md:sticky md:top-24 self-start">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '3 / 4', borderRadius: 18, backgroundColor: BEIGE }}
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
              className={`${cormorant.className} italic absolute bottom-5 left-5`}
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

/* ───────────────── /3 WORKPLACE block ───────────────── */

function WorkplaceBlock() {
  const cms = useLife()
  const LABEL = cms.workplaceLabel ?? '/3 Workplace'
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
      style={{ backgroundColor: BEIGE, padding: '14vh 6vw' }}
    >
      <div className="max-w-[820px]">
        <SectionLabel>{LABEL}</SectionLabel>
        <h2
          className={`${cormorant.className} mt-6`}
          style={{
            fontSize: 'clamp(40px, 5.4vw, 80px)',
            lineHeight: 1.04,
            fontWeight: 300,
            color: INK,
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

/* ───────────────── /4 TOGETHER block ───────────────── */

function TogetherBlock() {
  const cms = useLife()
  const LABEL = cms.togetherLabel ?? '/4 Together'
  const HEADLINE = cms.togetherHeadline ?? 'Three brands. One company. Many hands.'
  const TAGLINE = cms.togetherTagline ?? 'And a hundred-year-old habit of doing it together.'
  const BODY =
    cms.togetherBody ??
    'The R&D chemist who refuses to ship a formula that isn’t quite right. The salesperson who knows the shopkeeper by name. The designer obsessing over the spacing of a single line on a Baby Dreams box. None of it works alone, and none of us pretends it does.'
  const DEFAULT_BRANDS = [
    { name: 'Morisons Baby Dreams', tag: 'Baby care, with care.' },
    { name: 'Emoform', tag: 'A quieter kind of confidence.' },
    { name: 'Bigen', tag: 'Heritage colour, simply done.' },
  ]
  const BRANDS =
    cms.togetherBrands && cms.togetherBrands.length > 0
      ? cms.togetherBrands
      : DEFAULT_BRANDS
  const CLOSING_MARK = cms.togetherClosingMark ?? 'end <life at jlm>'
  const CLOSING_LINE =
    cms.togetherClosingLine ?? 'Want to build the next hundred years with us?'
  const CTA_LABEL = cms.togetherCtaLabel ?? 'Get in touch'
  const CTA_HREF = cms.togetherCtaHref ?? '/contact-us'

  return (
    <section
      id="together"
      className="relative w-full"
      style={{ backgroundColor: '#FFFFFF', padding: '14vh 6vw' }}
    >
      <div className="max-w-[820px]">
        <SectionLabel>{LABEL}</SectionLabel>
        <h2
          className={`${cormorant.className} mt-6`}
          style={{
            fontSize: 'clamp(40px, 5.4vw, 80px)',
            lineHeight: 1.04,
            fontWeight: 300,
            color: INK,
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

      <div className="mt-[10vh] grid grid-cols-1 md:grid-cols-3 gap-6">
        {BRANDS.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            className="relative p-7"
            style={{
              border: `1px solid ${BEIGE}`,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
            }}
          >
            <span
              className={`${dmSans.className}`}
              style={{ color: MUTED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Brand
            </span>
            <h3
              className={`${cormorant.className} mt-3`}
              style={{ color: INK, fontSize: 28, fontWeight: 400, lineHeight: 1.15 }}
            >
              {b.name}
            </h3>
            <p
              className={`${cormorant.className} italic mt-3`}
              style={{ color: MUTED, fontSize: 18, fontWeight: 400 }}
            >
              {b.tag}
            </p>
          </motion.div>
        ))}
      </div>

      {/* closing line */}
      <div className="mt-[16vh] flex flex-col items-center text-center">
        <span
          className={`${dmSans.className} uppercase tracking-[0.24em]`}
          style={{ fontSize: 11, color: MUTED }}
        >
          {CLOSING_MARK}
        </span>
        <div
          className="mt-6 w-[40vw] max-w-[400px]"
          style={{ height: 1, backgroundColor: BEIGE }}
        />
        <p
          className={`${cormorant.className} italic mt-8 max-w-[44ch]`}
          style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', color: INK, fontWeight: 400, lineHeight: 1.45 }}
        >
          {CLOSING_LINE}
        </p>
        <a
          href={CTA_HREF}
          className={`${dmSans.className} mt-8 inline-block`}
          style={{
            border: `1px solid ${INK}`,
            color: INK,
            fontSize: 13,
            padding: '14px 28px',
            borderRadius: 999,
            letterSpacing: '0.05em',
          }}
        >
          {CTA_LABEL}
        </a>
      </div>
    </section>
  )
}

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function LifeAtJlmClient({ cms = {} }: { cms?: LifeCms }) {
  const [introDone, setIntroDone] = useState(false)

  /* keep page-scroller behaviour from layout (smooth scroll for anchors) */
  useEffect(() => {
    const root = document.getElementById('page-scroller')
    if (!root) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      const a = t.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const top = el.getBoundingClientRect().top + root.scrollTop - 32
      root.scrollTo({ top, behavior: 'smooth' })
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [])

  /* lock scroll while the intro curtain is playing.
     IMPORTANT: only touch overflow-y. Clearing the `overflow` shorthand
     wipes the page-scroller's overflow-x:hidden too, which makes
     `border-radius` stop clipping children — that's what was killing
     the navbar's rounded "cap" curve after the curtain lifted. */
  useEffect(() => {
    const root = document.getElementById('page-scroller')
    if (!root) return
    if (introDone) {
      root.style.overflowY = 'auto'
    } else {
      root.style.overflowY = 'hidden'
      root.scrollTop = 0
    }
    return () => {
      root.style.overflowY = 'auto'
    }
  }, [introDone])

  return (
    <LifeCtx.Provider value={cms}>
      <div className={`${cormorant.variable} ${dmSans.variable}`}>
        {!introDone && <IntroCurtain onDone={() => setIntroDone(true)} />}
        <Hero />
        <IntroParagraph />
        <CaptionStrip />
        <PeopleBlock />
        <AreArentBlock />
        <ValuesBlock />
        <WorkplaceBlock />
        <TogetherBlock />
        <Footer />
      </div>
    </LifeCtx.Provider>
  )
}
