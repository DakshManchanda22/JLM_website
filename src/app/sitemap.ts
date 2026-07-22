import type { MetadataRoute } from 'next'

import { fetchPostsForSitemap, fetchLeaderSlugs } from '@/sanity/queries'
import { SITE_URL } from '@/sanity/seo'

// Regenerate hourly so newly-published Sanity content (blog posts, leaders)
// appears in the sitemap without a redeploy. Google re-fetches sitemaps on its
// own cadence (typically daily), so hourly freshness is effectively instant for
// crawling — and it costs no build minutes.
export const revalidate = 3600

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

/** Fixed pages, with their relative importance. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: ChangeFreq }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/morisons-baby-dreams', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/emoform', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/bigen', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { path: '/our-story', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/leadership-team', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/morisons', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/life-at-jlm', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/philanthropy', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/esg', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/investor-relations', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact-us', priority: 0.5, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Dynamic routes pulled live from Sanity. Failures degrade gracefully to the
  // static routes so the sitemap is never empty if Sanity is unreachable.
  const [posts, leaderSlugs] = await Promise.all([
    fetchPostsForSitemap().catch(() => []),
    fetchLeaderSlugs().catch(() => []),
  ])

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const leaderEntries: MetadataRoute.Sitemap = leaderSlugs.map((slug) => ({
    url: `${SITE_URL}/leadership-team/${slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.4,
  }))

  return [...staticEntries, ...postEntries, ...leaderEntries]
}
