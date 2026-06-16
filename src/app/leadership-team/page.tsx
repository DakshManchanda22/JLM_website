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

  /* Neutral grayscale placeholder for leaders whose photo isn't uploaded yet.
     The grid styles a grayscale + zoom effect on hover, so a single muted
     photo blends in until a real headshot is added in Studio. */
  const PHOTO_PLACEHOLDER =
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=900&h=1200&fit=crop&auto=format'

  const team: Leader[] | undefined =
    leaders.length > 0
      ? leaders.map((l) => ({
          name: l.name,
          title: l.title,
          image: resolveImageUrl(l.image, 900) ?? PHOTO_PLACEHOLDER,
          slug: l.slug,
        }))
      : undefined

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100%' }}>
      <LeadershipGrid team={team} />
    </div>
  )
}
