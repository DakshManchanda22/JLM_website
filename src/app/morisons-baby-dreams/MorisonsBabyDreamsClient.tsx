'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Nunito } from 'next/font/google'
import Footer from '@/components/Footer'
import type { BabyCategory, BabyDreams, BabyTint } from '@/sanity/queries'

/* ── Type system: Nunito — a soft, rounded, friendly sans used across the whole
   page (bold weights for headings, regular for body), matching the warm,
   tender feel of the Baby Dreams brand. ── */
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
})

/* ── Locked palette: warm nursery neutrals + a single coral accent ── */
const INK = '#2E2721'
const MUTED = '#6E645B'
const CREAM = '#FBF6EF'
const CORAL = '#E8677A' // fills, icons
const CORAL_INK = '#C0405A' // link/arrow text (passes AA for large semibold)
const EASE = [0.16, 1, 0.3, 1] as const

/* Soft pastel tints for the category tiles. bg = tile surface, blob = the
   decorative halo behind the product shot. */
const TINTS: Record<BabyTint, { bg: string; blob: string }> = {
  mint: { bg: '#DCEDE3', blob: '#C3E0CF' },
  blush: { bg: '#FBDDE1', blob: '#F6C3CB' },
  butter: { bg: '#F6E7C4', blob: '#EFD69C' },
  lilac: { bg: '#E7DBF0', blob: '#D7C3EA' },
  sky: { bg: '#D7E7F1', blob: '#BED8EA' },
}
const TINT_ORDER: BabyTint[] = ['mint', 'blush', 'butter', 'lilac', 'sky']

/* Mount-gated reduced-motion: returns false during SSR and the first client
   render (so hydration matches), then the real preference after mount. Without
   this gate, useReducedMotion() differs between server and client and the
   motion-conditional markup throws a hydration mismatch. */
function useReduce(): boolean {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? !!reduce : false
}

