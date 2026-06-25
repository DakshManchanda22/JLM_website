'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Footer from '@/components/Footer'
import type { Bigen, BigenReel, BigenFeature, BigenProduct } from '@/sanity/queries'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
})

const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────── Defaults (used when a Sanity field is empty) ─────────── */
const D = {
  heroLogo: '/bigen-logo.svg',
  heroHeadline1: 'Specially',
  heroHeadline2: 'formulated',
  heroHeadline3: "for men's beard",
  heroEyebrow: "Japan's No.1 · Men's Beard",
  heroCtaLabel: 'Shop now',
  heroCtaHref: '#',
  heroImage: '/jadeja.png',
  videoHeadline: 'Confidence, in one stroke',
  videoUrl:
    'https://storage.googleapis.com/jlm_website_v2/BIGEN%20JADEJA%2010%20SEC%20English%20new%20PW%20%20HD%205.mp4',
  ritualHeadlinePlain: 'Salon-like finish',
  ritualHeadlineItalic1: 'in just',
  ritualHeadlineItalic2: '10 minutes',
  ritualBody:
    'Smooth, controlled application that behaves the way you want it to — start to grey-free in the time it takes to read the morning headlines.',
  ritualImage: '/2-trim.png',
  shineBannerTop: 'Darker, bolder beard',
  shineBannerBottom: 'In just 1 stroke',
  shineHeadline: 'Gives a natural shine\nto your beard',
  shineBody:
    'With the goodness of olive oil and taurine, every stroke conditions as it colours — for a softer, healthier-looking beard with a subtle, natural sheen.',
  shineHighlight: 'olive oil',
  shinePillLabel: 'No Ammonia formula',
  shineImage: '/4-trim.png',
  testimonialsHeadline: 'Decades of Trust. Endorsed by icons.',
  rangeEyebrow: "The Men's Range",
  rangeHeadline: 'Explore our entire product range',
}

const DEFAULT_RITUAL_FEATURES: BigenFeature[] = [
  { label: 'Leaves no stains', icon: 'sparkle' },
  { label: 'Non-drip cream', icon: 'drop' },
  { label: 'Mess-free application', icon: 'sparkle' },
]

const DEFAULT_REELS: BigenReel[] = [
  { url: 'https://www.instagram.com/reel/DLU2lZiNZLW/' },
  { url: 'https://www.instagram.com/reel/DKrg_FStMLF/' },
  { url: 'https://www.instagram.com/reel/DUqS6xViPnq/' },
  { url: 'https://www.instagram.com/reel/C2UrjpmpxtS/' },
  { url: 'https://www.instagram.com/reel/C7Wm8eWSkTN/' },
  { url: 'https://www.instagram.com/reel/DUBDgnxARBn/' },
  { url: 'https://www.instagram.com/reel/C7wj2GDPRjH/' },
  { url: 'https://www.instagram.com/reel/DBIfWYGSb-3/' },
  { url: 'https://www.instagram.com/reel/C2KbXlcy4-P/' },
  { url: 'https://www.instagram.com/reel/C7wj2GDPRjH/' },
]

const DEFAULT_PRODUCTS: BigenProduct[] = [
  {
    name: 'Beard Oil',
    desc: 'Argan & rosehip for a shiny, smooth, conditioned beard.',
    image: '/beard%20oil.jpg',
    href: '#',
  },
  {
    name: 'Beard Colour',
    desc: 'No-ammonia cream for beard, moustache & sideburns.',
    image: '/beard%20colour.jpg',
    href: '#',
  },
  {
    name: 'Speedy Colour',
    desc: 'Greys gone in 10 minutes with olive oil & taurine.',
    image: '/speedy%20colour.jpg',
    href: '#',
  },
  {
    name: 'Speedy Hair Colour Conditioner',
    desc: 'Darkens grey hair in 5 minutes, with natural herbs.',
    image: '/hair%20conditioner.jpg',
    href: '#',
  },
]

