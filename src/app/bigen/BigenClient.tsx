'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Footer from '@/components/Footer'
import SocialStamps from '@/components/SocialStamps'
import FactorySection from '@/components/FactorySection'
import type {
  Bigen,
  BigenReel,
  BigenFeature,
  BigenProduct,
  SocialCardContent,
  FactoryContent,
} from '@/sanity/queries'

// Google Sans (self-hosted) — bold, modern sans for a confident, manly look
const googleSans = localFont({
  src: [
    { path: '../fonts/GoogleSans-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/GoogleSans-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-google-sans',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
})

const EASE = [0.16, 1, 0.3, 1] as const

/* ─────────── Defaults (used when a Sanity field is empty) ─────────── */
const D = {
  heroHeadline1: 'Specially',
  heroHeadline2: 'formulated',
  heroHeadline3: 'for men',
  heroEyebrow: "Japan's No.1 · Men's Beard",
  heroCtaLabel: 'Shop now',
  heroCtaHref: 'https://www.amazon.in/s?k=bigen',
  videoHeadline: 'Confidence, in one stroke',
  videoUrl:
    'https://storage.googleapis.com/jlm_website_v2/BIGEN%20JADEJA%2010%20SEC%20English%20new%20PW%20%20HD%205.mp4',
  ritualHeadlinePlain: 'Salon-like finish',
  ritualHeadlineItalic1: 'in just',
  ritualHeadlineItalic2: '10 minutes',
  ritualBody:
    'Smooth, controlled application that behaves the way you want it to — start to grey-free in the time it takes to read the morning headlines.',
  shineBannerTop: 'Darker, bolder beard',
  shineBannerBottom: 'In just 1 stroke',
  shineHeadline: 'Gives a natural shine\nto your beard',
  shineBody:
    'With the goodness of olive oil and taurine, every stroke conditions as it colours — for a softer, healthier-looking beard with a subtle, natural sheen.',
  shinePillLabel: 'No Ammonia formula',
  testimonialsHeadline: 'Decades of Trust. Endorsed by icons.',
  rangeEyebrow: "The Men's Range",
  rangeHeadline: 'Explore our entire product range',
  instagramUrl: 'https://www.instagram.com/bigenindia',
  facebookUrl: 'https://www.facebook.com/share/14ciJNjNc4N/',
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

/* Portable Text rendering for the editable rich-text fields: each block is a
   line; Bold/Italic and the Gold/Dark/Muted colour marks come from Studio. */
const richComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span className="block">{children}</span>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    gold: ({ children }) => <span style={{ color: '#c79a3a' }}>{children}</span>,
    dark: ({ children }) => <span style={{ color: '#1d1408' }}>{children}</span>,
    muted: ({ children }) => <span style={{ color: '#6b5d45' }}>{children}</span>,
  },
}

/* Render an editable rich-text field, falling back to a default string when the
   Sanity field is empty. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RichText({ value, fallback }: { value?: any; fallback: string }): ReactNode {
  if (Array.isArray(value) && value.length > 0) {
    return <PortableText value={value} components={richComponents} />
  }
  return renderMultiline(fallback)
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
  // Keep the thumbnail on top until the video actually starts, so a slow load
  // shows the still image instead of a black box.
  const [videoPlaying, setVideoPlaying] = useState(false)

  const videoUrl = cms.videoUrl || D.videoUrl
  const ritualImage = cms.ritualImage

  // Hero: use the CMS image when set (with its LQIP if available), otherwise the
  // statically-imported default which carries its own build-time blur placeholder.
  const heroImageProps = cms.heroImage
    ? {
        src: cms.heroImage,
        ...(cms.heroImageLqip
          ? { placeholder: 'blur' as const, blurDataURL: cms.heroImageLqip }
          : {}),
      }
    : null
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
      className={`${googleSans.variable} ${dmSans.variable} relative`}
      style={{ fontFamily: 'var(--font-dm-sans)' }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
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
          <div className="grid lg:grid-cols-2 items-center gap-10 min-h-[48vh] lg:min-h-[54vh] pt-8 pb-0 lg:py-10">
            {/* ── LEFT: copy ── */}
            <div className="relative z-10 max-w-xl">
              {/* Bigen logo */}
              <motion.div {...fadeUp} transition={{ duration: 0.6, ease: EASE }}>
                {cms.heroLogo && (
                  <Image
                    src={cms.heroLogo}
                    alt="Bigen"
                    width={423}
                    height={206}
                    priority
                    className="h-28 md:h-36 w-auto"
                  />
                )}
              </motion.div>

              {/* headline */}
              <motion.h1
                {...fadeUp}
                transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
                className="mt-6 leading-[0.95]"
                style={{ fontFamily: 'var(--font-google-sans)' }}
              >
                {/* Mobile: "Specially formulated" on one line, "for men" below —
                    each line sized by vw to fill the width and stay large. */}
                <span className="lg:hidden">
                  <span className="block whitespace-nowrap text-[7.4vw] font-bold text-[#f6efe0]">
                    {cms.heroHeadline1 || D.heroHeadline1}{' '}
                    {cms.heroHeadline2 || D.heroHeadline2}
                  </span>
                  <span
                    className="block whitespace-nowrap text-[7.4vw] font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(95deg, #f5e487 0%, #d8b04a 60%, #c79a3a 100%)',
                    }}
                  >
                    {D.heroHeadline3}
                  </span>
                </span>

                {/* Desktop: original three-line stack. */}
                <span className="hidden lg:block">
                  <span className="block text-[clamp(2.25rem,4.8vw,4rem)] font-bold text-[#f6efe0]">
                    {cms.heroHeadline1 || D.heroHeadline1}
                  </span>
                  <span className="block text-[clamp(2.25rem,4.8vw,4rem)] font-bold text-[#f6efe0]">
                    {cms.heroHeadline2 || D.heroHeadline2}
                  </span>
                  <span
                    className="block text-[clamp(2.25rem,4.8vw,4rem)] font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(95deg, #f5e487 0%, #d8b04a 60%, #c79a3a 100%)',
                    }}
                  >
                    {/* Fixed to "for men" in code — the Sanity value is stale and the
                        API token is read-only. Update Sanity, then restore cms.heroHeadline3. */}
                    {D.heroHeadline3}
                  </span>
                </span>
              </motion.h1>

            </div>

            {/* ── RIGHT: hero photo with big gold "Japan's No.1" behind ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              className="relative h-[52vh] sm:h-[56vh] lg:h-[72vh] block self-end lg:-mb-10"
            >
              {/* Big gold JAPAN'S NO.1 wordmark behind the photo */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center -translate-y-[18%] select-none"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                <span
                  className="font-extrabold uppercase leading-[0.95] tracking-tight bg-clip-text text-transparent"
                  style={{
                    fontSize: 'clamp(3rem, 9.5vw, 5.5rem)',
                    backgroundImage:
                      'linear-gradient(180deg, #fff6cf 0%, #f7e489 22%, #e6c25a 46%, #cf9f37 64%, #a9781f 84%, #f0d885 100%)',
                  }}
                >
                  Japan&rsquo;s
                </span>
                <span
                  className="font-extrabold uppercase leading-[0.8] tracking-[-0.02em] bg-clip-text text-transparent"
                  style={{
                    fontSize: 'clamp(7.5rem, 24vw, 13.5rem)',
                    backgroundImage:
                      'linear-gradient(180deg, #fff6cf 0%, #f7e489 22%, #e6c25a 46%, #cf9f37 64%, #a9781f 84%, #f0d885 100%)',
                    filter: 'drop-shadow(0 6px 30px rgba(240,200,90,0.35))',
                  }}
                >
                  No.1
                </span>
              </div>

              {/* Jadeja photo in front — fully opaque, anchored so his bottom
                  pixel sits flush with the section's lower edge */}
              <div className="absolute inset-0 z-10">
                {heroImageProps && (
                  <Image
                    {...heroImageProps}
                    alt="Bigen men's beard colour"
                    fill
                    priority
                    // Serve straight from Sanity's CDN (already format/size/quality
                    // optimized by urlFor) instead of re-processing through Next's
                    // /_next/image hop — the hero is above the fold and this keeps
                    // the blur-up brief on a cold cache.
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-contain object-bottom"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="relative bg-[#0c0703] px-6 pt-10 pb-20 md:pt-14 md:pb-28">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center text-[clamp(2.25rem,5vw,3.75rem)] font-bold text-[#f6efe0]"
          style={{ fontFamily: 'var(--font-google-sans)' }}
        >
          <RichText value={cms.videoHeadline} fallback={D.videoHeadline} />
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
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={cms.videoThumbnail}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  controls={showControls}
                  onPlaying={() => setVideoPlaying(true)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Thumbnail overlay — fades out once playback begins. */}
                {cms.videoThumbnail && (
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                      videoPlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <Image
                      src={cms.videoThumbnail}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-cover"
                      {...(cms.videoThumbnailLqip
                        ? { placeholder: 'blur' as const, blurDataURL: cms.videoThumbnailLqip }
                        : {})}
                    />
                  </div>
                )}
              </>
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
                style={{ fontFamily: 'var(--font-google-sans)' }}
              >
                {cms.ritualHeadlinePlain || D.ritualHeadlinePlain}
                <span className="mt-1 block italic text-[#b8923f]">
                  {cms.ritualHeadlineItalic1 || D.ritualHeadlineItalic1}{' '}
                  {cms.ritualHeadlineItalic2 || D.ritualHeadlineItalic2}
                </span>
              </h2>

              <p className="mt-7 max-w-md text-[15px] md:text-base leading-relaxed text-[#6b5d45]">
                <RichText value={cms.ritualBody} fallback={D.ritualBody} />
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
                  {...(cms.ritualImageLqip
                    ? { placeholder: 'blur' as const, blurDataURL: cms.ritualImageLqip }
                    : {})}
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
          className="relative overflow-hidden rounded-[32px] px-8 pt-14 pb-0 md:px-16 md:pt-20"
          style={{
            background:
              'radial-gradient(120% 120% at 82% 50%, #4a3414 0%, #2a1c0b 46%, #160e06 100%)',
          }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:items-end">
            {/* LEFT: copy */}
            <div className="max-w-xl lg:pb-16">
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
                className="mt-8 text-[clamp(1.875rem,3.6vw,3rem)] font-bold leading-[1.1] text-[#f6efe0] text-balance"
                style={{ fontFamily: 'var(--font-google-sans)' }}
              >
                <RichText value={cms.shineHeadline} fallback={D.shineHeadline} />
              </h2>

              <p className="mt-7 max-w-md text-[15px] md:text-base leading-relaxed text-[#cdbf9f]">
                <RichText value={cms.shineBody} fallback={D.shineBody} />
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
            <div className="relative flex min-h-0 items-end justify-center">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[80%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(230,192,104,0.18) 0%, rgba(199,154,58,0.06) 48%, transparent 70%)',
                }}
              />
              {cms.shineImage && (
                <Image
                  src={cms.shineImage}
                  alt="Bigen men's beard colour pack"
                  width={588}
                  height={558}
                  className="relative z-10 h-auto w-full max-w-[580px] object-contain"
                  {...(cms.shineImageLqip
                    ? { placeholder: 'blur' as const, blurDataURL: cms.shineImageLqip }
                    : {})}
                />
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* TESTIMONIALS (Instagram reels) + PRODUCT RANGE — one panel */}
      <ReelsSection
        headline={cms.testimonialsHeadline}
        reels={cms.reels && cms.reels.length ? cms.reels : DEFAULT_REELS}
        rangeHeadline={cms.rangeHeadline}
        products={cms.products ?? []}
        factory={cms.factory}
        instagramUrl={cms.instagramUrl || D.instagramUrl}
        facebookUrl={cms.facebookUrl || D.facebookUrl}
        instagramCard={cms.instagramCard}
        facebookCard={cms.facebookCard}
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
  rangeHeadline,
  products,
  factory,
  instagramUrl,
  facebookUrl,
  instagramCard,
  facebookCard,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headline?: any[]
  reels: BigenReel[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rangeHeadline?: any[]
  products: BigenProduct[]
  factory?: FactoryContent
  instagramUrl: string
  facebookUrl: string
  instagramCard?: SocialCardContent
  facebookCard?: SocialCardContent
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: 'smooth' })
  }

  /* Auto-advance one card every few seconds — but only kick in 6 seconds
     after the carousel has scrolled into view. Loops at the end and pauses
     while the user hovers or interacts. */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    let paused = false
    let started = false
    let startTimer: ReturnType<typeof setTimeout> | undefined
    let intervalId: ReturnType<typeof setInterval> | undefined

    const pause = () => {
      paused = true
    }
    const resume = () => {
      paused = false
    }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })

    const advance = () => {
      if (paused) return
      const card = el.firstElementChild as HTMLElement | null
      const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          observer.disconnect()
          startTimer = setTimeout(() => {
            advance()
            intervalId = setInterval(advance, 4000)
          }, 6000)
        }
      },
      { root: document.getElementById('page-scroller'), threshold: 0.3 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      clearTimeout(startTimer)
      clearInterval(intervalId)
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
            className="text-[clamp(1.5rem,3.2vw,2.875rem)] font-semibold leading-[1.05] text-[#111111] md:whitespace-nowrap"
            style={{ fontFamily: 'var(--font-google-sans)' }}
          >
            <RichText value={headline} fallback={D.testimonialsHeadline} />
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
          className="hide-scrollbar mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:mt-20"
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
          headline={rangeHeadline}
          products={products}
          factory={factory}
          instagramUrl={instagramUrl}
          facebookUrl={facebookUrl}
          instagramCard={instagramCard}
          facebookCard={facebookCard}
        />
      </div>
    </section>
  )
}

