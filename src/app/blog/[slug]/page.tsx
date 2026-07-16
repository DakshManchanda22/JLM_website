import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

import AuthorCard from '@/components/blog/AuthorCard'
import PortableBody from '@/components/blog/PortableBody'
import Footer from '@/components/Footer'
import { fetchPost, fetchPostSlugs } from '@/sanity/queries'
import { demoPostBySlug, demoPostSlugs } from '@/sanity/demoContent'
import { isSanityConfigured } from '@/sanity/env'
import { resolveImage, resolveImageUrl } from '@/sanity/resolveImage'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const dmSans = DM_Sans({ subsets: ['latin'] })

export const revalidate = 60

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = isSanityConfigured ? await fetchPostSlugs() : demoPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const post = isSanityConfigured
    ? await fetchPost(params.slug)
    : demoPostBySlug(params.slug)
  if (!post) return { title: 'Post not found · JL Morison' }

  const ogImageUrl = resolveImageUrl(post.ogImage ?? post.coverImage, 1200)
  return {
    title: post.seoTitle ?? `${post.title} · JL Morison`,
    description: post.seoDescription ?? post.excerpt,
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const post = isSanityConfigured
    ? await fetchPost(params.slug)
    : demoPostBySlug(params.slug)
  if (!post) notFound()

  const cover = resolveImage(post.coverImage, 1600)
  const coverUrl = cover?.url
  const avatarUrl = resolveImageUrl(post.author?.avatar, 240)

  return (
    <article className={`${dmSans.className} bg-white text-[#111111]`}>
      {/* ─── Header strip — date, tags ─── */}
      <header className="max-w-[760px] mx-auto px-6 pt-20 md:pt-28">
        <div className="flex flex-wrap items-center gap-3 mb-10 text-[11px] tracking-[0.22em] uppercase text-[#888888]">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.readTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readTime} min read</span>
            </>
          )}
          {post.tags && post.tags.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      href={`/blog?tag=${tag.slug}`}
                      className="inline-block bg-[#F3EEE6] text-[#7A6438] px-3 py-1 rounded-full hover:bg-[#E8E0D5] transition-colors"
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <h1
          className={`${cormorant.className} text-[#111111] font-medium leading-[1.04] tracking-[-0.01em]`}
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-8 text-[#555555] text-[19px] md:text-[21px] leading-[1.55] max-w-[640px]">
            {post.excerpt}
          </p>
        )}

        {/* By-line */}
        <div className="mt-10 mb-12 flex items-center gap-3 pb-10 border-b border-[#E8E0D5]">
          {avatarUrl && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image src={avatarUrl} alt={post.author.name} fill sizes="40px" className="object-cover" />
            </div>
          )}
          <div className="text-[13px]">
            <p className="text-[#111111]">By {post.author.name}</p>
            {post.author.role && (
              <p className="text-[#888888]">{post.author.role}</p>
            )}
          </div>
        </div>
      </header>

      {/* ─── Cover image — contained, static (no zoom, with side margins) ─── */}
      {coverUrl && (
        <figure className="max-w-[920px] mx-auto px-6 mt-2 md:mt-4">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={coverUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              priority
              sizes="(max-width: 920px) 100vw, 920px"
              className="object-cover"
              {...(cover?.lqip
                ? { placeholder: 'blur' as const, blurDataURL: cover.lqip }
                : {})}
            />
          </div>
        </figure>
      )}

      {/* ─── Body in narrow reading column ─── */}
      <div className="max-w-[680px] mx-auto px-6 pt-12 md:pt-16 pb-16">
        <PortableBody value={post.body} />
      </div>

      {/* ─── Author card ─── */}
      <div className="max-w-[680px] mx-auto px-6 pb-24">
        <AuthorCard
          name={post.author.name}
          avatarUrl={avatarUrl}
          role={post.author.role}
          bio={post.author.bio}
        />

        <div className="mt-16 pt-10 border-t border-[#E8E0D5] flex items-center justify-between text-[13px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#7A6438] hover:text-[#111111] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M19 12H5M5 12L11 6M5 12L11 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All posts
          </Link>
          <p className="text-[#888888]">Smart Mums Journal</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#E8E0D5' }}>
        <Footer />
      </div>
    </article>
  )
}
