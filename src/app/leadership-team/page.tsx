import type { Metadata } from 'next'
import LeadershipGrid, { type Leader } from '@/components/LeadershipGrid'
import { fetchLeaders } from '@/sanity/queries'
import { resolveImageUrl } from '@/sanity/resolveImage'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Leadership Team — JL Morison (India) Ltd.',
  description:
    "Meet the people leading JL Morison's mission to build goodness for every Indian family.",
}

export default async function LeadershipTeamPage() {
  const leaders = await fetchLeaders()

  const team: Leader[] | undefined =
    leaders.length > 0
      ? leaders.reduce<Leader[]>((acc, l) => {
          const image = resolveImageUrl(l.image, 900)
          if (!image) return acc
          acc.push({ name: l.name, title: l.title, image, slug: l.slug })
          return acc
        }, [])
      : undefined

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100%' }}>
      <LeadershipGrid team={team} />
    </div>
  )
}
