'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { FactoryContent } from '@/sanity/queries'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * "Our Factory" section, shared across the brand pages (Morisons Baby Dreams,
 * Bigen, Emoform). Shows one factory photo, a short description, and every
 * certification the factory has obtained as a row of badges (logo + name, each
 * optional). Renders nothing when no factory content is set in Sanity, so the
 * page never shows an empty slot. Uses the site's editorial 4-colour palette.
 */
export default function FactorySection({
  factory,
  headingFallback = 'Our Factory',
  /** Section background — pass a brand tone (e.g. a cream) to blend into an
   *  existing panel. Defaults to the site's white surface. */
  background = '#FFFFFF',
  /** 'plain' = content sits directly on the section background.
   *  'card'  = content sits inside a rounded black panel (used on Bigen),
   *            with text/badges inverted for legibility on black. */
  variant = 'plain',
  /** Which side the factory photo sits on (desktop). Defaults to 'left'. */
  imageSide = 'left',
}: {
  factory?: FactoryContent
  headingFallback?: string
  background?: string
  variant?: 'plain' | 'card'
  imageSide?: 'left' | 'right'
}) {
  if (!factory) return null

  const { heading, description, image, imageLqip, certifications } = factory
  const certs = certifications ?? []
  const dark = variant === 'card'
  const imageRight = imageSide === 'right'

  return (
    <section className="w-full px-6 md:px-12 py-16 md:py-24" style={{ background }}>
      <div
        className={`mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16${
          dark ? ' rounded-[2rem] bg-[#0c0703] p-8 md:p-14' : ''
        }`}
      >
        {/* Factory photo */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: EASE }}
            className={`relative w-full overflow-hidden rounded-2xl aspect-[4/3]${
              imageRight ? ' md:order-2' : ''
            }`}
          >
            <Image
              src={image}
              alt={heading || headingFallback}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              {...(imageLqip ? { placeholder: 'blur' as const, blurDataURL: imageLqip } : {})}
            />
          </motion.div>
        )}

        {/* Text + certifications */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
          className={
            image
              ? imageRight
                ? 'md:order-1'
                : ''
              : 'mx-auto max-w-2xl text-center md:col-span-2'
          }
        >
          <h2
            className={`font-semibold leading-[1.05] tracking-tight ${
              dark ? 'text-white' : 'text-[#111111]'
            }`}
            style={{ fontSize: 'clamp(1.9rem, 3.4vw, 3rem)' }}
          >
            {heading || headingFallback}
          </h2>

          {description && (
            <p
              className={`mt-5 max-w-prose text-sm leading-relaxed md:text-base ${
                dark ? 'text-white/70' : 'text-[#555555]'
              }`}
            >
              {description}
            </p>
          )}

          {certs.length > 0 && (
            <div className="mt-8">
              <p
                className={`mb-4 text-[11px] uppercase tracking-[0.28em] ${
                  dark ? 'text-white/55' : 'text-[#555555]'
                }`}
              >
                Certifications
              </p>
              <div className={`flex flex-wrap gap-3.5 ${image ? '' : 'justify-center'}`}>
                {certs.map((c, i) => (
                  <div
                    key={`${c.name}-${i}`}
                    className={`flex items-center gap-3 rounded-full border px-5 py-3 ${
                      dark
                        ? 'border-white/30 bg-white/[0.16]'
                        : 'border-[#111111] bg-[#111111]'
                    }`}
                  >
                    {c.logo && (
                      <span className="relative block h-8 w-8 shrink-0 overflow-hidden">
                        <Image
                          src={c.logo}
                          alt={c.name}
                          fill
                          sizes="32px"
                          className="object-contain"
                          {...(c.logoLqip
                            ? { placeholder: 'blur' as const, blurDataURL: c.logoLqip }
                            : {})}
                        />
                      </span>
                    )}
                    <span className="text-sm font-medium text-white">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
