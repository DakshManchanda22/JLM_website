'use client'

import { Anton, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
})

const EASE = [0.16, 1, 0.3, 1] as const

export type Milestone = {
  year: string
  description: string
  side: 'left' | 'right'
  image?: {
    src: string
    width: number
    height: number
    alt: string
    offsetY?: number
  }
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    year: '1920',
    description:
      'J.L. Morison is established in Bombay, importing and distributing quality consumer products to Indian homes. A legacy of goodness takes its very first steps.',
    side: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=450&fit=crop&auto=format',
      width: 600,
      height: 450,
      alt: 'Heritage India — placeholder',
      offsetY: 40,
    },
  },
  {
    year: '1947',
    description:
      'As India charts its own destiny, so does JL Morison. The company embraces its Indian identity and renews its commitment to serving every Indian family.',
    side: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=620&fit=crop&auto=format',
      width: 500,
      height: 620,
      alt: 'New chapter — placeholder',
      offsetY: 0,
    },
  },
  {
    year: '1960',
    description:
      'A new chapter in baby care begins. The company launches its first range of products designed specifically for Indian mothers and their precious little ones.',
    side: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=480&fit=crop&auto=format',
      width: 600,
      height: 480,
      alt: 'Baby care — placeholder',
      offsetY: 30,
    },
  },
  {
    year: '1975',
    description:
      'Morisons Baby Dreams is born — a brand built on the quiet trust between a mother and the products she chooses for her child. Gentle, safe, and made for India.',
    side: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=550&h=700&fit=crop&auto=format',
      width: 550,
      height: 700,
      alt: 'Baby care — placeholder',
      offsetY: 20,
    },
  },
  {
    year: '1985',
    description:
      'Swiss dental science finds a home in India. Emoform arrives, bringing a new standard of oral care to Indian families who deserve nothing but the very best.',
    side: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=530&h=480&fit=crop&auto=format',
      width: 530,
      height: 480,
      alt: 'Product care — placeholder',
      offsetY: 60,
    },
  },
  {
    year: '1995',
    description:
      'Bigen colours the nation. JL Morison brings the beloved Japanese hair colour brand to India, adding another dimension to its growing family of trusted products.',
    side: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=580&h=480&fit=crop&auto=format',
      width: 580,
      height: 480,
      alt: 'Hair care — placeholder',
      offsetY: 0,
    },
  },
  {
    year: '2005',
    description:
      'Three decades of growth crystallise into a pan-India distribution network. JLM products reach every corner of the country — from the busiest metros to the smallest towns.',
    side: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&h=480&fit=crop&auto=format',
      width: 600,
      height: 480,
      alt: 'Distribution network — placeholder',
      offsetY: 20,
    },
  },
  {
    year: '2015',
    description:
      'A digital chapter begins. JL Morison steps into e-commerce, making its brands accessible to the next generation of Indian consumers wherever they choose to shop.',
    side: 'right',
    image: {
      src: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=550&h=450&fit=crop&auto=format',
      width: 550,
      height: 450,
      alt: 'Digital era — placeholder',
      offsetY: 40,
    },
  },
  {
    year: '2020',
    description:
      'A hundred years of building goodness. Four generations of purpose, three iconic brands, and one unwavering belief — that every Indian family deserves the very best.',
    side: 'left',
    image: {
      src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=580&h=730&fit=crop&auto=format',
      width: 580,
      height: 730,
      alt: 'Century milestone — placeholder',
      offsetY: 0,
    },
  },
]

function MilestoneRow({ item }: { item: Milestone }) {
  const isLeft = item.side === 'left'

  const yearBlock = (
    <motion.div
      initial={{ opacity: 0, y: 56, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.85, ease: EASE }}
      className="w-full"
    >
      <span
        className="block text-[96px] md:text-[128px] leading-none"
        style={{
          fontFamily: 'var(--font-anton)',
          color: '#111111',
          letterSpacing: '0.01em',
        }}
      >
        {item.year}
      </span>
      <p
        className="mt-5 text-base leading-relaxed text-[#555555]"
        style={{ fontFamily: 'var(--font-dm-sans)' }}
      >
        {item.description}
      </p>
    </motion.div>
  )

  const imageBlock = item.image ? (
    <motion.div
      initial={{ opacity: 0, y: 64, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
      className="w-full"
      style={{ marginTop: item.image.offsetY ?? 0 }}
    >
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        className="rounded-2xl object-cover w-full h-auto"
        sizes="(max-width: 768px) 90vw, 44vw"
      />
    </motion.div>
  ) : null

  return (
    <div className="relative grid grid-cols-2 mb-28 md:mb-40">
      {/* Dot on center line */}
      <div
        className="absolute left-1/2 z-10 -translate-x-1/2"
        style={{ top: '2rem' }}
      >
        <div className="w-3 h-3 rounded-full border border-[#C4A882] bg-white" />
      </div>

      {/* Left column */}
      <div className="pr-8 md:pr-12 flex flex-col items-start">
        {isLeft ? yearBlock : imageBlock}
      </div>

      {/* Right column */}
      <div className="pl-8 md:pl-12 flex flex-col items-start">
        {isLeft ? imageBlock : yearBlock}
      </div>
    </div>
  )
}

export type OurStoryCms = {
  eyebrow?: string
  headlineTop?: string
  headlineBottom?: string
  milestones?: Milestone[]
}

export default function OurStoryClient({ cms = {} }: { cms?: OurStoryCms }) {
  const EYEBROW = cms.eyebrow ?? 'A look back on our history'
  const HEAD_TOP = cms.headlineTop ?? 'Building Goodness'
  const HEAD_BOTTOM = cms.headlineBottom ?? 'Since 1920.'
  const ITEMS =
    cms.milestones && cms.milestones.length > 0 ? cms.milestones : DEFAULT_MILESTONES

  return (
    <div className={`${cormorant.variable} ${dmSans.variable} ${anton.variable} bg-white`}>
      {/* Page header */}
      <div className="pt-16 pb-12 text-center px-6">
        <p
          className="text-xs tracking-[0.25em] uppercase text-[#555555] mb-6"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        >
          {EYEBROW}
        </p>
        <h1
          className="text-5xl md:text-7xl font-light text-[#111111] leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {HEAD_TOP}
          <br />
          <span className="italic">{HEAD_BOTTOM}</span>
        </h1>
        <div className="mt-8 mx-auto w-px h-16 bg-gray-200" />
      </div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        {/* Continuous vertical center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

        {ITEMS.map((item, i) => (
          <MilestoneRow key={`${item.year}-${i}`} item={item} />
        ))}
      </div>

      <div className="h-24" />

      <div style={{ backgroundColor: '#FFFFFF' }}>
        <Footer />
      </div>
    </div>
  )
}
