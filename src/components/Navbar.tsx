'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSiteSettings } from '@/components/SiteSettingsProvider'

const MotionLink = motion(Link)

// Sanity-hosted logo. Marketing can swap it via Site Settings → Brand; this
// hard-coded Sanity CDN URL is the fallback so the navbar never breaks even if
// the settings fetch is empty (and so no local /public asset is needed).
const LOGO_FALLBACK =
  'https://cdn.sanity.io/images/vfv5lxgr/production/789b561991b501203119084ca41e902d11598dc7-391x132.svg'

// Fallback logo is 391×132 (≈2.96); used until Sanity reports the real ratio.
const LOGO_FALLBACK_ASPECT = 391 / 132

function Logo({ className }: { className?: string }) {
  const settings = useSiteSettings()
  const src = settings?.logoUrl || LOGO_FALLBACK
  const aspect =
    settings?.logoAspect && settings.logoAspect > 0
      ? settings.logoAspect
      : LOGO_FALLBACK_ASPECT
  // CSS (`h-9 md:h-12 w-auto`) still controls the rendered size; these width/height
  // attributes only give the browser the aspect ratio so it can reserve the logo's
  // width up-front and avoid layout shift (CLS) while the image loads.
  const height = 48
  const width = Math.round(height * aspect)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="JL Morison"
      width={width}
      height={height}
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
  'Our Brands': ['Morisons Baby Dreams', 'Bigen', 'Emoform', 'Morisons'],
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
            {/* The hamburger ↔ cross toggle is rendered as a fixed element below
                (outside the nav) so it can layer above the full-screen overlay and
                animate in place, staying pinned to this same top-left spot. */}

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

      {/* Hamburger ↔ cross toggle — fixed at the top-left (the hamburger's exact
          spot) and above the overlay (z-[110] > overlay z-[100]) so the three
          bars morph into an X right where they were, and the X closes the menu. */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        className="md:hidden fixed left-5 top-0 z-[110] flex h-[var(--nav-h)] items-center p-1 pr-4"
      >
        <span className="relative flex h-[13px] w-5 flex-col justify-between">
          <span
            className="block h-px w-full origin-center bg-white transition-transform duration-300 ease-out"
            style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
          />
          <span
            className="block h-px w-full bg-white transition-opacity duration-200 ease-out"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className="block h-px w-full origin-center bg-white transition-transform duration-300 ease-out"
            style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
          />
        </span>
      </button>

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
            {/* Logo centred; closing is handled by the morphing toggle (top-left). */}
            <div className="relative flex items-center h-[var(--nav-h)] px-5 border-b border-white/10">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                aria-label="JL Morison home"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Logo className="h-9 md:h-12 w-auto" />
              </Link>
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

