'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Roboto } from 'next/font/google'

gsap.registerPlugin(ScrollTrigger)

const abrilFatface = Roboto({ subsets: ['latin'], weight: '900' })
const cormorant = Roboto({ subsets: ['latin'], weight: ['500', '700'] })

export type Post = {
  title: string
  excerpt: string
  category: string
  href: string
  image: string
  author: string
  avatar?: string
  readTime?: string
  publishedAt: string
}

const POSTS: Post[] = [
  {
    title: 'The science behind gentle baby skincare',
    excerpt: 'How natural ingredients protect sensitive newborn skin without harsh chemicals.',
    category: 'Baby Care',
    href: '/blog/baby-skincare-science',
    image: 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=900&q=80',
    author: 'Riya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format',
    readTime: '5 min.',
    publishedAt: '2026-05-28',
  },
  {
    title: 'Why dental health matters more than you think',
    excerpt: 'Small daily habits that make a lifelong difference to your oral health.',
    category: 'Oral Health',
    href: '/blog/dental-health',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=900&q=80',
    author: 'Dr. Anand Mehta',
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=120&h=120&fit=crop&auto=format',
    readTime: '4 min.',
    publishedAt: '2026-05-12',
  },
  {
    title: "Bigen's approach to natural hair colour",
    excerpt: 'Colour that lasts — formulated without the compromise.',
    category: 'Hair Care',
    href: '/blog/bigen-natural-colour',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
    author: 'Meera Kapoor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format',
    readTime: '6 min.',
    publishedAt: '2026-04-22',
  },
  {
    title: '100 years of building goodness for Indian families',
    excerpt: 'A look back at a century of trust, craft, and community.',
    category: 'Our Story',
    href: '/blog/100-years',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80',
    author: 'JL Morison',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format',
    readTime: '8 min.',
    publishedAt: '2026-03-30',
  },
  {
    title: 'The quiet ritual: how morning routines shape us',
    excerpt: 'Why the products you reach for first each day matter more than you know.',
    category: 'Lifestyle',
    href: '/blog/morning-routines',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80',
    author: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format',
    readTime: '3 min.',
    publishedAt: '2026-02-18',
  },
]

const HOMEPAGE_LIMIT = 6
const PINK = '#F9A8BB'
const HEADING = 'Smart Mums Blog.'

export default function BlogSection({ posts }: { posts?: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef = useRef<number>(0)

  // most-recent-first; fall back to the built-in demo posts if none supplied
  const looped = useMemo(() => {
    const source = posts && posts.length ? posts : POSTS
    const recent = [...source]
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, HOMEPAGE_LIMIT)
    return [...recent, ...recent]
  }, [posts])

  /* Auto-scroll ticker */
  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current && trackRef.current) {
        posRef.current += 0.45
        const halfWidth = trackRef.current.scrollWidth / 2
        if (posRef.current >= halfWidth) posRef.current = 0
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* Letter-by-letter colour scrub: white → #111111, left to right */
  useEffect(() => {
    const root = headingRef.current
    if (!root) return
    const scroller = document.getElementById('page-scroller')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-blog-letter]',
        { color: '#FFFFFF' },
        {
          color: '#111111',
          ease: 'none',
          duration: 0.3,
          stagger: 0.06,
          scrollTrigger: {
            trigger: root,
            scroller: scroller ?? undefined,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section style={{ backgroundColor: PINK }} className="pt-16 md:pt-24 pb-24 md:pb-32">

      {/* Heading row — outside masked carousel, never faded */}
      <div className="px-6 md:px-12 mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
        <Link href="/blog" className="group inline-block">
        <h2
          ref={headingRef}
          className={abrilFatface.className}
          style={{ fontSize: 'clamp(3.25rem, 9vw, 9rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
        >
          {HEADING.split('').map((char, i) => (
            <span
              key={i}
              data-blog-letter
              style={{ color: '#FFFFFF', display: 'inline' }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h2>
        </Link>
        <Link
          href="/blog"
          aria-label="View all posts"
          className="self-end mb-3 md:mb-4 inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-[#111111] shadow-[0_12px_28px_-8px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-0.5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Carousel — mask-image fades only the track, never the heading */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)',
        }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        <div
          ref={trackRef}
          className="flex pb-2"
          style={{ width: 'max-content', willChange: 'transform', paddingLeft: '24px' }}
        >
          {looped.map((post, i) => (
            <Link
              key={`${post.href}-${i}`}
              href={post.href}
              draggable={false}
              className="group flex-shrink-0 w-[320px] md:w-[360px] block"
              style={{ marginRight: '24px' }}
            >
              <div
                className="bg-white rounded-[22px] p-4 flex flex-col h-[460px] transition-transform duration-500 ease-out group-hover:-translate-y-1"
                style={{
                  boxShadow:
                    '0 24px 48px -12px rgba(0,0,0,0.28), 0 8px 16px -8px rgba(0,0,0,0.18)',
                }}
              >
                {/* Image */}
                <div className="relative w-full overflow-hidden rounded-2xl flex-shrink-0" style={{ height: '180px' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="360px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    draggable={false}
                  />
                </div>

                {/* Title + bookmark */}
                <div className="flex items-start justify-between gap-3 mt-4">
                  <h3
                    className={`${cormorant.className} text-[#111111] leading-[1.15] font-bold line-clamp-2`}
                    style={{ fontSize: '1.4rem' }}
                  >
                    {post.title}
                  </h3>
                  <svg
                    width="18"
                    height="22"
                    viewBox="0 0 18 22"
                    fill="none"
                    className="flex-shrink-0 mt-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 2.5C2 1.67 2.67 1 3.5 1H14.5C15.33 1 16 1.67 16 2.5V21L9 16L2 21V2.5Z"
                      stroke="#111111"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Excerpt */}
                <p className="text-[#555555] text-[13px] leading-[1.55] mt-2 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author row */}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {post.avatar && (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={post.avatar}
                          alt={post.author}
                          fill
                          sizes="28px"
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                    )}
                    <p className="text-[12px] text-[#555555] truncate">
                      by <span className="text-[#111111]">{post.author}</span>{' '}
                      <span className="text-[#888888]">in</span>{' '}
                      <span className="text-[#111111]">{post.category}</span>
                    </p>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <circle cx="7" cy="7" r="6" stroke="#555555" strokeWidth="1.2" />
                        <path d="M7 3.5V7L9.25 8.5" stroke="#555555" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span className="text-[12px] text-[#555555]">{post.readTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
