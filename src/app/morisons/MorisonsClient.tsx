'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'

const EASE = [0.16, 1, 0.3, 1] as const

/* Placeholder imagery — swap for real Morisons photography when available. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521790797524-b2497295b8a0?w=2000&q=80'

const PILLARS = [
  {
    title: 'Trust',
    body: 'A name Indian families have relied on for over a century — honest products, made with care, that earn their place in the home.',
  },
  {
    title: 'Quality',
    body: 'Thoughtful formulation and uncompromising standards across every category we touch, from the nursery to the bathroom shelf.',
  },
  {
    title: 'Heritage',
    body: 'Since 1920, the house of Morison has stood for the small, everyday goodness that quietly holds a family together.',
  },
]

const FAMILY = [
  {
    name: 'Morisons Baby Dreams',
    tagline: 'The choice of smart mums.',
    href: '/morisons-baby-dreams',
    image:
      'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=1400&q=80',
  },
  {
    name: 'Emoform',
    tagline: 'Dental health, perfected.',
    href: '/emoform',
    image:
      'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=1400&q=80',
  },
  {
    name: 'Bigen',
    tagline: 'Colour with confidence.',
    href: '/bigen',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80',
  },
]

export default function MorisonsClient() {
  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative w-full overflow-hidden bg-[#111111]" style={{ height: '82vh' }}>
        <Image
          src={HERO_IMAGE}
          alt="Morisons"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle inner frame */}
        <div className="absolute inset-4 border border-white/20 rounded-sm pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute bottom-14 left-6 md:left-12 right-6 md:right-32 z-10"
        >
          <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-3 md:mb-5">
            The house of Morison · Since 1920
          </p>
          <h1
            className="text-white font-serif font-light leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
          >
            Morisons
          </h1>
        </motion.div>
      </section>

      {/* ───────────── Statement ───────────── */}
      <section className="w-full bg-[#FFFFFF] py-20 md:py-28 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: EASE }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-[#555555] text-xs tracking-[0.3em] uppercase mb-6">
            Our brand
          </p>
          <p
            className="font-serif font-light text-[#111111] leading-[1.25] tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
          >
            For over a century, the Morison name has stood for goodness Indian
            families can trust — building products that belong on every shelf,
            generation after generation.
          </p>
        </motion.div>
      </section>

      {/* ───────────── Pillars ───────────── */}
      <section className="w-full bg-[#FFFFFF] pb-20 md:pb-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className="rounded-[28px] bg-[#F6F3EE] p-8 md:p-10 flex flex-col"
            >
              <span
                className="font-serif font-light leading-none text-[#111111]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                {p.title}
              </span>
              <p className="mt-5 text-[#555555] text-sm leading-relaxed">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────── Brand family ───────────── */}
      <section className="w-full bg-[#111111] py-20 md:py-28 px-6 md:px-10">
        <div className="mb-12 md:mb-16 flex justify-center text-center">
          <h2
            className="text-white font-serif font-light tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 4.25rem)' }}
          >
            One house, three trusted brands.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3 max-w-7xl mx-auto">
          {FAMILY.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
              className="flex-1 min-w-0"
            >
              <Link
                href={brand.href}
                className="relative block h-[60vh] md:h-[64vh] overflow-hidden rounded-2xl group"
              >
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/45 transition-opacity duration-500 group-hover:bg-black/30" />
                <div className="absolute inset-x-6 bottom-6">
                  <p
                    className="text-white font-serif font-light leading-[1] tracking-tight"
                    style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)' }}
                  >
                    {brand.name}
                  </p>
                  <p className="mt-2 text-white/75 text-[11px] tracking-[0.25em] uppercase">
                    {brand.tagline}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </>
  )
}
