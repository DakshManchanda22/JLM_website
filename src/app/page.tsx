import HeroSlideshow, { type Slide } from '@/components/HeroSlideshow'
import QuoteSection from '@/components/QuoteSection'
import BrandCards, { type Brand } from '@/components/BrandCards'
import StatsSection, { type Stat } from '@/components/StatsSection'
import BlogSection, { type Post as BlogPost } from '@/components/BlogSection'
import Footer from '@/components/Footer'
import { fetchHomepage, fetchPosts } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

// Revalidate every 60s so Sanity edits surface without redeploys
export const revalidate = 60

export default async function Home() {
  const homepage = await fetchHomepage()

  /* Most recent blog posts (already ordered newest-first) for the homepage */
  const recentPosts: BlogPost[] = (await fetchPosts())
    .map((p) => ({
      title: p.title,
      excerpt: p.excerpt ?? '',
      category: p.tags?.[0]?.title ?? 'Others',
      href: `/blog/${p.slug}`,
      image: resolveImageUrl(p.coverImage, 900) ?? '',
      author: p.author?.name ?? '',
      avatar: resolveImageUrl(p.author?.avatar, 120),
      readTime: p.readTime ? `${p.readTime} min.` : undefined,
      publishedAt: p.publishedAt,
    }))
    .filter((p) => p.image)
    .slice(0, 6)

  /* Resolve Sanity image asset refs into URLs for the client components */
  const heroSlides: Slide[] | undefined = homepage?.heroSlides
    ?.map((s) => {
      const url = resolveImageUrl(s.image, 2000)
      if (!url) return null
      return { image: url, brand: s.brand, tagline: s.tagline }
    })
    .filter((x): x is Slide => x !== null)

  const brands: Brand[] | undefined = homepage?.brands
    ?.map((b) => {
      const url = resolveImageUrl(b.image, 1600)
      if (!url) return null
      return {
        name: b.name,
        shortName: b.shortName ?? b.name,
        tagline: b.tagline,
        href: b.href,
        image: url,
      }
    })
    .filter((x): x is Brand => x !== null)

  const stats: Stat[] | undefined = homepage?.stats?.map((s) => ({
    number: s.number,
    label: s.label,
    body: s.body,
  }))

  return (
    <>
      <HeroSlideshow slides={heroSlides} />
      <QuoteSection
        lines={homepage?.quote?.lines}
        attribution={homepage?.quote?.attribution}
      />
      <BrandCards brands={brands} />
      <StatsSection stats={stats} />
      <BlogSection posts={recentPosts} />
      <div style={{ backgroundColor: '#F9A8BB' }}>
        <Footer />
      </div>
    </>
  )
}