/* ───────────────────────── Product range ───────────────────────── */

function ProductRange({
  headline,
  products,
  factory,
  instagramUrl,
  facebookUrl,
  instagramCard,
  facebookCard,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headline?: any[]
  products: BigenProduct[]
  factory?: FactoryContent
  instagramUrl: string
  facebookUrl: string
  instagramCard?: SocialCardContent
  facebookCard?: SocialCardContent
}) {
  // Fixed display order for the range, regardless of Sanity ordering.
  const RANGE_ORDER = ['beard color', 'speedy color', 'beard oil', 'hair color conditioner']
  const rank = (name?: string) => {
    const n = (name ?? '').toLowerCase().replace(/colour/g, 'color')
    const i = RANGE_ORDER.findIndex((o) => n.includes(o))
    return i === -1 ? RANGE_ORDER.length : i
  }
  const orderedProducts = [...products].sort((a, b) => rank(a.name) - rank(b.name))

  return (
    <div className="mt-24 md:mt-32">
      {/* heading */}
      <div className="mx-auto max-w-3xl text-center xl:max-w-none">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] text-[#1d1408] xl:whitespace-nowrap"
          style={{ fontFamily: 'var(--font-google-sans)' }}
        >
          <RichText value={headline} fallback={D.rangeHeadline} />
        </motion.h2>
      </div>

      {/* cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {orderedProducts.map((p, i) => (
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
                  {...(p.lqip
                    ? { placeholder: 'blur' as const, blurDataURL: p.lqip }
                    : {})}
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
                style={{ fontFamily: 'var(--font-google-sans)' }}
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
                target="_blank"
                rel="noopener noreferrer"
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

      {/* Our Factory — sits on the same cream panel, right after the range */}
      {factory && (
        <div className="mt-20 md:mt-28">
          <FactorySection factory={factory} background="transparent" />
        </div>
      )}

      {/* Follow us */}
      {/* TODO: replace the placeholder counts with real follower numbers. */}
      <SocialStamps
        heading="Join the community"
        paper="#111111"
        ink="#F7F3EC"
        muted="#B6AD9E"
        placeholderBg="#1E1B16"
        headingColor="#1d1408"
        notchColor="#f2ebdd"
        fontClassName={googleSans.className}
        className="pb-0 md:pb-2"
        cards={[
          {
            platform: 'instagram',
            href: instagramUrl,
            count: instagramCard?.followers ?? '30K',
            heading: instagramCard?.heading ?? 'Sharp, every day',
            subcopy: instagramCard?.subcopy ?? 'Grooming inspiration and looks that last.',
            image: instagramCard?.image,
            lqip: instagramCard?.lqip,
          },
          {
            platform: 'facebook',
            href: facebookUrl,
            count: facebookCard?.followers ?? '22K',
            heading: facebookCard?.heading ?? 'For the modern man',
            subcopy: facebookCard?.subcopy ?? 'Tips, launches and stories from the Bigen community.',
            image: facebookCard?.image,
            lqip: facebookCard?.lqip,
          },
        ]}
      />
    </div>
  )
}
