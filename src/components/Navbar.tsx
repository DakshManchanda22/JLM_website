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

/* Chevron used on the mobile accordion rows — points down, flips up when the
   section is open. */
function Chevron({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="inline-flex shrink-0 items-center justify-center text-white">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.3s' }}
      >
        <path d="M6 9l6 6 6-6" />
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
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                aria-label="JL Morison home"
              >
                <Logo className="h-9 md:h-12 w-auto" />
              </Link>
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

            <nav className="relative flex-1 overflow-y-auto border-t border-white/15 px-6 py-3">
              {ALL_MOBILE.map((label) => {
                const subs = DROPDOWNS[label]
                const href = label === 'Contact Us' ? '/contact-us' : linkHref(label)
                const isOpen = mobileExpanded === label
                return (
                  <div key={label} className="border-b border-white/15">
                    {subs ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(isOpen ? null : label)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between py-4 text-left"
                        >
                          <span className="text-2xl font-normal tracking-tight text-white">
                            {label}
                          </span>
                          <Chevron open={isOpen} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="sub"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col pb-3 pl-3">
                                {subs.map((sub) => (
                                  <Link
                                    key={sub}
                                    href={`/${slug(sub)}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-2.5 text-lg font-light text-white/80 hover:text-white"
                                  >
                                    {sub}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex w-full items-center py-4"
                      >
                        <span className="text-2xl font-normal tracking-tight text-white">
                          {label}
                        </span>
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

