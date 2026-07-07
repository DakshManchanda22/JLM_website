'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import EmoformFeatures from './EmoformFeatures'
import EmoformScrollytelling from './EmoformScrollytelling'
import EmoformGumCare from './EmoformGumCare'
import Footer from '@/components/Footer'
import type { EmoformView } from '@/sanity/queries'

/* "Sensitivity ka" → Inter (Latin); "अंत, तुरंत" → Noto Sans Devanagari,
   which pairs cleanly with Inter and actually renders Devanagari glyphs. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-inter',
})
const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['700', '800'],
})

/* Royal-blue scheme from the EMOFORM-R reference */
const BG_GRADIENT =
  'radial-gradient(120% 120% at 25% 20%, #3a5db5 0%, #264a9e 40%, #16285a 75%, #0f1d44 100%)'
const EASE = [0.16, 1, 0.3, 1] as const

export default function EmoformClient({ cms }: { cms?: EmoformView }) {
  const hero1 = cms?.heroLine1 ?? 'Sensitivity ka'
  const hero2 = cms?.heroLine2 ?? 'अंत,   तुरंत'
  const flag = cms?.heroFlag ?? 'Swiss Formula'
  const heroImg = cms?.heroImage

  /* The wide gap between the Hindi words (baked-in non-breaking spaces) frames
     the tube in landscape/desktop, but looks unnatural in portrait where no
     tube sits between them. Collapse any run of spaces/NBSPs to one space when
     the viewport is taller than it is wide. */
  const [isPortrait, setIsPortrait] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)')
    const update = () => setIsPortrait(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const hero2Display = isPortrait
    ? hero2.replace(/\s+/g, ' ').trim()
    : hero2

  /* Hold the slide-up until the full toothpaste image has decoded, so the
     tube is always sharp as it rises — never the blurry LQIP placeholder.
     A short fallback timer guarantees it still appears if onLoad is missed. */
  const [heroLoaded, setHeroLoaded] = useState(false)
  useEffect(() => {
    if (!heroImg) return
    const t = setTimeout(() => setHeroLoaded(true), 1500)
    return () => clearTimeout(t)
  }, [heroImg])

  return (
    <>
      <section
        className={`${inter.variable} relative w-full overflow-hidden`}
        style={{ background: BG_GRADIENT, minHeight: 'calc(100svh - 56px)' }}
      >
        {/* Headline + product are BOTH width-driven (vw) so they fill the
            width and stay in proportion to each other on any resize. */}

        {/* ── "Swiss Formula" ribbon flag, pops in from the top-right ── */}
        <motion.div
          initial={{ x: '120%', y: '-40%', opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.55 }}
          className={`${inter.className} absolute right-0 top-4 z-20 lg:top-6`}
        >
          <div
            className="flex items-center bg-[#E2604A] py-2.5 pl-8 pr-5 text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)]"
            style={{
              clipPath:
                'polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)',
            }}
          >
            <span
              className="font-black uppercase tracking-[0.12em]"
              style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.05rem)' }}
            >
              {flag}
            </span>
          </div>
        </motion.div>

        {/* ── Headline: when the screen is taller than it is wide (portrait) the
             tagline sits ABOVE the product and on top in the stack so the tube
             can never cover it. When wider than tall (landscape / desktop) it
             centres BEHIND the product for the layered hero look. ── */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-start px-4 pt-[13vh] text-center select-none landscape:z-0 landscape:justify-center landscape:pt-0">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className={`${inter.className} block font-extrabold leading-[0.95] tracking-tight text-white`}
            style={{ fontSize: 'clamp(2.75rem, 11vw, 13rem)' }}
          >
            {hero1}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className={`${devanagari.className} block font-extrabold leading-[1.1] tracking-tight text-white`}
            style={{ fontSize: 'clamp(2.75rem, 11vw, 13rem)' }}
          >
            {hero2Display}
          </motion.span>
        </div>

        {/* ── Toothpaste — width-driven like the headline; big up to the lg
             breakpoint (phones + tablets), trimmer on desktop. Bottom sits at
             the section edge with ~5% cropped. ── */}
        <div className="absolute inset-0 z-10 flex items-end justify-center">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: heroLoaded ? '0%' : '100%' }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            className="relative flex justify-center"
          >
            {heroImg && (
              <Image
                src={heroImg}
                alt="Emoform sensitivity toothpaste"
                width={1500}
                height={1739}
                priority
                onLoad={() => setHeroLoaded(true)}
                sizes="(max-width: 1024px) 86vw, 40vw"
                className="w-[86vw] max-w-[420px] h-auto -translate-x-[8%] object-contain drop-shadow-2xl lg:max-w-none lg:w-[40vw]"
                {...(cms?.heroImageLqip
                  ? { placeholder: 'blur' as const, blurDataURL: cms.heroImageLqip }
                  : {})}
              />
            )}
          </motion.div>
        </div>
      </section>

      <EmoformFeatures cms={cms} />

      <EmoformScrollytelling cms={cms} />

      <EmoformGumCare cms={cms} />

      {/* Closing blue behind the footer's rounded top corners so the curve
          blends into the CTA section instead of revealing white. */}
      <div style={{ backgroundColor: '#13285a' }}>
        <Footer />
      </div>
    </>
  )
}
