'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * A single full-width editorial image shown just below the homepage quote
 * (the JLM values graphic). Rendered only when marketing has it toggled on and
 * an image is set — otherwise the parent renders nothing, so no empty space is
 * left behind. The aspect ratio reserves space up front to avoid layout shift.
 */
export default function ValuesImage({
  image,
  lqip,
  aspect = 1.05,
  alt = 'The values that guide J.L. Morison',
}: {
  image: string
  lqip?: string
  aspect?: number
  alt?: string
}) {
  return (
    <section className="w-full bg-[#FFFFFF] px-6 md:px-12 pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative mx-auto overflow-hidden rounded-2xl"
        // Size by width, but never let the height exceed the viewport — so the
        // whole graphic is visible in a single view without scrolling. The width
        // is the smallest of: the container, a sensible max, and the width that
        // makes the height fit the screen (viewport height × aspect ratio).
        style={{
          aspectRatio: aspect,
          width: `min(100%, 48rem, calc((100svh - 11rem) * ${aspect}))`,
        }}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-contain"
          {...(lqip
            ? { placeholder: 'blur' as const, blurDataURL: lqip }
            : {})}
        />
      </motion.div>
    </section>
  )
}
