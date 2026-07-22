'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

export type Leader = {
  name: string
  title: string
  image: string
  lqip?: string
  slug?: string
}

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
          className="relative overflow-hidden rounded-2xl cursor-pointer bg-[#E8E0D5]"
          style={{ aspectRatio: '3/4' }}
        >
          {leader.image ? (
            <Image
              src={leader.image}
              alt={leader.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              draggable={false}
              {...(leader.lqip
                ? { placeholder: 'blur' as const, blurDataURL: leader.lqip }
                : {})}
            />
          ) : (
            /* No Sanity photo yet — neutral beige placeholder, never a stock photo */
            <div className="absolute inset-0 flex items-center justify-center text-[#8a7f6d]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
              </svg>
            </div>
          )}
          {/* Bottom gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        </div>
      </Link>

      {/* Name + title — also clickable */}
      <Link href={href} className="block mt-4 px-0.5 group/text">
        <p className="text-[#111111] text-base font-medium leading-snug group-hover/text:text-[#111111]/70 transition-colors duration-200">
          {leader.name}
        </p>
        <p className="text-[#555555] text-sm leading-snug mt-1">
          {leader.title}
        </p>
      </Link>
    </motion.div>
  )
}

export default function LeadershipGrid({ team }: { team?: Leader[] }) {
  const TEAM = team ?? []
  return (
    <section className="px-6 md:px-12 lg:px-16 pt-12 pb-24">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-[#111111] mb-12 md:mb-16 font-serif"
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
