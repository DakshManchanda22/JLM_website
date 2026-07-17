'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const MotionLink = motion(Link)

function Logo({ className }: { className?: string }) {
  // Brand logo lives in /public. The "-light" variant recolours the near-black
  // wordmark to white so it reads on the dark navbar; the emblem stays colourful.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/jlm-logo-light.svg"
      alt="JL Morison"
      draggable={false}
      className={className}
    />
  )
}

/* Circular outlined arrow button (an up-arrow rotated 90° to point right, or
   -90° to point left / back) — used on the mobile menu rows. */
function CircleArrow({ dir = 'right' }: { dir?: 'right' | 'left' }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: 46, height: 46, border: '1.5px solid #ffffff' }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: `rotate(${dir === 'right' ? 90 : -90}deg)` }}
      >
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </span>
  )
}

const DROPDOWNS: Record<string, string[]> = {
  'Our People': ['Our Story', 'Leadership Team', 'Life at JLM'],
  'Our Brands': ['Morisons Baby Dreams', 'Bigen', 'Emoform'],
}

// Order shown in the right-aligned desktop cluster (all right-aligned via ml-auto).
// ESG and Philanthropy are two separate top-level links (no combined dropdown).
const NAV_ITEMS = ['Our Brands', 'Our People', 'ESG', 'Philanthropy', 'Investor Relations']
const ALL_MOBILE = [...NAV_ITEMS, 'Contact Us']

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

const linkHref = (label: string) => `/${slug(label)}`
const EASE = [0.16, 1, 0.3, 1] as const

const plainLink =
  'text-sm font-normal text-white hover:text-white/80 transition-colors whitespace-nowrap cursor-pointer'

const joinUsPill =
  'rounded-full border border-white bg-transparent text-white text-sm font-normal px-4 py-1.5 hover:bg-white/10 transition-colors whitespace-nowrap'

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  /* Click outside to close desktop dropdown */
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  /* Lock body scroll while mobile overlay is open; reset the drill-down to the
     top level whenever the menu closes. */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    if (!mobileOpen) setMobileExpanded(null)
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111]">
        <div ref={navRef} onMouseLeave={() => setActiveDropdown(null)}>
          {/* TOP BAR */}
          <div className="relative flex items-center h-[var(--nav-h)] px-5 md:px-8">
            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="md:hidden flex flex-col gap-[5px] p-1"
            >
              <span className="block w-5 h-px bg-white" />
              <span className="block w-5 h-px bg-white" />
              <span className="block w-5 h-px bg-white" />
            </button>

            {/* LOGO — centred on mobile, left-aligned on desktop */}
            <Link
              href="/"
              aria-label="JL Morison home"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0"
            >
              <Logo className="h-9 md:h-12 w-auto" />
            </Link>

            {/* RIGHT — desktop: all tabs, right-aligned */}
            <div className="hidden md:flex items-center gap-7 ml-auto">
              {NAV_ITEMS.map((label) => {
                const subs = DROPDOWNS[label]
                const isActive = activeDropdown === label

                // Plain link (no dropdown) — e.g. ESG, Philanthropy.
                if (!subs) {
                  return (
                    <Link
                      key={label}
                      href={linkHref(label)}
                      onMouseEnter={() => setActiveDropdown(null)}
                      className={plainLink}
                    >
                      {label}
                    </Link>
                  )
                }

                return (
                  <div
                    key={label}
                    onMouseEnter={() => setActiveDropdown(label)}
                    className="relative"
                  >
                    <button className={plainLink}>{label}</button>

                    {/* Vertical sub-pill stack beneath the trigger */}
                    <AnimatePresence>
                      {isActive && subs && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22, ease: EASE }}
                          className="absolute left-0 top-full pt-6 flex flex-col items-start gap-2"
                        >
                          {subs.map((sub, i) => (
                            <MotionLink
                              key={sub}
                              href={`/${slug(sub)}`}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: i * 0.08,
                                duration: 0.28,
                                ease: EASE,
                              }}
                              onClick={() => setActiveDropdown(null)}
                              className="rounded-full border border-gray-300 bg-white text-xs px-4 py-1.5 text-[#111111] hover:bg-gray-50 transition-colors whitespace-nowrap shadow-sm"
                            >
                              {sub}
                            </MotionLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
              <Link
                href="/contact-us"
                onMouseEnter={() => setActiveDropdown(null)}
                className={joinUsPill}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile right-side spacer to keep logo centred */}
            <div className="md:hidden w-7 ml-auto" />
          </div>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[100] bg-[#111111] flex flex-col"
          >
            <div className="flex items-center justify-between h-[var(--nav-h)] px-5 border-b border-white/10">
              <div className="w-6" />
              <Logo className="h-9 md:h-12 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M1.5 1.5L16.5 16.5M16.5 1.5L1.5 16.5"
                    stroke="#ffffff"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden border-t border-white/15">
              <AnimatePresence initial={false} mode="wait">
                {mobileExpanded === null ? (
                  <motion.nav
                    key="main"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="absolute inset-0 overflow-y-auto px-6 py-3"
                  >
                    {ALL_MOBILE.map((label) => {
                      const subs = DROPDOWNS[label]
                      const href = label === 'Contact Us' ? '/contact-us' : linkHref(label)
                      const row = (
                        <div className="flex w-full items-center justify-between py-5">
                          <span className="text-3xl font-normal tracking-tight text-white">
                            {label}
                          </span>
                          <CircleArrow dir="right" />
                        </div>
                      )
                      return (
                        <div key={label} className="border-b border-white/15">
                          {subs ? (
                            <button
                              type="button"
                              onClick={() => setMobileExpanded(label)}
                              className="block w-full text-left"
                            >
                              {row}
                            </button>
                          ) : (
                            <Link
                              href={href}
                              onClick={() => setMobileOpen(false)}
                              className="block w-full"
                            >
                              {row}
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </motion.nav>
                ) : (
                  <motion.nav
                    key="sub"
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 28 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="absolute inset-0 overflow-y-auto px-6 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(null)}
                      aria-label="Back"
                      className="mb-2 mt-2 block"
                    >
                      <CircleArrow dir="left" />
                    </button>
                    {(DROPDOWNS[mobileExpanded] ?? []).map((sub) => (
                      <div key={sub} className="border-b border-white/15">
                        <Link
                          href={`/${slug(sub)}`}
                          onClick={() => setMobileOpen(false)}
                          className="block w-full"
                        >
                          <div className="flex w-full items-center justify-between py-5">
                            <span className="text-3xl font-normal tracking-tight text-white">
                              {sub}
                            </span>
                            <CircleArrow dir="right" />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

