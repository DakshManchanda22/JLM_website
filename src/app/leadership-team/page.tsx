import type { Metadata } from 'next'
import LeadershipGrid, { type Leader } from '@/components/LeadershipGrid'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { fetchLeaders } from '@/sanity/queries'
import { resolveImage } from '@/sanity/resolveImage'
import { buildMetadata, fetchPageSeo } from '@/sanity/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    seo: await fetchPageSeo('leadershipTeam'),
    title: 'Leadership Team | JL Morison',
    description:
      "Meet the people leading JL Morison's mission to build goodness for every Indian family.",
    path: '/leadership-team',
  })
}

export default async function LeadershipTeamPage() {
  const leaders = await fetchLeaders()

  /* Photos come only from Sanity. Leaders without an uploaded photo fall back
     to a neutral placeholder rendered by LeadershipGrid (never a stock photo). */
  const team: Leader[] = leaders.map((l) => {
    const r = resolveImage(l.image, 900)
    return {
      name: l.name,
      title: l.title,
      image: r?.url ?? '',
      lqip: r?.lqip,
      slug: l.slug,
    }
  })

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100%' }}>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Leadership Team', url: '/leadership-team' },
        ]}
      />
      <LeadershipGrid team={team} />
    </div>
  )
}