/* Build the Instagram embed URL from a reel/post/tv link. */
function reelEmbedUrl(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([^/?#]+)/i)
  return m ? `https://www.instagram.com/reel/${m[1]}/embed` : null
}

/* Render text with line breaks (\n → <br/>). */
function renderMultiline(text: string): ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

/* Render body text, highlighting the first occurrence of `word` in gold. */
function renderHighlighted(text: string, word?: string): ReactNode {
  if (!word) return text
  const idx = text.toLowerCase().indexOf(word.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-[#e6c068]">
        {text.slice(idx, idx + word.length)}
      </span>
      {text.slice(idx + word.length)}
    </>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

/* Animated "10 minutes" timer rings that sit behind the product shot. */
function MinutesRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[94%] max-w-[540px]">
        {/* soft pulsing glow */}
        <motion.div
          className="absolute inset-[8%] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(199,154,58,0.22) 0%, rgba(199,154,58,0.06) 50%, transparent 72%)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        />

        {/* static faint outer ring */}
        <div className="absolute inset-0 rounded-full border border-[#c79a3a]/25" />

        {/* slowly rotating tick ring */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
        >
          <circle
            cx="100"
            cy="100"
            r="97"
            fill="none"
            stroke="#c79a3a"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="1.5 8"
          />
        </motion.svg>

        {/* sweeping progress arc */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0d985" />
              <stop offset="1" stopColor="#c79a3a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="150 400"
          />
        </motion.svg>
      </div>
    </div>
  )
}

export default function BigenClient({ cms }: { cms: Bigen }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showControls, setShowControls] = useState(false)

  const videoUrl = cms.videoUrl || D.videoUrl
  const ritualImage = cms.ritualImage || D.ritualImage
  const features =
    cms.ritualFeatures && cms.ritualFeatures.length
      ? cms.ritualFeatures
      : DEFAULT_RITUAL_FEATURES

  /* Auto-play (muted) when the video scrolls into view, pause when it leaves. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { root: document.getElementById('page-scroller'), threshold: 0.5 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`${cormorant.variable} ${dmSans.variable} relative`}
      style={{ fontFamily: 'var(--font-dm-sans)' }}
    >
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 95% at 78% 18%, #6b4d1f 0%, #4a3414 26%, #2a1c0b 55%, #160e06 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 70% at 50% 50%, transparent 40%, rgba(10,6,2,0.55) 100%)',
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 items-center gap-10 min-h-[calc(100vh-64px)] py-16 lg:py-0">
            {/* ── LEFT: copy ── */}
            <div className="relative z-10 max-w-xl">
              {/* Bigen logo */}
              <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }}>
                <Image
                  src={cms.heroLogo || D.heroLogo}
                  alt="Bigen"
                  width={423}
                  height={206}
                  priority
                  className="h-20 md:h-24 w-auto"
                />
              </motion.div>

              {/* headline */}
              <motion.h1
                {...fadeUp}
                transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
                className="mt-6 leading-[0.95]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                <span className="block text-[clamp(2.25rem,4.8vw,4rem)] font-light text-[#f6efe0]">
                  {cms.heroHeadline1 || D.heroHeadline1}
                </span>
                <span className="block text-[clamp(2.25rem,4.8vw,4rem)] font-light text-[#f6efe0]">
                  {cms.heroHeadline2 || D.heroHeadline2}
                </span>
                <span
                  className="block text-[clamp(2.25rem,4.8vw,4rem)] font-light italic bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(95deg, #f5e487 0%, #d8b04a 60%, #c79a3a 100%)',
                  }}
                >
                  {cms.heroHeadline3 || D.heroHeadline3}
                </span>
              </motion.h1>

              {/* eyebrow pill */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#d8b86a]/40 px-5 py-2.5"
              >
                <span className="h-2 w-2 rounded-full bg-[#f0d985]" />
                <span className="text-sm md:text-[15px] font-semibold uppercase tracking-[0.22em] text-[#f0e3c4]">
                  {cms.heroEyebrow || D.heroEyebrow}
                </span>
              </motion.div>

              {/* CTA */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <a
                  href={cms.heroCtaHref || D.heroCtaHref}
                  className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-[#2a1d09] bg-gradient-to-b from-[#f5e487] to-[#d8b04a] shadow-[0_0_30px_-8px_rgba(245,228,135,0.75)] hover:brightness-105 transition"
                >
                  {cms.heroCtaLabel || D.heroCtaLabel}
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </motion.div>
            </div>

            {/* ── RIGHT: hero photo ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              className="relative h-[60vh] lg:h-[calc(100vh-64px)] hidden lg:block"
            >
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.45) 82%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.45) 82%, transparent 100%)',
                }}
              >
                <Image
                  src={cms.heroImage || D.heroImage}
                  alt="Bigen men's beard colour"
                  fill
                  priority
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-contain object-bottom"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="relative bg-[#0c0703] px-6 py-20 md:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center text-[clamp(2.25rem,5vw,3.75rem)] font-light text-[#f6efe0]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {cms.videoHeadline || D.videoHeadline}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
          className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-[1400px] overflow-hidden rounded-[28px] border border-[#d8b86a]/15"
          style={{
            background:
              'radial-gradient(120% 120% at 88% 50%, #5a4019 0%, #2a1c0b 45%, #100a04 100%)',
          }}
        >
          {/* decorative gold arc lines on the right */}
          <svg
            className="pointer-events-none absolute right-0 top-0 h-full w-2/3"
            viewBox="0 0 600 500"
            fill="none"
            preserveAspectRatio="xMaxYMid slice"
          >
            {[0, 40, 80, 120, 160, 200, 240].map((o) => (
              <path
                key={o}
                d={`M ${600} ${-50 + o * 1.4} Q ${250 + o} ${250} ${600} ${550 - o * 1.4}`}
                stroke="#e6c068"
                strokeOpacity="0.18"
                strokeWidth="1.2"
              />
            ))}
          </svg>

          <div
            className="absolute inset-0"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onClick={() => setShowControls((v) => !v)}
          >
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                muted
                loop
                playsInline
                preload="metadata"
                controls={showControls}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm uppercase tracking-[0.2em] text-[#a99a76]">
                  Video coming soon
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* 10-MINUTE RITUAL */}
      <section className="bg-[#0c0703] px-4 pb-4 md:px-6 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[32px] bg-[#f2ebdd] px-8 py-14 md:px-16 md:py-20"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT: copy */}
            <div className="max-w-xl">
              <h2
                className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.05] text-[#1d1408]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {cms.ritualHeadlinePlain || D.ritualHeadlinePlain}{' '}
                <span className="italic text-[#b8923f]">
                  {cms.ritualHeadlineItalic1 || D.ritualHeadlineItalic1}
                </span>
                <span className="mt-1 block italic text-[#b8923f]">
                  {cms.ritualHeadlineItalic2 || D.ritualHeadlineItalic2}
                </span>
              </h2>

              <p className="mt-7 max-w-md text-[15px] md:text-base leading-relaxed text-[#6b5d45]">
                {cms.ritualBody || D.ritualBody}
              </p>

              {/* feature pills */}
              <div className="mt-9 flex flex-wrap gap-3.5">
                {features
                  .filter((f) => f.label)
                  .map((f, i) => (
                    <div
                      key={`${f.label}-${i}`}
                      className="inline-flex items-center gap-3 rounded-full bg-white px-3 py-2.5 pr-6 shadow-[0_8px_24px_-12px_rgba(40,29,9,0.3)]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#f0d985] to-[#c79a3a] text-[#2a1d09]">
                        {f.icon === 'drop' ? (
                          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor">
                            <path d="M0 0.5L9 5.5L0 10.5V0.5Z" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M7 0L8.4 5.6L14 7L8.4 8.4L7 14L5.6 8.4L0 7L5.6 5.6L7 0Z" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm font-semibold text-[#2a1d09]">
                        {f.label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* RIGHT: animated "10 minutes" rings behind the product shot */}
            <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[520px]">
              <MinutesRings />
              {ritualImage && (
                <Image
                  src={ritualImage}
                  alt="Bigen men's beard colour"
                  width={400}
                  height={508}
                  className="relative z-10 h-auto w-full max-w-[430px] object-contain"
                />
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* NATURAL SHINE */}
      <section className="bg-[#0c0703] px-4 pb-4 md:px-6 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[32px] px-8 py-14 md:px-16 md:py-20"
          style={{
            background:
              'radial-gradient(120% 120% at 82% 50%, #4a3414 0%, #2a1c0b 46%, #160e06 100%)',
          }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* LEFT: copy */}
            <div className="max-w-xl">
              {/* punch banner — gold brushstroke highlight on the second line */}
              <div className="leading-[1.05]">
                <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold uppercase tracking-tight text-[#f6efe0]">
                  {cms.shineBannerTop || D.shineBannerTop}
                </p>
                <span
                  className="mt-2 inline-block px-4 py-1.5 text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold uppercase tracking-tight text-[#241606]"
                  style={{
                    background:
                      'linear-gradient(90deg, #e8c763 0%, #f3dd8a 48%, #d6ad48 100%)',
                    clipPath:
                      'polygon(0 0, 95% 0, 100% 42%, 97% 100%, 0 100%, 2% 50%)',
                  }}
                >
                  {cms.shineBannerBottom || D.shineBannerBottom}
                </span>
              </div>

              <h2
                className="mt-8 text-[clamp(2.25rem,4.5vw,3.75rem)] font-light leading-[1.08] text-[#f6efe0]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {renderMultiline(cms.shineHeadline || D.shineHeadline)}
              </h2>

              <p className="mt-7 max-w-md text-[15px] md:text-base leading-relaxed text-[#cdbf9f]">
                {renderHighlighted(
                  cms.shineBody || D.shineBody,
                  cms.shineHighlight ?? D.shineHighlight
                )}
              </p>

              {/* white pill */}
              <div className="mt-10 inline-flex items-center gap-4 rounded-full bg-white py-2 pl-2 pr-8 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#f0d985] to-[#c79a3a] text-[#2a1d09]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3c-3 4-6 6-6 10a6 6 0 0 0 12 0c0-4-3-6-6-10Z" />
                  </svg>
                </span>
                <span className="text-base font-semibold text-[#2a1d09]">
                  {cms.shinePillLabel || D.shinePillLabel}
                </span>
              </div>
            </div>

            {/* RIGHT: product shot with glow */}
            <div className="relative flex min-h-[360px] items-center justify-center lg:min-h-[480px]">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[80%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(230,192,104,0.18) 0%, rgba(199,154,58,0.06) 48%, transparent 70%)',
                }}
              />
              <Image
                src={cms.shineImage || D.shineImage}
                alt="Bigen men's beard colour pack"
                width={588}
                height={558}
                className="relative z-10 h-auto w-full max-w-[580px] object-contain"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* TESTIMONIALS (Instagram reels) + PRODUCT RANGE — one panel */}
      <ReelsSection
        headline={cms.testimonialsHeadline || D.testimonialsHeadline}
        reels={cms.reels && cms.reels.length ? cms.reels : DEFAULT_REELS}
        rangeEyebrow={cms.rangeEyebrow || D.rangeEyebrow}
        rangeHeadline={cms.rangeHeadline || D.rangeHeadline}
        products={cms.products && cms.products.length ? cms.products : DEFAULT_PRODUCTS}
      />

      {/* cream backdrop so the footer's rounded top corners blend with the
          cream section above instead of showing the white page background */}
      <div className="bg-[#f2ebdd]">
        <Footer />
      </div>
    </div>
  )
}

/* ───────────────────────── Reels carousel ───────────────────────── */

function ReelsSection({
  headline,
  reels,
  rangeEyebrow,
  rangeHeadline,
  products,
}: {
  headline: string
  reels: BigenReel[]
  rangeEyebrow: string
  rangeHeadline: string
  products: BigenProduct[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: 'smooth' })
  }

  /* Auto-advance one card every few seconds; loops back at the end and
     pauses while the user is hovering or interacting with the carousel. */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let paused = false
    const pause = () => {
      paused = true
    }
    const resume = () => {
      paused = false
    }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })

    const id = setInterval(() => {
      if (paused) return
      const card = el.firstElementChild as HTMLElement | null
      const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, 4000)

    return () => {
      clearInterval(id)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
    }
  }, [])

  return (
    <section className="bg-[#f2ebdd] px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-2xl text-[clamp(2rem,4.2vw,3.5rem)] font-semibold leading-[1.05] text-[#111111]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {headline}
          </motion.h2>

          {/* arrows — desktop */}
          <div className="hidden gap-3 md:flex">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scrollByCards(dir)}
                aria-label={dir === -1 ? 'Previous reels' : 'Next reels'}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111111]/15 text-[#111111] transition hover:bg-[#111111] hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {dir === -1 ? <path d="M10 3L5 8l5 5" /> : <path d="M6 3l5 5-5 5" />}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* track */}
        <div
          ref={trackRef}
          className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        >
          {reels.map((reel, i) => {
            const embed = reelEmbedUrl(reel.url)
            if (!embed) return null
            return (
              <div
                key={`${reel.url}-${i}`}
                className="relative aspect-[9/16] w-[78vw] max-w-[320px] flex-none snap-start overflow-hidden rounded-2xl bg-[#1a1208] sm:w-[320px]"
              >
                <iframe
                  src={embed}
                  title={reel.name || `Bigen reel ${i + 1}`}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  scrolling="no"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0, overflow: 'hidden' }}
                />
              </div>
            )
          })}
        </div>

        {/* ── Product range, same panel ── */}
        <ProductRange
          eyebrow={rangeEyebrow}
          headline={rangeHeadline}
          products={products}
        />
      </div>
    </section>
  )
}