const U = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`

/* ── In-code defaults so the page is complete before marketing fills Sanity ── */
const D = {
  brandTagline: "Gentle care for your little one, every day.",
  banners: [
    { image: U('photo-1546015720-b8b30df5aa27', 2400), alt: 'Soft baby skincare' },
    { image: U('photo-1555252333-9f8e92e65df9', 2400), alt: 'A mother and her newborn' },
    { image: U('photo-1530103862676-de8c9debad1d', 2400), alt: 'New parents at home' },
  ],
  productsHeadline: 'Explore our product range',
  productsIntro:
    'Everything the nursery needs, thoughtfully made for delicate skin, tiny hands and busy mums.',
  categories: [
    {
      title: 'Baby Diaper & Wipes',
      blurb: 'All-night dryness and gentle, everyday cleaning.',
      image: U('photo-1522337094846-8a818192de1f', 1000),
      tint: 'mint' as BabyTint,
      href: 'https://www.amazon.in/stores/page/36A878CB-4BED-43C9-A652-F333BD6621C4',
    },
    {
      title: 'Baby Personal & Oral Care',
      blurb: 'Tear-free baths, soft lotions and first-tooth care.',
      image: U('photo-1503454537195-1dcabb73ffb9', 1000),
      tint: 'blush' as BabyTint,
      href: 'https://www.amazon.in/stores/page/FDF13965-1A18-46AC-9BFA-741DF7C6DF5C',
    },
    {
      title: 'Feeding Bottle & Accessories',
      blurb: 'Anti-colic bottles, teats and sterilising essentials.',
      image: U('photo-1519689680058-324335c77eba', 1000),
      tint: 'butter' as BabyTint,
      href: 'https://www.amazon.in/stores/page/1F922250-175C-4D29-AEC7-62F960539139',
    },
    {
      title: 'Mommy Needs',
      blurb: 'Thoughtful care for the months before and after.',
      image: U('photo-1576765608535-5f04d1e3f289', 1000),
      tint: 'lilac' as BabyTint,
      href: 'https://amzn.in/d/02IJ9Pgh',
    },
    {
      title: 'Baby Accessories',
      blurb: 'The soft, useful extras that make each day easier.',
      image: U('photo-1519681393784-d120267933ba', 1000),
      tint: 'sky' as BabyTint,
      href: 'https://www.amazon.in/stores/page/06000500-6A4F-4E43-A8A0-06FC43E029A9',
    },
  ] as BabyCategory[],
  videoHeadline: 'Made for the tenderest moments',
  videoUrl: 'https://storage.googleapis.com/jlm_website_v2/MBD-Teaser-25-11%201.mp4',
  blogsHeadline: 'Advice, written by doctors',
  blogsIntro:
    'Practical, paediatrician-backed guidance for the questions every parent asks.',
  instagramUrl: 'https://www.instagram.com/morisonsbabydreams',
  facebookUrl: 'https://www.facebook.com/share/19C4RpxqBs/',
  youtubeUrl: 'https://youtube.com/@morisonsbabydreams',
}

const DEFAULT_BLOGS: BabyBlogCardType[] = [
  {
    title: 'Newborn skincare: what a paediatrician actually recommends',
    href: '/blog',
    image: U('photo-1546015720-b8b30df5aa27', 1000),
    excerpt: 'A simple, fragrance-first routine for the first delicate weeks.',
    author: 'Dr. Ananya Rao',
    publishedAt: '2026-05-28',
  },
  {
    title: 'Nappy rash, decoded: causes, care and when to see a doctor',
    href: '/blog',
    image: U('photo-1544126592-807ade215a0b', 1000),
    excerpt: 'Most cases clear at home. Here is the routine that works, and the red flags.',
    author: 'Dr. Kavya Menon',
    publishedAt: '2026-05-12',
  },
  {
    title: 'Bottle feeding without the guilt: a calm, clinical guide',
    href: '/blog',
    image: U('photo-1607453998774-d533f65dac99', 1000),
    excerpt: 'Sterilising, paced feeding and spotting colic, explained plainly.',
    author: 'Dr. Ishaan Verma',
    publishedAt: '2026-04-22',
  },
  {
    title: 'First teeth: gum care before the very first tooth',
    href: '/blog',
    image: U('photo-1503454537195-1dcabb73ffb9', 1000),
    excerpt: 'When teething starts, how to soothe it, and how to build an oral routine.',
    author: 'Dr. Neha Gupta',
    publishedAt: '2026-04-08',
  },
  {
    title: 'Recovering after birth: the essentials mums forget',
    href: '/blog',
    image: U('photo-1576765608535-5f04d1e3f289', 1000),
    excerpt: 'Rest, nutrition and the small daily habits that speed healing.',
    author: 'Dr. Sara Fernandes',
    publishedAt: '2026-03-30',
  },
]

export type BabyBlogCard = {
  title: string
  href: string
  image?: string
  lqip?: string
  excerpt?: string
  author: string
  avatar?: string
  publishedAt: string
}
type BabyBlogCardType = BabyBlogCard

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

/* ───────────────────────────── Page ───────────────────────────── */

export default function MorisonsBabyDreamsClient({
  cms,
  blogPosts,
}: {
  cms: BabyDreams
  blogPosts: BabyBlogCard[]
}) {
  const banners = cms.banners && cms.banners.length ? cms.banners : D.banners
  const categories =
    cms.categories && cms.categories.length ? cms.categories : D.categories
  const blogs = blogPosts && blogPosts.length ? blogPosts : DEFAULT_BLOGS

  return (
    <div
      className={nunito.variable}
      style={{ fontFamily: 'var(--font-nunito)', color: INK }}
    >
      {/* HERO — the page opens straight into the banner carousel */}
      <BannerCarousel banners={banners} interval={cms.bannerInterval} />

      {/* VIDEO — sourced from Google Cloud Storage */}
      <BabyVideo
        headline={cms.videoHeadline || D.videoHeadline}
        videoUrl={cms.videoUrl || D.videoUrl}
        poster={cms.videoPoster}
      />

      {/* OUR PRODUCTS — pastel category tiles */}
      <OurProducts
        headline={cms.productsHeadline || D.productsHeadline}
        intro={cms.productsIntro || D.productsIntro}
        categories={categories}
      />

      {/* DOCTOR BLOGS — moving carousel */}
      <DoctorBlogs
        headline={cms.blogsHeadline || D.blogsHeadline}
        intro={cms.blogsIntro || D.blogsIntro}
        blogs={blogs}
      />

      {/* FOLLOW US */}
      <div style={{ backgroundColor: CREAM }}>
        <Follow
          instagramUrl={cms.instagramUrl || D.instagramUrl}
          facebookUrl={cms.facebookUrl || D.facebookUrl}
          youtubeUrl={cms.youtubeUrl || D.youtubeUrl}
        />
        <Footer />
      </div>
    </div>
  )
}

/* ─────────────────────── Banner carousel ─────────────────────── */

function BannerCarousel({
  banners,
  interval,
}: {
  banners: BabyDreams['banners']
  interval?: number
}) {
  const reduce = useReduce()
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const list = banners ?? []
  const count = list.length
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count)

  /* Auto-advance on a marketing-controlled interval (seconds), paused on hover
     and under reduced-motion. */
  useEffect(() => {
    if (reduce || hover || count <= 1) return
    const ms = Math.min(Math.max((interval ?? 5) * 1000, 2000), 30000)
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ms)
    return () => clearInterval(id)
  }, [reduce, hover, count, interval])

  if (count === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Banners are designed at 1464×600, so the frame keeps that ratio and
          nothing in the creative gets cropped. */}
      <div className="relative aspect-[1464/600] w-full overflow-hidden">
        {/* A single horizontal track holds every banner side by side and slides
            left/right. Because all slides live in the DOM at once (and load
            eagerly), the next image is already decoded before it arrives — no
            blur-up on advance. */}
        <motion.div
          className="flex h-full"
          style={{ width: `${count * 100}%` }}
          drag={count > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1)
            else if (info.offset.x > 60) go(-1)
          }}
          animate={{ x: `${(-index * 100) / count}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
        >
          {list.map((banner, i) => (
            <div
              key={i}
              className="relative h-full flex-none"
              style={{ width: `${100 / count}%` }}
            >
              <BannerImage banner={banner} priority={i === 0} eager={i !== 0} />
            </div>
          ))}
        </motion.div>

        {/* soft edge scrim so controls stay legible over any photo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
          style={{
            background:
              'linear-gradient(to top, rgba(20,16,12,0.34), transparent)',
          }}
        />

        {count > 1 && (
          <>
            {/* arrows */}
            <div className="absolute bottom-3 right-3 flex gap-2 md:bottom-4 md:right-4">
              {([-1, 1] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => go(dir)}
                  aria-label={dir === -1 ? 'Previous banner' : 'Next banner'}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#2E2721] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)] backdrop-blur transition hover:bg-white md:h-9 md:w-9"
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {dir === -1 ? <path d="M10 3L5 8l5 5" /> : <path d="M6 3l5 5-5 5" />}
                  </svg>
                </button>
              ))}
            </div>

            {/* dots */}
            <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 md:bottom-5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === index ? 20 : 6,
                    backgroundColor: i === index ? 'white' : 'rgba(255,255,255,0.65)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function BannerImage({
  banner,
  priority,
  eager,
}: {
  banner: NonNullable<BabyDreams['banners']>[number]
  priority?: boolean
  eager?: boolean
}) {
  if (!banner.image) return null
  const img = (
    <Image
      src={banner.image}
      alt={banner.alt || 'Morisons Baby Dreams'}
      fill
      priority={priority}
      {...(!priority && eager ? { loading: 'eager' as const } : {})}
      sizes="100vw"
      className="object-cover"
      {...(banner.lqip
        ? { placeholder: 'blur' as const, blurDataURL: banner.lqip }
        : {})}
    />
  )
  return banner.href ? (
    <a href={banner.href} className="block h-full w-full">
      {img}
    </a>
  ) : (
    img
  )
}

