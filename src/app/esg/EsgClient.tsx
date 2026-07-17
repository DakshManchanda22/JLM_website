'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { Anton, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'
import type { EsgView, PhilanthropyStatCard } from '@/sanity/queries'

// Tall condensed display face for headings.
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

// Photo shape used across the Environment + Social carousels and the lightbox.
type GalleryImg = { url: string; lqip?: string; w: number; h: number }

// One governance document row.
type PolicyDoc = { name: string; href: string }

// Brighter, more vivid brand green for the pinned word.
const ENV_GREEN = '#2FBF3F'
// Warm marigold highlighter for the Social heading (sibling to ENV_GREEN).
const SOCIAL_YELLOW = '#F4C838'

// Scales a heading's font-size so it always fits on one line.
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

export default function EsgClient({ cms }: { cms?: EsgView }) {
  const reduce = useReducedMotion()

  const purposeHeading = cms?.purposeHeading ?? ''
  const esgHeadingRef = useFitText(220)

  const beliefEyebrow = cms?.beliefEyebrow
  const beliefText = cms?.beliefText ?? ''
  const statCards = cms?.statCards ?? []

  const esgWord = cms?.esgWord ?? ''
  const esgBody = cms?.esgIntro
  const esgGallery = cms?.esgGallery ?? []
  const carouselSpeed = cms?.carouselSpeed && cms.carouselSpeed > 0 ? cms.carouselSpeed : 2
  const socialWord = cms?.socialWord ?? ''
  const socialGallery = cms?.socialGallery ?? []
  const policiesHeading = cms?.policiesHeading ?? ''
  const policiesIntro = cms?.policiesIntro ?? ''
  const policiesImage = cms?.policiesImage ?? ''
  const policiesImageLqip = cms?.policiesImageLqip
  const policyDocuments: PolicyDoc[] = (cms?.policyDocuments ?? [])
    .filter((d) => d.title && d.url)
    .map((d) => ({ name: d.title as string, href: d.url as string }))

  // ── Lightbox shared by the Environment + Social galleries ──
  const [lightboxImg, setLightboxImg] = useState<GalleryImg | null>(null)

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

  return (
    <div className={dmSans.variable}>
      {/* ================ ESG — TITLE ================ */}
      <section className="overflow-hidden bg-white px-[7vw] pt-16 text-center md:pt-24">
        <h1
          ref={esgHeadingRef}
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
          {purposeHeading}
        </h1>
      </section>

      {/* ========================= OUR COMMITMENT + STAT CARDS ========================= */}
      <section className="bg-white px-[7vw] pb-24 pt-10 text-center md:pb-32 md:pt-14">
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

        {statCards.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-6 text-left sm:grid-cols-2 md:mt-20">
            {statCards.map((s, i) => (
              <StatCard key={i} card={s} index={i} reduce={!!reduce} />
            ))}
          </div>
        )}
      </section>

      {/* ================ ENVIRONMENT — 2-ROW CAROUSEL ================ */}
      <CarouselGallery
        heading={esgWord}
        highlight={ENV_GREEN}
        intro={esgBody}
        images={esgGallery}
        onOpen={setLightboxImg}
        reduce={!!reduce}
        speed={carouselSpeed}
      />

      {/* ================ SOCIAL — 2-ROW CAROUSEL ================ */}
      <CarouselGallery
        heading={socialWord}
        highlight={SOCIAL_YELLOW}
        images={socialGallery}
        onOpen={setLightboxImg}
        reduce={!!reduce}
        speed={carouselSpeed}
      />

      {/* ==================== GOVERNANCE — DARK SPLIT TABLE ==================== */}
      <PoliciesSection
        heading={policiesHeading}
        intro={policiesIntro}
        image={policiesImage}
        imageLqip={policiesImageLqip}
        docs={policyDocuments}
        reduce={!!reduce}
      />

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

      {/* The Governance section above is dark, so the footer sits flush (no
          rounded top) to avoid a white notch showing through the curve. */}
      <Footer roundedTop={false} />
    </div>
  )
}

