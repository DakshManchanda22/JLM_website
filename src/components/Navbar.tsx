'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const MotionLink = motion(Link)

const DROPDOWNS: Record<string, string[]> = {
  'Our People': ['Our Story', 'Leadership Team', 'Life at JLM'],
  'Our Brands': ['Morisons Baby Dreams', 'Emoform', 'Bigen'],
}

const LEFT = ['Our People', 'Our Brands']
const RIGHT_PLAIN = ['Philanthropy', 'Investor Relations']
const ALL_MOBILE = [...LEFT, ...RIGHT_PLAIN, 'Contact Us']

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')
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

  /* Lock body scroll while mobile overlay is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111]">
        <div ref={navRef} onMouseLeave={() => setActiveDropdown(null)}>
          {/* TOP BAR */}
          <div className="relative flex items-center justify-between h-16 px-5 md:px-8">
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

            {/* LEFT — desktop, plain text triggers with dropdowns */}
            <div className="hidden md:flex items-center gap-7">
              {LEFT.map((label) => {
                const subs = DROPDOWNS[label]
                const isActive = activeDropdown === label
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
            </div>

            {/* CENTRE — absolutely centred logo */}
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="font-bold tracking-[0.3em] text-[13px] text-white">
                JL MORISON
              </span>
            </Link>

            {/* RIGHT — desktop */}
            <div className="hidden md:flex items-center gap-7">
              {RIGHT_PLAIN.map((label) => (
                <Link
                  key={label}
                  href={`/${slug(label)}`}
                  onMouseEnter={() => setActiveDropdown(null)}
                  className={plainLink}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/contact-us"
                onMouseEnter={() => setActiveDropdown(null)}
                className={joinUsPill}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile right-side spacer to keep logo centred */}
            <div className="md:hidden w-7" />
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
            <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
              <div className="w-6" />
              <span className="text-white font-bold tracking-[0.3em] text-[13px]">
                JL MORISON
              </span>
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

            <nav className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              {ALL_MOBILE.map((label, i) => {
                const subs = DROPDOWNS[label]
                const isExpanded = mobileExpanded === label
                const isJoinUs = label === 'Contact Us'
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                    className="text-center"
                  >
                    {subs ? (
                      <button
                        onClick={() =>
                          setMobileExpanded((p) =>
                            p === label ? null : label
                          )
                        }
                        className="text-white text-2xl font-light tracking-wide"
                      >
                        {label}
                      </button>
                    ) : isJoinUs ? (
                      <Link
                        href="/contact-us"
                        onClick={() => setMobileOpen(false)}
                        className="inline-block rounded-full border border-white bg-transparent text-white px-5 py-2 text-base font-normal"
                      >
                        {label}
                      </Link>
                    ) : (
                      <Link
                        href={`/${slug(label)}`}
                        onClick={() => setMobileOpen(false)}
                        className="text-white text-2xl font-light tracking-wide"
                      >
                        {label}
                      </Link>
                    )}

                    <AnimatePresence>
                      {subs && isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="overflow-hidden mt-4 flex flex-col items-center gap-3"
                        >
                          {subs.map((sub) => (
                            <Link
                              key={sub}
                              href={`/${slug(sub)}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-white/70 text-sm tracking-wide"
                            >
                              {sub}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
