'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Abril_Fatface, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import SubscribePopup from '@/components/SubscribePopup'

const abrilFatface = Abril_Fatface({ subsets: ['latin'], weight: '400' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})
const dmSans = DM_Sans({ subsets: ['latin'] })

const EASE = [0.16, 1, 0.3, 1] as const

const CATEGORIES = [
  'Baby Care',
  'Breastfeeding',
  'Covid 19',
  'Family Dynamics',
  'Food & Nutrition',
  'For 12 months+ babies',
  'For 8 months+ babies',
  'For 9 months+ babies',
  'For pregnant Mums & New Mums',
  'Infant care',
  'Others',
  'Parenting',
  'Pregnancy',
  'Recipes',
  'Zodiac',
] as const

type Category = (typeof CATEGORIES)[number]

type Post = {
  slug: string
  title: string
  excerpt: string
  category: Category
  image: string
  author: string
  avatar: string
  readTime: string
  featured?: boolean
}

const POSTS: Post[] = [
  {
    slug: 'gentle-baby-skincare',
    title: 'The science behind gentle baby skincare',
    excerpt:
      'How natural ingredients protect sensitive newborn skin without harsh chemicals — and why a thoughtful routine matters more than ever.',
    category: 'Baby Care',
    image: 'https://images.unsplash.com/photo-1546015720-b8b30df5aa27?w=1400&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format',
    readTime: '5 min read',
    featured: true,
  },
  {
    slug: 'first-latch',
    title: 'The first latch: what no one tells new mums',
    excerpt: 'A gentle, judgement-free guide to those very first days of breastfeeding.',
    category: 'Breastfeeding',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=900&q=80',
    author: 'Dr. Anand Mehta',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=120&h=120&fit=crop&auto=format',
    readTime: '4 min read',
  },
  {
    slug: 'covid-safe-baby',
    title: 'Keeping baby safe in a post-Covid world',
    excerpt: 'Hygiene habits that have stayed with us — and which ones really matter.',
    category: 'Covid 19',
    image: 'https://images.unsplash.com/photo-1584462750742-30beae22b87b?w=900&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format',
    readTime: '6 min read',
  },
  {
    slug: 'siblings-and-baby',
    title: 'When the second one arrives: sibling dynamics, made simple',
    excerpt: 'Inviting your older child into the new chapter — without anyone feeling left behind.',
    category: 'Family Dynamics',
    image: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=900&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format',
    readTime: '5 min read',
  },
  {
    slug: 'first-foods',
    title: 'First foods: a calm, common-sense weaning guide',
    excerpt: 'Soft textures, single ingredients, and the small wins that get you started.',
    category: 'Food & Nutrition',
    image: 'https://images.unsplash.com/photo-1604908554027-3a6e6b3b0f3a?w=900&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format',
    readTime: '7 min read',
  },
  {
    slug: 'twelve-months-meals',
    title: 'Mealtime at 12 months+: textures, tools and tantrums',
    excerpt: 'A practical week of meals for the just-turned-one in your life.',
    category: 'For 12 months+ babies',
    image: 'https://images.unsplash.com/photo-1467453678174-768ec283a940?w=900&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format',
    readTime: '4 min read',
  },
  {
    slug: 'eight-months-purees',
    title: 'Beyond purees: feeding the 8 month+ baby',
    excerpt: 'Soft finger foods, small spoons, and a calmer mealtime.',
    category: 'For 8 months+ babies',
    image: 'https://images.unsplash.com/photo-1597237079442-30aa4cbe7e29?w=900&q=80',
    author: 'Dr. Anand Mehta',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=120&h=120&fit=crop&auto=format',
    readTime: '5 min read',
  },
  {
    slug: 'nine-months-milestones',
    title: 'The 9 month+ milestone window — what to watch for',
    excerpt: 'Sitting, crawling, babbling — and a parent-friendly checklist.',
    category: 'For 9 months+ babies',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format',
    readTime: '4 min read',
  },
  {
    slug: 'pregnant-and-new-mums',
    title: 'A letter to pregnant mums & new mums',
    excerpt: 'Small, kind things you can do for yourself in the chaos of becoming.',
    category: 'For pregnant Mums & New Mums',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format',
    readTime: '6 min read',
  },
  {
    slug: 'infant-bathing',
    title: 'Infant care basics: bathing, holding, soothing',
    excerpt: 'The tiny rituals that build big trust in the first six months.',
    category: 'Infant care',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format',
    readTime: '5 min read',
  },
  {
    slug: 'parenting-without-shouting',
    title: 'Parenting without the shouting (most days)',
    excerpt: 'Small mindset shifts that change a household.',
    category: 'Parenting',
    image: 'https://images.unsplash.com/photo-1623012072430-b66d4cb1e1cb?w=900&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format',
    readTime: '5 min read',
  },
  {
    slug: 'pregnancy-self-care',
    title: 'Pregnancy self-care: the underrated essentials',
    excerpt: 'Five gentle habits worth keeping for the full nine months.',
    category: 'Pregnancy',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=900&q=80',
    author: 'Dr. Anand Mehta',
    avatar:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=120&h=120&fit=crop&auto=format',
    readTime: '6 min read',
  },
  {
    slug: 'easy-baby-recipes',
    title: 'Five easy, no-fuss baby recipes for the week',
    excerpt: 'Wholesome, made-from-scratch, and ready in under fifteen.',
    category: 'Recipes',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80',
    author: 'Riya Sharma',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format',
    readTime: '4 min read',
  },
  {
    slug: 'baby-zodiac-personalities',
    title: 'What your baby’s star sign might say about them',
    excerpt: 'A gentle, just-for-fun look at the twelve little personalities.',
    category: 'Zodiac',
    image: 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=900&q=80',
    author: 'Meera Kapoor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format',
    readTime: '3 min read',
  },
  {
    slug: 'other-tidbits',
    title: 'Other little things we’ve been thinking about',
    excerpt: 'A small round-up from the team — books, products, and quiet wins.',
    category: 'Others',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=900&q=80',
    author: 'Ananya Iyer',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&auto=format',
    readTime: '3 min read',
  },
]

