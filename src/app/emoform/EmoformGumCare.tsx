'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Inter } from 'next/font/google'
import type { EmoformView } from '@/sanity/queries'

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800', '900'] })
const EASE = [0.16, 1, 0.3, 1] as const
const CORAL = '#E2604A'

export default function EmoformGumCare({ cms }: { cms?: EmoformView }) {
  const reduce = useReducedMotion()
  const title = cms?.ctaTitle ?? 'Start your daily gum-care routine'
  const subtext =
    cms?.ctaSubtext ??
    'Sugar-free, fluoride-free, Swiss formula. Relief you can feel, twice a day.'
  const buttonLabel = cms?.ctaButtonLabel ?? 'Shop now'
  const buttonHref =
    cms?.ctaButtonHref ?? 'https://www.amazon.in/s?k=EMOFORM-R&ref=bl_dp_s_web_0'

  return (
    <section
      className={`${inter.className} relative overflow-hidden`}
      style={{
        background:
          'linear-gradient(180deg, #2f539f 0%, #1c3a78 55%, #13285a 100%)',
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-14 pb-14 text-center md:pt-20 md:pb-16">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px', amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-black leading-[1.02] tracking-[-0.02em] text-white"
          style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}
        >
          {title}
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px', amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
          className="mt-5 max-w-[46ch] leading-relaxed text-white/85"
          style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)' }}
        >
          {subtext}
        </motion.p>

        <motion.a
          href={buttonHref}
          target="_blank"
          rel="noopener noreferrer"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px', amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          whileHover={reduce ? undefined : { y: -2 }}
          className="mt-9 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] transition-colors"
          style={{ backgroundColor: CORAL, fontSize: '1.05rem' }}
        >
          {buttonLabel}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12H19M19 12L13 6M19 12L13 18" />
          </svg>
        </motion.a>
      </div>
    </section>
  )
}
