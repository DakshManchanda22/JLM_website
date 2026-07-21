'use client'

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

export type SocialPlatform = 'instagram' | 'facebook' | 'youtube'

export interface SocialStampCard {
  platform: SocialPlatform
  href: string
  heading: string
  subcopy: string
  /** Follower / subscriber count shown large on the card, e.g. "12.4K". */
  count?: string
  /** Image URL — can be added later. Falls back to a paper placeholder. */
  image?: string
  lqip?: string
  imageAlt?: string
}

interface SocialStampsProps {
  heading: string
  cards: SocialStampCard[]
  /** Paper colour of the stamps. */
  paper?: string
  ink?: string
  muted?: string
  /** Background of the image half (behind photos / the platform placeholder). */
  placeholderBg?: string
  /** Perforated "stamp" edge. Off gives a clean rounded card. Default on. */
  perforated?: boolean
  /**
   * Colour that shows THROUGH the perforated edge — set this to the section's
   * background so the notches read as real stamp cut-outs.
   */
  notchColor?: string
  /** Colour of the section heading (defaults to `ink`). */
  headingColor?: string
  /** Brand font class (e.g. from next/font) applied to the heading + cards. */
  fontClassName?: string
  className?: string
}

/* ── Perforated edge, drawn in the surrounding colour so the teeth read as
   real stamp cut-outs. Deterministic across browsers (no mask compositing). ─ */
const NOTCH_R = 5 // radius of each perforation
const NOTCH_PERIOD = 20 // distance between perforations
function perforation(notch: string): CSSProperties {
  const dot = (pos: string) =>
    `radial-gradient(circle ${NOTCH_R}px at ${pos}, ${notch} ${NOTCH_R - 0.5}px, transparent ${NOTCH_R}px)`
  return {
    background: [
      `${dot('50% 0')} 50% 0 / ${NOTCH_PERIOD}px ${NOTCH_PERIOD}px repeat-x`,
      `${dot('50% 100%')} 50% 100% / ${NOTCH_PERIOD}px ${NOTCH_PERIOD}px repeat-x`,
      `${dot('0 50%')} 0 50% / ${NOTCH_PERIOD}px ${NOTCH_PERIOD}px repeat-y`,
      `${dot('100% 50%')} 100% 50% / ${NOTCH_PERIOD}px ${NOTCH_PERIOD}px repeat-y`,
    ].join(','),
  }
}

/* ── Brand-coloured platform logos ───────────────────────────────────── */
function PlatformLogo({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#FEDA75" />
            <stop offset="0.25" stopColor="#FA7E1E" />
            <stop offset="0.5" stopColor="#D62976" />
            <stop offset="0.75" stopColor="#962FBF" />
            <stop offset="1" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-grad)" />
        <rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" strokeWidth="1.6" />
        <circle cx="16.6" cy="7.4" r="1.05" fill="#fff" />
      </svg>
    )
  }
  if (platform === 'facebook') {
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#1877F2" />
        <path
          d="M14.6 12.7h1.9l.3-2.4h-2.2V8.8c0-.7.2-1.2 1.2-1.2h1.1V5.5c-.2 0-.9-.1-1.7-.1-1.7 0-2.9 1-2.9 2.9v1.9H9.8v2.4h1.8V19h3z"
          fill="#fff"
        />
      </svg>
    )
  }
  // youtube
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="4.5" width="21" height="15" rx="4.6" fill="#FF0000" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="#fff" />
    </svg>
  )
}

/* ── One stamp card ──────────────────────────────────────────────────── */
function Stamp({
  card,
  index,
  paper,
  ink,
  muted,
  notchColor,
  perforated,
}: {
  card: SocialStampCard
  index: number
  paper: string
  ink: string
  muted: string
  notchColor: string
  perforated: boolean
}) {
  const countLabel = card.platform === 'youtube' ? 'subscribers' : 'followers'

  const textHalf = (
    <div className="relative z-[1] flex flex-1 flex-col justify-between p-6">
      <PlatformLogo platform={card.platform} />
      <div>
        {card.count && (
          <div className="mb-3">
            <span
              className="block font-semibold leading-none tracking-tight"
              style={{ color: ink, fontSize: 'clamp(1.6rem,2.2vw,2rem)' }}
            >
              {card.count}
            </span>
            <span className="mt-1 block text-[11px] uppercase tracking-[0.16em]" style={{ color: muted }}>
              {countLabel}
            </span>
          </div>
        )}
        <h3
          className="font-semibold leading-[1.15] tracking-tight"
          style={{ color: ink, fontSize: 'clamp(1.15rem,1.5vw,1.35rem)' }}
        >
          {card.heading}
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: muted }}>
          {card.subcopy}
        </p>
      </div>
    </div>
  )

  return (
    <motion.a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow us on ${card.platform}`}
      initial={{ opacity: 0, x: -160 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={`group relative flex min-h-[250px] w-full flex-col overflow-hidden shadow-[0_16px_36px_-18px_rgba(20,16,10,0.35)] transition-shadow duration-300 hover:shadow-[0_28px_50px_-20px_rgba(20,16,10,0.5)] sm:w-[330px] ${
        perforated ? '' : 'rounded-3xl'
      }`}
      style={{ backgroundColor: paper }}
    >
      {textHalf}

      {/* perforated edge overlay */}
      {perforated && (
        <span aria-hidden className="pointer-events-none absolute inset-0 z-[2]" style={perforation(notchColor)} />
      )}
    </motion.a>
  )
}

/* ── Section ─────────────────────────────────────────────────────────── */
export default function SocialStamps({
  heading,
  cards,
  paper = '#F4F1E8',
  ink = '#1A1712',
  muted = '#6B6459',
  notchColor = '#FFFFFF',
  perforated = true,
  headingColor,
  fontClassName = '',
  className = '',
}: SocialStampsProps) {
  return (
    <section className={`overflow-hidden px-6 py-16 md:py-24 ${fontClassName} ${className}`}>
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold tracking-tight"
          style={{ color: headingColor ?? ink }}
        >
          {heading}
        </motion.h2>

        {/* flex + justify-center keeps any number of cards centred */}
        <div className="mx-auto mt-12 flex max-w-md flex-wrap items-stretch justify-center gap-7 sm:max-w-none lg:gap-8">
          {cards.map((card, i) => (
            <Stamp
              key={card.platform}
              card={card}
              index={i}
              paper={paper}
              ink={ink}
              muted={muted}
              notchColor={notchColor}
              perforated={perforated}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
