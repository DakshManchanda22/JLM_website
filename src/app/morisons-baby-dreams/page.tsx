import type { Metadata } from 'next'
import MorisonsBabyDreamsClient, { type BabyBlogCard } from './MorisonsBabyDreamsClient'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchBabyDreams, fetchPosts, type PostListItem } from '@/sanity/queries'
import { resolveImage, resolveImageUrl } from '@/sanity/resolveImage'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('babyDreams'),
    title: 'Morisons Baby Dreams | JL Morison',
    description:
      'Gentle, thoughtfully made baby care from Morisons Baby Dreams: diapers and ' +
      'wipes, personal and oral care, feeding, and everything mum and baby need for ' +
      'the everyday.',
    path: '/morisons-baby-dreams',
  })
}

/* Prefer posts by doctors for the "written by doctors" section; if there aren't
   enough, fall back to the most recent posts. */
function looksLikeDoctor(p: PostListItem): boolean {
  // The list projection also returns author.role even though the shared
  // PostListItem type doesn't declare it; read it defensively.
  const role = (p.author as { role?: string } | undefined)?.role ?? ''
  const s = `${role} ${p.author?.name ?? ''}`.toLowerCase()
  return /\bdr\.?\b|doctor|paediatric|pediatric|m\.?d\.?/.test(s)
}

function toBlogCard(p: PostListItem): BabyBlogCard {
  const cover = resolveImage(p.coverImage, 1000)
  return {
    title: p.title,
    href: `/blog/${p.slug}`,
    image: cover?.url,
    lqip: cover?.lqip,
    excerpt: p.excerpt,
    author: p.author?.name ?? 'JL Morison',
    avatar: resolveImageUrl(p.author?.avatar, 120),
    publishedAt: p.publishedAt,
  }
}

export default async function MorisonsBabyDreamsPage() {
  const [cms, rawPosts] = await Promise.all([fetchBabyDreams(), fetchPosts()])

  const mapped = (rawPosts ?? []).map(toBlogCard)
  const doctors = (rawPosts ?? []).filter(looksLikeDoctor).map(toBlogCard)
  const blogPosts = (doctors.length >= 3 ? doctors : mapped).slice(0, 8)

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Morisons Baby Dreams', url: '/morisons-baby-dreams' },
        ]}
      />
      <MorisonsBabyDreamsClient cms={cms ?? {}} blogPosts={blogPosts} />
    </>
  )
}