const ALL = 'All Category' as const
type FilterValue = typeof ALL | Category

/* ────────────────────────────────────────────────────────────
 * Cards
 * ──────────────────────────────────────────────────────────── */

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18),0_4px_12px_-6px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out hover:-translate-y-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative w-full h-[260px] md:h-[360px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col">
          <span className="self-start inline-block bg-[#F3EEE6] text-[#7A6438] text-[11px] tracking-wide px-3 py-1 rounded-full mb-5">
            Featured
          </span>
          <h3
            className={`${cormorant.className} text-[#111111] font-bold leading-[1.12]`}
            style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.3rem)' }}
          >
            {post.title}
          </h3>
          <p
            className={`${dmSans.className} text-[#555555] mt-4 text-[14px] leading-relaxed`}
          >
            {post.excerpt}
          </p>

          <div className="mt-auto pt-6 flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <Image src={post.avatar} alt={post.author} fill sizes="36px" className="object-cover" />
            </div>
            <div className={`${dmSans.className} text-[13px]`}>
              <p className="text-[#111111]">{post.author}</p>
              <p className="text-[#888888]">{post.readTime}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18),0_4px_12px_-6px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out hover:-translate-y-1 flex flex-col"
    >
      <div className="relative w-full h-[220px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <span className="self-start inline-block bg-[#F3EEE6] text-[#7A6438] text-[11px] tracking-wide px-3 py-1 rounded-full mb-4">
          {post.category}
        </span>
        <h3
          className={`${cormorant.className} text-[#111111] font-bold leading-[1.18]`}
          style={{ fontSize: 'clamp(1.15rem, 1.6vw, 1.5rem)' }}
        >
          {post.title}
        </h3>
        <p
          className={`${dmSans.className} text-[#555555] mt-3 text-[13.5px] leading-relaxed line-clamp-2`}
        >
          {post.excerpt}
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image src={post.avatar} alt={post.author} fill sizes="32px" className="object-cover" />
            </div>
            <div className={`${dmSans.className} text-[12.5px]`}>
              <p className="text-[#111111] leading-tight">{post.author}</p>
              <p className="text-[#888888] leading-tight">{post.readTime}</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F3EEE6] text-[#7A6438] flex items-center justify-center transition-colors group-hover:bg-[#111111] group-hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────── */

export default function BlogPage() {
  const [filter, setFilter] = useState<FilterValue>(ALL)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return POSTS.filter((p) => {
      const matchesCat = filter === ALL || p.category === filter
      if (!matchesCat) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [filter, query])

  const featured = filtered.find((p) => p.featured) ?? filtered[0]
  const rest = filtered.filter((p) => p !== featured)

  return (
    <div className={`${dmSans.className} bg-[#FFFDFA] min-h-screen`}>
      <SubscribePopup />

      {/* Heading */}
      <div className="px-6 md:px-12 pt-16 md:pt-20 pb-10 md:pb-14 text-center max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-[#7A6438] mb-5">Our Journal</p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={abrilFatface.className}
          style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.98, letterSpacing: '-0.01em', color: '#111111' }}
        >
          Smart Mums Blog.
        </motion.h1>
        <p className="mt-5 text-[#555555] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Stories, science and small wins from the JL Morison family — for every Indian mum.
        </p>
      </div>

      {/* Sidebar + Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
        {/* ── Sidebar ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* Search */}
          <label className="block text-[12px] tracking-wide text-[#7A6438] mb-2">Search</label>
          <div className="relative mb-7">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search article..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full bg-white border border-[#E8E0D5] pl-10 pr-4 py-2.5 text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#B8956A] transition-colors"
            />
          </div>

          {/* Category list */}
          <p className={`${cormorant.className} text-[#7A6438] text-lg font-semibold mb-3`}>
            Browse By Categories
          </p>
          <div className="border-l border-[#E8E0D5]">
            <CategoryItem
              label={ALL}
              active={filter === ALL}
              onClick={() => setFilter(ALL)}
            />
            {CATEGORIES.map((c) => (
              <CategoryItem
                key={c}
                label={c}
                active={filter === c}
                onClick={() => setFilter(c)}
              />
            ))}
          </div>
        </aside>

        {/* ── Grid ── */}
        <div className="flex flex-col gap-8">
          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E0D5]">
              <p className={`${cormorant.className} text-2xl text-[#111111]`}>
                No posts found.
              </p>
              <p className="text-sm text-[#555555] mt-2">
                Try a different category or clear the search.
              </p>
            </div>
          )}

          {featured && filtered.length > 0 && <FeaturedCard post={featured} />}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SubscribeBanner />

      <div style={{ backgroundColor: '#E8E0D5' }}>
        <Footer />
      </div>
    </div>
  )
}

