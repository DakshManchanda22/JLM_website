import type { Metadata } from 'next'
import BlogIndex from '@/components/blog/BlogIndex'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { isSanityConfigured } from '@/sanity/env'
import { fetchPosts, type PostListItem } from '@/sanity/queries'
import { demoPosts } from '@/sanity/demoContent'
import { resolveImage, resolveImageUrl } from '@/sanity/resolveImage'
import { buildMetadata } from '@/sanity/seo'

export const revalidate = 60

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Journal | JL Morison',
    description:
      'Expert-written articles on baby care, dental health, hair care and life at ' +
      'JL Morison — practical goodness for every Indian family.',
    path: '/blog',
  })
}

export default async function BlogPage() {
  const raw = isSanityConfigured ? await fetchPosts() : demoPosts()
  const posts = raw.map(toIndexPost)
  const categories = Array.from(
    new Set(posts.map((p) => p.category).filter(Boolean)),
  )
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Journal', url: '/blog' },
        ]}
      />
      <BlogIndex posts={posts} categories={categories} />
    </>
  )
}

function toIndexPost(p: PostListItem) {
  const cover = resolveImage(p.coverImage, 1400)
  return {
    ...p,
    coverUrl: cover?.url,
    coverLqip: cover?.lqip,
    avatarUrl: resolveImageUrl(p.author?.avatar, 120),
    category: p.tags?.[0]?.title ?? 'Others',
  }
}