/* ─────────────────────── Section heading ─────────────────────── */

function SectionHead({
  headline,
  intro,
  center,
  onDark,
}: {
  headline: string
  intro?: string
  center?: boolean
  onDark?: boolean
}) {
  const reduce = useReduce()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <h2
        className="text-balance leading-[1.08]"
        style={{
          fontFamily: 'var(--font-nunito)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontSize: 'clamp(2rem, 4.4vw, 3.25rem)',
          color: onDark ? '#FBF6EF' : INK,
        }}
      >
        {headline}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-[15px] leading-relaxed md:text-lg ${center ? 'mx-auto' : ''}`}
          style={{ color: onDark ? 'rgba(251,246,239,0.82)' : MUTED, maxWidth: '52ch' }}
        >
          {intro}
        </p>
      )}
    </motion.div>
  )
}

/* ─────────────────────── Our products ─────────────────────── */

function OurProducts({
  headline,
  intro,
  categories,
}: {
  headline: string
  intro: string
  categories: BabyCategory[]
}) {
  const reduce = useReduce()
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-12 md:py-16">
      <SectionHead headline={headline} intro={intro} />

      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-14">
        {categories.map((cat, i) => {
          const tint = TINTS[cat.tint ?? TINT_ORDER[i % TINT_ORDER.length]]
          return (
            <motion.div
              key={`${cat.title}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
            >
              <Link
                href={cat.href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div
                  className="relative aspect-square overflow-hidden rounded-[28px]"
                  style={{ backgroundColor: tint.bg }}
                >
                  {/* decorative halo behind the product shot */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${tint.blob} 0%, transparent 68%)`,
                    }}
                  />
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.title || 'Product category'}
                      fill
                      sizes="(max-width: 768px) 45vw, 30vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                      {...(cat.lqip
                        ? { placeholder: 'blur' as const, blurDataURL: cat.lqip }
                        : {})}
                    />
                  )}
                </div>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className="text-lg font-bold leading-snug md:text-xl"
                      style={{ color: INK }}
                    >
                      {cat.title}
                    </h3>
                    {cat.blurb && (
                      <p className="mt-1 text-[13.5px] leading-snug" style={{ color: MUTED }}>
                        {cat.blurb}
                      </p>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: CORAL_INK, border: `1.5px solid ${CORAL_INK}` }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h9M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ─────────────────────── Video (GCS) ─────────────────────── */

function BabyVideo({
  headline,
  videoUrl,
  poster,
}: {
  headline: string
  videoUrl?: string
  poster?: string
}) {
  const reduce = useReduce()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showControls, setShowControls] = useState(false)

  /* Autoplay muted when scrolled into view; pause when it leaves. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [videoUrl])

  return (
    <section style={{ backgroundColor: CREAM }} className="px-6 pt-16 pb-12 md:px-12 md:pt-24 md:pb-14">
      <div className="mx-auto max-w-[1400px]">
        <SectionHead headline={headline} center />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative mx-auto mt-12 aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-[#e8ddce]"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={poster}
              muted
              loop
              playsInline
              preload="metadata"
              controls={showControls}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: 'white', color: CORAL }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-sm" style={{ color: MUTED }}>
                Video coming soon
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────── Doctor blogs (moving carousel) ─────────────────────── */

function DoctorBlogs({
  headline,
  intro,
  blogs,
}: {
  headline: string
  intro: string
  blogs: BabyBlogCard[]
}) {
  const reduce = useReduce()
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef = useRef(0)

  const looped = [...blogs, ...blogs]

  /* Continuous marquee; paused on hover, disabled under reduced motion (the
     row then stays a normal horizontal scroll). */
  useEffect(() => {
    if (reduce) return
    const tick = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += 0.4
        const half = trackRef.current.scrollWidth / 2
        if (posRef.current >= half) posRef.current = 0
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reduce])

  return (
    <section className="overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="mx-auto mb-12 flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-6 md:mb-16 md:px-12">
        <SectionHead headline={headline} intro={intro} />
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: CORAL }}
        >
          View more articles
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h9M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>

      <div
        className={reduce ? 'hide-scrollbar overflow-x-auto' : 'overflow-hidden'}
        style={
          reduce
            ? undefined
            : {
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              }
        }
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <div
          ref={trackRef}
          className="flex gap-5 pb-2 pl-6 md:pl-12"
          style={{ width: reduce ? undefined : 'max-content' }}
        >
          {(reduce ? blogs : looped).map((post, i) => (
            <Link
              key={`${post.href}-${i}`}
              href={post.href}
              className="group block w-[300px] flex-none md:w-[340px]"
            >
              <article
                className="flex h-full flex-col rounded-[22px] bg-white p-4"
                style={{
                  boxShadow:
                    '0 20px 44px -18px rgba(46,39,33,0.28), 0 6px 14px -8px rgba(46,39,33,0.14)',
                }}
              >
                <div className="relative aspect-[16/11] w-full flex-none overflow-hidden rounded-2xl bg-[#efe7db]">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="340px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      {...(post.lqip
                        ? { placeholder: 'blur' as const, blurDataURL: post.lqip }
                        : {})}
                    />
                  )}
                </div>

                <p className="mt-4 text-[12.5px]" style={{ color: MUTED }}>
                  {fmtDate(post.publishedAt)} · {post.author}
                </p>
                <h3
                  className="mt-2 line-clamp-2"
                  style={{
                    fontFamily: 'var(--font-nunito)',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    fontSize: '1.2rem',
                    lineHeight: 1.2,
                    color: INK,
                  }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed" style={{ color: MUTED }}>
                    {post.excerpt}
                  </p>
                )}
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: CORAL_INK }}
                >
                  Read more
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Follow us ─────────────────────── */

function Follow({
  instagramUrl,
  facebookUrl,
  youtubeUrl,
}: {
  instagramUrl: string
  facebookUrl: string
  youtubeUrl: string
}) {
  const iconClass =
    'inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_28px_-10px_rgba(192,64,90,0.6)] transition-transform hover:scale-105'
  const iconStyle = {
    background: `linear-gradient(135deg, ${CORAL} 0%, ${CORAL_INK} 100%)`,
  }
  return (
    <section className="px-6 py-12 text-center md:py-16">
      <h2
        className="text-balance"
        style={{
          fontFamily: 'var(--font-nunito)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          fontSize: 'clamp(1.75rem, 3.6vw, 2.75rem)',
          color: INK,
        }}
      >
        Follow along
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed md:text-base" style={{ color: MUTED }}>
        Join our community of parents on Instagram, Facebook and YouTube.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Morisons Baby Dreams on Instagram"
          className={iconClass}
          style={iconStyle}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Morisons Baby Dreams on Facebook"
          className={iconClass}
          style={iconStyle}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14 13.5h2.5l1-4H14V7c0-1.03 0-2 2-2h1.5V1.64c-.33-.04-1.55-.14-2.84-.14-2.69 0-4.66 1.64-4.66 4.66V9.5H7v4h3v8.5h4z" />
          </svg>
        </a>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow Morisons Baby Dreams on YouTube"
          className={iconClass}
          style={iconStyle}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-2 29 29 0 0 0 .46-5.29 29 29 0 0 0-.46-5.33zM9.75 15V8.5l5.75 3.25z" />
          </svg>
        </a>
      </div>
    </section>
  )
}
