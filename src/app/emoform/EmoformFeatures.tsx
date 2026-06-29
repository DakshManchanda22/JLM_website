'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Inter } from 'next/font/google'
import type { EmoformView } from '@/sanity/queries'

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800', '900'] })
const EASE = [0.16, 1, 0.3, 1] as const
const STROKE = 1.6
const NAVY = '#13306e'

/* Shared tooth silhouette — every benefit icon is built on the same tooth so
   the set reads as one cohesive dental system, differentiated by a small
   accent glyph per benefit. */
const TOOTH =
  'M12 3.6c-1.1-.9-2.3-1.4-3.5-1.4C6.5 2.2 5 3.8 5 6c0 1.3.2 2.6.7 3.8l1.3 4.6c.3 1.1.6 2.6 1.5 2.6.9 0 1.1-1.3 1.3-2.4l.4-2.3c.1-.7.5-1.1.9-1.1s.8.4.9 1.1l.4 2.3c.2 1.1.4 2.4 1.3 2.4.9 0 1.2-1.5 1.5-2.6l1.3-4.6c.5-1.2.7-2.5.7-3.8 0-2.2-1.5-3.8-3.5-3.8-1.2 0-2.4.5-3.5 1.4z'

type Benefit = { t1: string; t2: string; accent: React.ReactNode }

const BENEFITS: Benefit[] = [
  {
    t1: 'Reduces',
    t2: 'Sensitivity',
    accent: <path d="M18.7 13.2l-1.6 2.2h1.3l-1.4 2" strokeWidth={1.4} />,
  },
  {
    t1: 'Strengthens',
    t2: 'Gums',
    accent: (
      <path
        d="M16.3 17.3l1.5-1.3 1.5 1.3M16.3 15l1.5-1.3 1.5 1.3"
        strokeWidth={1.4}
      />
    ),
  },
  {
    t1: 'Prevents',
    t2: 'Cavities',
    accent: (
      <>
        <path
          d="M18 12.9l2.1.8v1.5c0 1.3-.9 2.1-2.1 2.5-1.2-.4-2.1-1.2-2.1-2.5v-1.5z"
          strokeWidth={1.4}
        />
        <path d="M17.1 15.3l.7.6 1.1-1.2" strokeWidth={1.4} />
      </>
    ),
  },
  {
    t1: 'Removes',
    t2: 'Plaque',
    accent: (
      <path
        d="M18.3 12.7l.5 1.7 1.7.5-1.7.5-.5 1.7-.5-1.7-1.7-.5 1.7-.5z"
        strokeWidth={1.3}
      />
    ),
  },
  {
    t1: 'Protects',
    t2: 'Enamel',
    accent: (
      <path
        d="M18 12.9l2.1.8v1.5c0 1.3-.9 2.1-2.1 2.5-1.2-.4-2.1-1.2-2.1-2.5v-1.5z"
        strokeWidth={1.4}
      />
    ),
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function EmoformFeatures({ cms }: { cms?: EmoformView }) {
  const reduce = useReducedMotion()
  const titleTop = cms?.featuresTitleTop ?? '5 in 1'
  const titleBottom = cms?.featuresTitleBottom ?? 'Unique Action'
  const brushImg = cms?.featuresImage ?? '/brush.png'

  return (
    <section className={`${inter.className} relative overflow-hidden bg-white`}>
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* ── Heading + benefits ── */}
        <div className="max-w-[58%] py-16 md:py-20 lg:max-w-[54%]">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ color: NAVY }}
          >
            <span
              className="block font-black leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(3.25rem, 7.5vw, 5.5rem)' }}
            >
              {titleTop}
            </span>
            <span
              className="mt-1 block font-extrabold leading-[1] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              {titleBottom}
            </span>
          </motion.h2>

          <motion.ul
            variants={reduce ? undefined : container}
            initial={reduce ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-10 space-y-5 md:mt-12 md:space-y-6"
          >
            {BENEFITS.map((b, i) => (
              <motion.li
                key={b.t2}
                variants={reduce ? undefined : item}
                className="flex items-center gap-4 md:gap-5"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border md:h-16 md:w-16"
                  style={{ borderColor: 'rgba(19,48,110,0.3)', color: NAVY }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 md:h-8 md:w-8"
                  >
                    <path d={TOOTH} />
                    {b.accent}
                  </svg>
                </span>
                <span
                  className="font-extrabold leading-[1.05] tracking-[-0.01em]"
                  style={{
                    color: NAVY,
                    fontSize: 'clamp(1.3rem, 2.6vw, 2rem)',
                  }}
                >
                  {cms?.features?.[i] ?? (
                    <>
                      {b.t1}
                      <br />
                      {b.t2}
                    </>
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* ── Brush: always pinned to the right edge of the screen and spanning the
           full section height (top + bottom flush), on every breakpoint. ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="absolute inset-y-0 right-0 z-0 flex items-stretch justify-end"
      >
        <Image
          src={brushImg}
          alt="Emoform toothbrush with toothpaste"
          width={592}
          height={1080}
          sizes="(max-width: 1024px) 50vw, 35vw"
          className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_18px_40px_rgba(19,48,110,0.18)]"
          {...(cms?.featuresImageLqip
            ? { placeholder: 'blur' as const, blurDataURL: cms.featuresImageLqip }
            : {})}
        />
      </motion.div>
    </section>
  )
}
