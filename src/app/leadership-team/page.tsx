import type { Metadata } from 'next'
import LeadershipGrid from '@/components/LeadershipGrid'

export const metadata: Metadata = {
  title: 'Leadership Team — JL Morison (India) Ltd.',
  description:
    "Meet the people leading JL Morison's mission to build goodness for every Indian family.",
}

export default function LeadershipTeamPage() {
  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100%' }}>
      <LeadershipGrid />
    </div>
  )
}
