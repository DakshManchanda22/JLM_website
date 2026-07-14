'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Roboto } from 'next/font/google'

const cormorant = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})
const dmSans = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

const EASE = [0.16, 1, 0.3, 1] as const

type Props = {
  /** Shown above the form. */
  heading?: string
  /** Shown above the heading as a small eyebrow. */
  eyebrow?: string
  /** Body copy under the heading. */
  description?: string
  /** Image shown on the left half. */
  image?: string
  /** Delay (ms) before the popup shows after mount. */
  delayMs?: number
}

export default function SubscribePopup({
  heading = 'Subscribe to our blog',
  eyebrow = 'Smart Mums Club',
  description = 'Get the latest stories, science and small wins from the JL Morison family — straight to your inbox.',
  image = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&q=80',
  delayMs = 1000,
}: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  /* Show after a brief delay on every visit */
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  /* Lock body scroll + Escape to close */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setOpen(false)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to email service (Resend / Mailchimp / Sanity webhook)
    setSubmitted(true)
    setTimeout(close, 1600)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="subscribe-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8"
          style={{
            backgroundColor: 'rgba(17, 17, 17, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscribe-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={`${dmSans.className} relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] grid grid-cols-1 md:grid-cols-2`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close subscribe popup"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full border border-[#E8E0D5] bg-white/90 text-[#111111] flex items-center justify-center hover:bg-[#F3EEE6] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Left — image */}
            <div className="relative hidden md:block min-h-[420px]">
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-transparent" />
            </div>

            {/* Right — form */}
            <div className="px-7 py-10 md:px-12 md:py-14 flex flex-col justify-center">
              <p className="text-[11px] tracking-[0.32em] uppercase text-[#7A6438] mb-5 text-center">
                {eyebrow}
              </p>
              <h2
                id="subscribe-heading"
                className={`${cormorant.className} text-[#111111] font-medium text-center leading-[1.05]`}
                style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)' }}
              >
                {heading}
              </h2>
              <p className="mt-5 text-center text-[#555555] text-sm md:text-[15px] leading-relaxed max-w-md mx-auto">
                {description}
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#F3EEE6] text-[#7A6438] flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12L10 17L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className={`${cormorant.className} text-2xl text-[#111111]`}>
                    You&rsquo;re on the list.
                  </p>
                  <p className="text-sm text-[#555555] mt-1">Look out for our next letter.</p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="mt-8">
                  <label htmlFor="subscribe-email" className="sr-only">
                    Your email address
                  </label>
                  <input
                    id="subscribe-email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#E8E0D5] rounded-md px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#B8956A] transition-colors"
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full bg-[#111111] text-white text-sm tracking-[0.18em] uppercase py-4 rounded-md hover:bg-[#222222] transition-colors"
                  >
                    Subscribe
                  </button>
                  <p className="mt-4 text-[11px] text-[#888888] text-center leading-relaxed">
                    By subscribing you agree to receive emails from JL Morison. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