/* ───────────────────────── Product range ───────────────────────── */

function ProductRange({
  eyebrow,
  headline,
  products,
}: {
  eyebrow: string
  headline: string
  products: BigenProduct[]
}) {
  return (
    <div className="mt-24 md:mt-32">
      {/* heading */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-[#b8923f]">
          {eyebrow}
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-5 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] text-[#1d1408]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {headline}
        </motion.h2>
      </div>

      {/* cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <motion.div
            key={`${p.name}-${i}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
            className="flex flex-col overflow-hidden rounded-3xl bg-[#e7dcc4]"
          >
            {/* image area */}
            <div className="relative flex h-72 items-center justify-center overflow-hidden bg-white">
              {p.image ? (
                <Image
                  src={p.image}
                  alt={p.name || 'Bigen product'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain p-4"
                />
              ) : (
                <span className="text-xs uppercase tracking-[0.18em] text-[#b8923f]/70">
                  {p.name}
                </span>
              )}
            </div>

            {/* info */}
            <div className="flex flex-1 flex-col bg-white p-7">
              <h3
                className="text-xl font-semibold leading-snug text-[#1d1408]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {p.name}
              </h3>
              {p.desc && (
                <p className="mt-3 text-sm leading-relaxed text-[#6b5d45]">
                  {p.desc}
                </p>
              )}
              <a
                href={p.href || '#'}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#b8923f] hover:text-[#9a7b3e]"
              >
                Shop now
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