// ─────────── Reusable auto-scrolling marquee (used for the 2-row carousels) ───────────
// Renders two identical groups and slides the track by exactly one group width
// so the loop is seamless. Pauses on hover; sits static under prefers-reduced-
// motion (both handled by the .marquee-track rules in globals.css).
function Marquee({
  items,
  renderItem,
  direction = 'left',
  duration = 52,
  gap = 14,
}: {
  items: GalleryImg[]
  renderItem: (item: GalleryImg, i: number) => ReactNode
  direction?: 'left' | 'right'
  duration?: number
  gap?: number
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
    <div className="overflow-hidden">
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

// ───────── Environment / Social — highlighted heading + 2-row photo carousel ─────────
// The heading keeps its highlighter-band reveal; below it, the photos scroll in
// two rows moving in opposite directions. Each photo opens the shared lightbox.
function CarouselGallery({
  heading,
  highlight,
  intro,
  images,
  onOpen,
  reduce,
  speed = 2,
}: {
  heading: string
  highlight: string
  intro?: string
  images: GalleryImg[]
  onOpen: (img: GalleryImg) => void
  reduce: boolean
  /** Speed multiplier from Sanity. 1 = normal, higher = faster. */
  speed?: number
}) {
  const headRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headRef, { once: true, margin: '0px 0px -20% 0px' })

  // Split the photos across two rows, round-robin, so each row has variety.
  const rows: GalleryImg[][] = [[], []]
  images.forEach((img, i) => rows[i % 2].push(img))
  const factor = speed > 0 ? speed : 2
  const rowConfig = [
    { dir: 'left' as const, dur: 54 / factor },
    { dir: 'right' as const, dur: 62 / factor },
  ]

  // White text reads on the darker green band; ink reads on the yellow band.
  const headingText = highlight === SOCIAL_YELLOW ? INK : '#ffffff'

  const card = (img: GalleryImg) => (
    <button
      type="button"
      onClick={() => onOpen(img)}
      aria-label="View image full screen"
      className="group relative block cursor-zoom-in overflow-hidden rounded-2xl bg-[#E8E0D5] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        height: 'clamp(150px, 20vw, 232px)',
        aspectRatio: `${img.w} / ${img.h}`,
      }}
    >
      <Image
        src={img.url}
        alt=""
        fill
        sizes="(max-width: 640px) 60vw, 320px"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        {...(img.lqip ? { placeholder: 'blur' as const, blurDataURL: img.lqip } : {})}
      />
    </button>
  )

  return (
    <section className="overflow-hidden bg-white py-20 md:py-28">
      {/* heading + optional intro */}
      <div className="px-[7vw]">
        <div ref={headRef} className="max-w-[1400px]">
          <h2
            className={anton.className}
            style={{
              margin: 0,
              fontSize: 'clamp(40px, 11vw, 128px)',
              lineHeight: 0.92,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
            }}
          >
            <span className="relative inline-block leading-none">
              <motion.span
                aria-hidden
                className="absolute rounded-[0.12em]"
                style={{
                  backgroundColor: highlight,
                  top: '-0.08em',
                  bottom: '-0.04em',
                  left: '-0.08em',
                  right: '-0.08em',
                  transformOrigin: 'left',
                }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={inView || reduce ? { scaleX: 1 } : undefined}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              />
              <span className="relative" style={{ color: headingText }}>
                {heading}
              </span>
            </span>
          </h2>
          {intro && (
            <p
              className={dmSans.className}
              style={{
                margin: '1.4em 0 0',
                maxWidth: '62ch',
                color: '#555555',
                fontSize: 'clamp(16px, 1.3vw, 19px)',
                lineHeight: 1.7,
              }}
            >
              {intro}
            </p>
          )}
        </div>
      </div>

      {/* two full-bleed auto-scrolling rows, soft-faded at the edges */}
      <div
        className="mt-10 flex flex-col gap-3 sm:mt-14 sm:gap-4"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
          maskImage:
            'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
        }}
      >
        {rowConfig.map((row, r) => (
          <Marquee
            key={r}
            items={rows[r].length > 0 ? rows[r] : images}
            direction={row.dir}
            duration={row.dur}
            renderItem={(img) => card(img)}
          />
        ))}
      </div>
    </section>
  )
}