function SubscribeBanner() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to email service (Resend / Mailchimp / Sanity webhook)
    setSubmitted(true)
  }

  return (
    <section style={{ backgroundColor: '#E8E0D5' }} className="text-[#111111]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left — copy */}
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#7A6438] mb-5">
            Stay in the loop
          </p>
          <h2
            className={`${cormorant.className} text-[#111111] font-medium leading-[1.05]`}
            style={{ fontSize: 'clamp(2rem, 4.2vw, 3.5rem)' }}
          >
            Stories worth slowing down for, delivered to your inbox.
          </h2>
          <p className="mt-5 text-[#5A5346] text-[15px] leading-relaxed max-w-md">
            The Smart Mums journal — gentle parenting, science-backed care, and the small wins from
            the JL Morison family. One thoughtful letter, no clutter.
          </p>
        </div>

        {/* Right — form */}
        <div className="md:pl-6">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="bg-white/60 border border-[#D6CCBA] rounded-xl px-6 py-8 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12L10 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={`${cormorant.className} text-2xl text-[#111111]`}>
                Thank you for subscribing.
              </p>
              <p className="text-sm text-[#5A5346] mt-1">
                We&rsquo;ll be in touch with our next letter.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <label htmlFor="banner-email" className="sr-only">
                Email
              </label>
              <input
                id="banner-email"
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-[#111111] placeholder:text-[#888888] rounded-md px-5 py-4 text-[15px] border border-[#D6CCBA] focus:outline-none focus:ring-2 focus:ring-[#7A6438] focus:border-transparent transition"
              />
              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-[#2A2520] text-white text-[15px] font-medium tracking-wide py-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
              <p className="text-[12px] text-[#5A5346] mt-1">
                By subscribing, you accept our{' '}
                <Link href="/terms" className="underline underline-offset-2 hover:text-[#111111]">
                  Terms
                </Link>{' '}
                &amp;{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-[#111111]">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function CategoryItem({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left pl-4 pr-3 py-2 text-sm transition-colors relative ${
        active
          ? 'text-[#111111] font-medium'
          : 'text-[#555555] hover:text-[#111111]'
      }`}
    >
      {active && (
        <span className="absolute left-[-1px] top-1/2 -translate-y-1/2 h-6 w-[2px] bg-[#B8956A] rounded-full" />
      )}
      {label}
    </button>
  )
}
