'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

export type Leader = {
  name: string
  title: string
  image: string
  slug?: string
}

const DEFAULT_TEAM: Leader[] = [
  {
    name: 'Sakshi Mody',
    title: 'Promotor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  },
  {
    name: 'Sohan Sarda',
    title: 'Executive Director',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
  },
  {
    name: 'Nitin Manchanda',
    title: 'Chief Operating Officer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  },
  {
    name: 'Anand Laxmanan',
    title: 'Head SCM',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
  },
  {
    name: 'Kavita Wagh',
    title: 'Head HR & OD',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
  },
  {
    name: 'Ashwani Kumar',
    title: 'Senior Manager IT',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
  },
  {
    name: 'Pratap Nikam',
    title: 'Head Manufacturing',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
]

const CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
}

const ITEM = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function LeaderCard({ leader }: { leader: Leader }) {
  const href = `/leadership-team/${leader.slug ?? slugify(leader.name)}`

  return (
    <motion.div variants={ITEM} className="group">
      {/* Clickable photo card */}
      <Link href={href} className="block">
        <div
          className="relative overflow-hidden rounded-2xl cursor-pointer"
          style={{ aspectRatio: '3/4' }}
        >
          <Image
            src={leader.image}
            alt={leader.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-[1.04]"
            draggable={false}
          />
          {/* Bottom gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>
      </Link>

      {/* Name + title — also clickable */}
      <Link href={href} className="block mt-4 px-0.5 group/text">
        <p className="text-white text-base font-medium leading-snug group-hover/text:text-white/80 transition-colors duration-200">
          {leader.name}
        </p>
        <p className="text-white/45 text-sm leading-snug mt-1">
          {leader.title}
        </p>
      </Link>
    </motion.div>
  )
}

export default function LeadershipGrid({ team }: { team?: Leader[] }) {
  const TEAM = team && team.length > 0 ? team : DEFAULT_TEAM
  return (
    <section className="px-6 md:px-12 lg:px-16 pt-12 pb-24">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-white mb-12 md:mb-16 font-serif"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
        }}
      >
        Leadership team
      </motion.h1>

      {/* Grid */}
      <motion.div
        variants={CONTAINER}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12"
      >
        {TEAM.map((leader) => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </motion.div>
    </section>
  )
}
