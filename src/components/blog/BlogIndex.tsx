'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Abril_Fatface, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { motion } from 'framer-motion'

import Footer from '@/components/Footer'
import SubscribePopup from '@/components/SubscribePopup'
import type { PostListItem } from '@/sanity/queries'

const abrilFatface = Abril_Fatface({ subsets: ['latin'], weight: '400' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})
const dmSans = DM_Sans({ subsets: ['latin'] })

const EASE = [0.16, 1, 0.3, 1] as const
const ALL = 'All Category' as const

type IndexPost = PostListItem & {
  coverUrl?: string
  avatarUrl?: string
  category: string
}

type Props = {
  posts: IndexPost[]
  categories: string[]
}

const PAGE_SIZE = 12

export default function BlogIndex({ posts, categories }: Props) {
  const [filter, setFilter] = useState<string>(ALL)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const gridTopRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((p) => {
      const matchesCat = filter === ALL || p.category === filter
      if (!matchesCat) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? '').toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [filter, query, posts])

  // reset to first page whenever the filter or search changes
  useEffect(() => {
    setPage(1)
  }, [filter, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  // the newest post on the first page is shown as a wide "featured" card
  const featured = safePage === 1 ? pageItems[0] : undefined
  const rest = safePage === 1 ? pageItems.slice(1) : pageItems

  const goToPage = (p: number) => {
    setPage(p)
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
          style={{
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.01em',
            color: '#111111',
          }}
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

          <p className={`${cormorant.className} text-[#7A6438] text-lg font-semibold mb-3`}>
            Browse By Categories
          </p>
          <div className="border-l border-[#E8E0D5]">
            <CategoryItem
              label={ALL}
              active={filter === ALL}
              onClick={() => setFilter(ALL)}
            />
            {categories.map((c) => (
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
        <div ref={gridTopRef} className="flex flex-col gap-8 scroll-mt-24">
          {filtered.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E0D5]">
              <p className={`${cormorant.className} text-2xl text-[#111111]`}>No posts found.</p>
              <p className="text-sm text-[#555555] mt-2">
                Try a different category or clear the search.
              </p>
            </div>
          )}

          {featured && <FeaturedCard post={featured} />}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {rest.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination page={safePage} totalPages={totalPages} onChange={goToPage} />
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

/** Build a compact page list with ellipses, e.g. [1, '…', 5, 6, 7, '…', 14]. */
function pageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('…')
  pages.push(total)
  return pages
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  const arrowBase =
    'inline-flex items-center justify-center h-9 px-3 rounded-full border border-[#E8E0D5] text-sm transition-colors'
  return (
    <nav
      className="mt-6 flex items-center justify-center gap-1.5 flex-wrap"
      aria-label="Blog pagination"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${arrowBase} ${
          page === 1
            ? 'text-[#BBBBBB] cursor-not-allowed'
            : 'text-[#111111] hover:bg-[#F3EEE6]'
        }`}
        aria-label="Previous page"
      >
        ←
      </button>

      {pageRange(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-2 text-[#888888] select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-full text-sm transition-colors ${
              p === page
                ? 'bg-[#111111] text-white'
                : 'text-[#555555] hover:bg-[#F3EEE6] hover:text-[#111111]'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${arrowBase} ${
          page === totalPages
            ? 'text-[#BBBBBB] cursor-not-allowed'
            : 'text-[#111111] hover:bg-[#F3EEE6]'
        }`}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  )
}

function FeaturedCard({ post }: { post: IndexPost }) {
  const readLabel = post.readTime ? `${post.readTime} min read` : ''
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18),0_4px_12px_-6px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out hover:-translate-y-1"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative w-full h-[260px] md:h-[360px]">
          {post.coverUrl && (
            <Image
              src={post.coverUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          )}
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
          <p className={`${dmSans.className} text-[#555555] mt-4 text-[14px] leading-relaxed`}>
            {post.excerpt}
          </p>

          <div className="mt-auto pt-6 flex items-center gap-3">
            {post.avatarUrl && (
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <Image src={post.avatarUrl} alt={post.author.name} fill sizes="36px" className="object-cover" />
              </div>
            )}
            <div className={`${dmSans.className} text-[13px]`}>
              <p className="text-[#111111]">{post.author.name}</p>
              {readLabel && <p className="text-[#888888]">{readLabel}</p>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function PostCard({ post }: { post: IndexPost }) {
  const readLabel = post.readTime ? `${post.readTime} min read` : ''
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18),0_4px_12px_-6px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-out hover:-translate-y-1 flex flex-col"
    >
      <div className="relative w-full h-[220px]">
        {post.coverUrl && (
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        )}
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
        <p className={`${dmSans.className} text-[#555555] mt-3 text-[13.5px] leading-relaxed line-clamp-2`}>
          {post.excerpt}
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {post.avatarUrl && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image src={post.avatarUrl} alt={post.author.name} fill sizes="32px" className="object-cover" />
              </div>
            )}
            <div className={`${dmSans.className} text-[12.5px]`}>
              <p className="text-[#111111] leading-tight">{post.author.name}</p>
              {readLabel && <p className="text-[#888888] leading-tight">{readLabel}</p>}
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

function SubscribeBanner() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section style={{ backgroundColor: '#E8E0D5' }} className="text-[#111111]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#7A6438] mb-5">Stay in the loop</p>
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
                  <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={`${cormorant.className} text-2xl text-[#111111]`}>Thank you for subscribing.</p>
              <p className="text-sm text-[#5A5346] mt-1">We&rsquo;ll be in touch with our next letter.</p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <label htmlFor="banner-email" className="sr-only">Email</label>
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
                <Link href="/terms" className="underline underline-offset-2 hover:text-[#111111]">Terms</Link>{' '}
                &amp;{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-[#111111]">Privacy Policy</Link>.
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
        active ? 'text-[#111111] font-medium' : 'text-[#555555] hover:text-[#111111]'
      }`}
    >
      {active && (
        <span className="absolute left-[-1px] top-1/2 -translate-y-1/2 h-6 w-[2px] bg-[#B8956A] rounded-full" />
      )}
      {label}
    </button>
  )
}