// ─────────────── Governance — dark split: photo left, document table right ───────────────
function PoliciesSection({
  heading,
  intro,
  image,
  imageLqip,
  docs,
  reduce,
}: {
  heading: string
  intro: string
  image: string
  imageLqip?: string
  docs: PolicyDoc[]
  reduce: boolean
}) {
  return (
    <section className="bg-[#0c0c0c] px-[7vw] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white/[0.04]"
        >
          <Image
            src={image}
            alt="JL Morison governance and workplace policies"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain"
            {...(imageLqip ? { placeholder: 'blur' as const, blurDataURL: imageLqip } : {})}
          />
        </motion.div>

        <div>
          <h2
            className={anton.className}
            style={{
              margin: 0,
              fontSize: 'clamp(40px, 6vw, 84px)',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            {heading}
          </h2>
          <p
            className={dmSans.className}
            style={{
              marginTop: '1.1rem',
              maxWidth: '46ch',
              color: 'rgba(255,255,255,0.64)',
              fontWeight: 300,
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              lineHeight: 1.6,
            }}
          >
            {intro}
          </p>

          <ul className="mt-8 border-t border-white/12 md:mt-10">
            {docs.map((doc) => (
              <li key={doc.name} className="border-b border-white/12">
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 py-4 transition-colors duration-200 hover:bg-white/[0.03] md:py-5"
                >
                  <span
                    className={dmSans.className}
                    style={{
                      fontWeight: 500,
                      fontSize: 'clamp(16px, 1.6vw, 21px)',
                      color: '#ffffff',
                    }}
                  >
                    {doc.name}
                  </span>
                  <span
                    className={`${dmSans.className} inline-flex items-center gap-1.5 whitespace-nowrap underline-offset-4 group-hover:underline`}
                    style={{ fontWeight: 400, fontSize: 'clamp(13px, 1.1vw, 15px)', color: BEIGE }}
                  >
                    View
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
    const io = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      { rootMargin: '-38% 0px -38% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const open = reduce || revealed

  const col = index % 2
  const row = Math.floor(index / 2)
  const dark = (col + row) % 2 === 0
  const hasImage = Boolean(card.image)
  // On an image background everything is white over a dark overlay; otherwise the
  // original alternating dark / beige treatment is kept.
  const bg = dark ? '#141414' : BEIGE
  const fg = hasImage ? '#FFFFFF' : dark ? '#FFFFFF' : INK
  const soft = hasImage
    ? 'rgba(255,255,255,0.82)'
    : dark
      ? 'rgba(255,255,255,0.72)'
      : 'rgba(17,17,17,0.62)'
  const chipBg = hasImage
    ? 'rgba(255,255,255,0.22)'
    : dark
      ? 'rgba(255,255,255,0.14)'
      : 'rgba(17,17,17,0.07)'

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.08 }}
      onMouseEnter={() => !isTouch && setRevealed(true)}
      onMouseLeave={() => !isTouch && setRevealed(false)}
      className="relative flex flex-col overflow-hidden rounded-3xl p-7 sm:p-8"
      style={{ backgroundColor: hasImage ? '#141414' : bg, color: fg, minHeight: 210 }}
    >
      {hasImage && (
        <>
          <Image
            src={card.image as string}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 550px"
            className="object-cover"
            {...(card.lqip ? { placeholder: 'blur' as const, blurDataURL: card.lqip } : {})}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.78) 100%)',
            }}
          />
        </>
      )}
      <div className="relative z-[1] flex flex-1 flex-col">
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
      </div>
    </motion.div>
  )
}
