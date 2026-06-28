'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'

export type Brand = {
  name: string
  shortName: string
  tagline: string
  href: string
  image: string
}

const DEFAULT_BRANDS: Brand[] = [
  {
    name: 'Morisons Baby Dreams',
    shortName: 'Baby Dreams',
    tagline: 'Care your baby deserves.',
    href: '/brands/morisons-baby-dreams',
    image: '/morisons-baby-dreams-homepage.jpg',
  },
  {
    name: 'Emoform',
    shortName: 'Emoform',
    tagline: 'Dental health, perfected.',
    href: '/brands/emoform',
    image: '/emoform-homepage.jpg',
  },
  {
    name: 'Bigen',
    shortName: 'Bigen',
    tagline: 'Colour with confidence.',
    href: '/brands/bigen',
    image: '/bigen-homepage.jpg',
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

function BrandCard({
  brand,
  isActive,
  onEnter,
  onLeave,
}: {
  brand: Brand
  isActive: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const padRef = useRef({ x: 0, y: 0 })

  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const springX = useSpring(mouseX, { stiffness: 240, damping: 24, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 240, damping: 24, mass: 0.5 })

  /* Measure label dimensions once it's mounted (active state) so we can
     clamp the cursor position and keep the label fully inside the card. */
  useEffect(() => {
    if (!isActive) return

    const measure = () => {
      if (!labelRef.current) return
      const r = labelRef.current.getBoundingClientRect()
      padRef.current = { x: r.width / 2, y: r.height / 2 }
    }

    const id = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', measure)
    }
  }, [isActive])

  const clamp = (clientX: number, clientY: number) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const { x: px, y: py } = padRef.current
    const x = Math.max(px, Math.min(rect.width - px, clientX - rect.left))
    const y = Math.max(py, Math.min(rect.height - py, clientY - rect.top))
    return { x, y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const { x, y } = clamp(e.clientX, e.clientY)
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleEnter = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const ex = e.clientX
    const ey = e.clientY
    onEnter()

    /* Wait one frame for the label to mount, then measure + seed the
       cursor position (clamped) so the label appears already inside the card. */
    requestAnimationFrame(() => {
      if (!cardRef.current || !labelRef.current) return
      const r = labelRef.current.getBoundingClientRect()
      padRef.current = { x: r.width / 2, y: r.height / 2 }
      const { x, y } = clamp(ex, ey)
      mouseX.jump(x)
      mouseY.jump(y)
    })
  }

  return (
    <motion.div
      style={{ flex: '1 1 0', minWidth: 0 }}
      animate={{ flexGrow: isActive ? 2.5 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <Link
        ref={cardRef}
        href={brand.href}
        onMouseEnter={handleEnter}
        onMouseLeave={onLeave}
        onMouseMove={handleMouseMove}
        className="relative block h-[60vh] md:h-[72vh] overflow-hidden rounded-2xl cursor-pointer group"
      >
        {/* Image */}
        <Image
          src={brand.image}
          alt={brand.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Dark wash — lighter when active so image reads through */}
        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: isActive ? 0.22 : 0.55 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Default brand name — bottom-left, fades out when active */}
        <AnimatePresence>
          {!isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-6 bottom-6 pointer-events-none"
            >
              <p
                className="text-white/90 font-black uppercase leading-[0.95] tracking-tight"
                style={{ fontSize: 'clamp(1.85rem, 3.2vw, 3rem)' }}
              >
                {brand.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cursor-following label — only while active */}
        {isActive && (
          <motion.div
            ref={labelRef}
            className="absolute top-0 left-0 pointer-events-none z-10"
            style={{
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
            }}
          >
            <span
              className="block text-center text-white font-black uppercase leading-[0.92] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 5rem)', maxWidth: '7em' }}
            >
              {brand.name}
            </span>
          </motion.div>
        )}

        {/* Active footer: tagline + Discover */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-x-6 bottom-6 z-10 flex items-end justify-between gap-4 pointer-events-none"
            >
              <p className="text-white/85 text-[11px] md:text-xs tracking-[0.25em] uppercase max-w-[60%]">
                {brand.tagline}
              </p>
              <span className="text-white text-sm font-medium underline underline-offset-4">
                Discover →
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  )
}

export default function BrandCards({ brands }: { brands?: Brand[] }) {
  const BRANDS = brands && brands.length > 0 ? brands : DEFAULT_BRANDS
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="bg-[#111111] py-20 md:py-28 px-6 md:px-10">
      <div className="mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
        <p className="text-white/50 text-xs tracking-[0.3em] uppercase">
          Our Brands
        </p>
        <h2
          className="text-white font-serif font-light tracking-tight leading-[1.05]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 4.25rem)' }}
        >
          Trusted in every Indian home.
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        {BRANDS.map((brand, i) => (
          <BrandCard
            key={brand.name}
            brand={brand}
            isActive={activeIndex === i}
            onEnter={() => setActiveIndex(i)}
            onLeave={() => setActiveIndex(null)}
          />
        ))}
      </div>
    </section>
  )
}
