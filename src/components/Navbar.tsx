'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const MotionLink = motion(Link)

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="46 123 394 103"
      fill="currentColor"
      aria-label="JL Morison"
      role="img"
      className={className}
    >
      <defs>
        <linearGradient id="GradientFill_17" x1="1287.3" y1="665.06" x2="1307.73" y2="713.18" gradientTransform="translate(-1222.19 -498.16) rotate(-.06)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#eb8038"/>
      <stop offset=".16" stopColor="#e73d30"/>
      <stop offset=".38" stopColor="#e73731"/>
      <stop offset=".6" stopColor="#eb8038"/>
      <stop offset=".83" stopColor="#f2af2c"/>
      <stop offset="1" stopColor="#efa534"/>
    </linearGradient>
        <linearGradient id="GradientFill_16" x1="1322.82" y1="693.46" x2="1331.7" y2="657.83" gradientTransform="translate(-1222.19 -498.16) rotate(-.06)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#38358d"/>
      <stop offset=".25" stopColor="#38358d"/>
      <stop offset=".64" stopColor="#6e4297"/>
      <stop offset=".91" stopColor="#703e92"/>
      <stop offset="1" stopColor="#5a398c"/>
    </linearGradient>
        <linearGradient id="GradientFill_15" x1="1276.21" y1="624.15" x2="1334.89" y2="675.16" gradientTransform="translate(-1222.19 -498.16) rotate(-.06)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#0b82ba"/>
      <stop offset=".11" stopColor="#077bb4"/>
      <stop offset=".21" stopColor="#0487be"/>
      <stop offset=".36" stopColor="#009d8f"/>
      <stop offset=".49" stopColor="#73b74e"/>
      <stop offset=".75" stopColor="#9ac143"/>
      <stop offset=".97" stopColor="#8cbe45"/>
      <stop offset="1" stopColor="#8cbe45"/>
    </linearGradient>
        <linearGradient id="GradientFill_14" x1="1297.64" y1="641.66" x2="1346.25" y2="683.91" gradientTransform="translate(-1222.19 -498.16) rotate(-.06)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#e73731"/>
      <stop offset=".19" stopColor="#e73831"/>
      <stop offset=".49" stopColor="#a23487"/>
      <stop offset=".78" stopColor="#7f3f8e"/>
      <stop offset="1" stopColor="#5a398c"/>
    </linearGradient>
        <linearGradient id="GradientFill_3" x1="1267.71" y1="650.9" x2="1325.77" y2="664.3" gradientTransform="translate(-1222.19 -498.16) rotate(-.06)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#0b82ba"/>
      <stop offset=".2" stopColor="#087cb5"/>
      <stop offset=".4" stopColor="#0072b0"/>
      <stop offset=".73" stopColor="#42378c"/>
      <stop offset="1" stopColor="#44368a"/>
    </linearGradient>
        <linearGradient id="GradientFill_4" x1="1320.68" y1="663.12" x2="1302.9" y2="717.85" gradientTransform="translate(-1222.19 -498.16) rotate(-.06)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#8cbe45"/>
      <stop offset=".15" stopColor="#8cbe45"/>
      <stop offset=".27" stopColor="#bdd043"/>
      <stop offset=".36" stopColor="#d6da2b"/>
      <stop offset=".48" stopColor="#f9e437"/>
      <stop offset=".53" stopColor="#f9e437"/>
      <stop offset=".68" stopColor="#fbcb2e"/>
      <stop offset=".77" stopColor="#f3b327"/>
      <stop offset=".87" stopColor="#f2af2c"/>
      <stop offset="1" stopColor="#efa534"/>
    </linearGradient>
      </defs>
      {/* Emblem (flower) — original brand colours from the JLM logo */}
      <path d="M72.08,163.4l-.84,1.11-.27.32c-12.64,16.63-10.86,35.73.4,55.18l4.49-14.83c-3.66-9.43-6.49-24.65,8.36-39.14h0l-12.14-2.63Z" fill="url(#GradientFill_17)" />
      <path d="M138.72,164.38l.04.02c-10.45,13.69-22.87,22.15-37.27,22.97-2.51.13-5.13-.27-7.58-.7-6.83-1-14.13-3.28-19.32-6.26,1.05-3.09,2.6-5.95,4.93-9.12,21.48,11.44,35.98,2.14,43.83-5.36h-.02s15.39-1.56,15.39-1.56Z" fill="url(#GradientFill_16)" />
      <path d="M51.52,128.17h.26c26.94,3.13,41.74,14.59,47.46,31.19l.23.62-.02.04.02.05,1.31,4.8-10.12,2.47c-.33-1.36-.9-2.75-1.42-4.18v.03l-.02-.07-4.97-9.04c-4.34-5.43-11.09-10.18-21.67-13.02-.05,0-.14-.03-.2-.03l-10.86-12.85Z" fill="url(#GradientFill_15)" />
      <path d="M92.37,150.41c16.07-4.54,31.7,1.2,46.26,13.85l.08.11-15.39,1.55-.09-.04c-7.75-4.87-20.08-9.88-34.81-2.35-4.58,2.39-7.27,5.31-10.12,9.6l-9.58-5.14c.94-1.7,2.2-3.08,3.31-4.61,4.77-5.99,11.62-9.88,20.33-12.98Z" fill="url(#GradientFill_14)" />
      <path d="M97.86,187.17c-29.47-2.78-48.55-19.98-46.33-59l10.86,12.85c2.23,25.38,18.31,32.33,29.13,34.59l7.1,1.34-.76,10.22Z" fill="url(#GradientFill_3)" />
      <path d="M91.49,175.54h0c-.12-3.68-.69-8.02-2.25-12.39,3.57-1.7,6.94-2.71,10.21-3.13,2.52,7.69,3.63,17.59,2.25,26.08l-.02.03c-.03.39-.1.81-.2,1.19,0,.09,0,.13-.02.19-.15.62-.34,1.17-.51,1.65-3.88,11.72-15.83,23.8-29.46,30.75-.05.04-.07.06-.12.08l4.49-14.83.07-.05c7.11-5.1,16.11-14.07,15.56-29.58h.03v.07l-.03-.07Z" fill="url(#GradientFill_4)" />
      {/* "JL MORISON" wordmark — inherits navbar text colour */}
      <path d="M135.71,182.79h8.97l.03,23.31c0,3.69-.91,6.67-2.85,8.89-1.95,2.19-4.79,3.3-8.62,3.31-1.94,0-3.63-.42-5.09-1.3-1.5-.93-2.75-2.15-3.79-3.77l5.17-5.48c.05.06.09.17.15.23.04.11.07.18.12.27.35.34.67.74,1.01,1.07.33.33.65.65,1.02.91.21.14.4.3.66.35.21.09.46.15.63.15.97,0,1.61-.35,1.94-1.02.37-.71.56-1.46.63-2.22.02-.33.04-.62,0-.91.02-.24.04-.53.04-.74-.02-.07,0-.09-.04-.13,0-.05.02-.06.02-.11v-22.81Z" />
      <polygon points="168.19 182.62 168.23 210.68 179.03 210.63 179.03 218.27 159.28 218.27 159.22 182.62 168.19 182.62" />
      <polygon points="193.59 218.23 199.39 182.82 208.25 182.82 215.31 201.72 222.74 182.82 231.69 182.8 236.92 218.2 227.96 218.21 225.39 197.82 225.31 197.82 217.01 218.21 213.43 218.21 205.5 197.82 205.35 197.85 202.5 218.24 193.59 218.23" />
      <path d="M258.2,181.29c4.99.02,9.41,1.68,13.34,5.03,3.9,3.3,5.84,7.58,5.84,12.79,0,5.61-1.79,10.19-5.37,13.75-3.61,3.57-8.19,5.34-13.74,5.34s-10.15-1.73-13.76-5.26c-3.6-3.59-5.41-8.18-5.43-13.76-.02-5.23,1.96-9.51,5.84-12.8,3.86-3.36,8.31-5.01,13.31-5.03l-.02-.06h0ZM258.22,190.03c-2.71.02-4.98,1-6.93,2.85-1.93,1.86-2.84,3.93-2.84,6.3,0,2.98.93,5.45,2.84,7.41,1.95,1.99,4.26,2.95,6.97,2.97,2.68-.02,4.97-.99,6.88-2.99,1.93-1.96,2.88-4.42,2.86-7.39,0-2.39-.93-4.5-2.86-6.38-1.94-1.86-4.2-2.77-6.92-2.77Z" />
      <path d="M299.5,203.51l10.98,14.51h-11.21s-8.54-13.64-8.54-13.64l-.05.03v13.64h-9.02l-.04-35.38h13.44c3.44.04,6.29.91,8.56,2.61,2.36,1.73,3.53,4.47,3.53,8.27,0,2.46-.67,4.61-1.96,6.51-1.34,1.86-3.2,3.07-5.67,3.5l-.03-.04h0ZM290.66,189.63v8.85l.87.02c.11.03.33.03.44.03.16,0,.32,0,.41-.03,1.35-.03,2.57-.36,3.72-.91,1.08-.59,1.68-1.76,1.63-3.5,0-1.72-.58-2.91-1.65-3.48-1.12-.57-2.34-.92-3.7-.97-.12-.02-.29-.02-.42,0-.13,0-.33,0-.46-.02h-.85Z" />
      <polygon points="323.51 182.63 323.57 218.01 314.58 218.03 314.54 182.62 323.51 182.63" />
      <path d="M352.08,184.52l-3.53,6.95c-.85-.64-1.76-1.22-2.81-1.57-1.04-.47-2.12-.66-3.22-.67-.1,0-.31.01-.48.05-.17.01-.35.04-.58.1-.68.17-1.31.5-1.89.91-.63.5-.9,1.06-.9,1.85,0,.74.27,1.31.85,1.76.51.44,1.15.83,1.74,1.09.28.1.52.18.77.22.21.11.44.15.64.21l2.3.68c2.43.68,4.45,1.77,6.09,3.19,1.65,1.37,2.47,3.45,2.47,6.32v.7c-.07,1.6-.37,3.13-.87,4.64-.52,1.52-1.44,2.88-2.71,3.96-1.15.99-2.5,1.74-3.92,2.24-1.55.52-2.98.82-4.55.89-.22.03-.48.02-.7.05-.24,0-.43.05-.7,0-2.16.05-4.23-.29-6.33-.95-2.14-.73-4.05-1.68-5.78-2.91l3.83-7.27c1.19.98,2.36,1.81,3.65,2.52,1.41.7,2.82,1.08,4.3,1.07.04,0,.13,0,.19.03.05-.02.11-.02.22,0,1.04-.09,1.95-.42,2.7-.96.86-.59,1.29-1.41,1.29-2.54.01-.87-.35-1.57-1.01-2.08-.72-.51-1.53-.94-2.37-1.25-.35-.11-.72-.23-1.09-.32-.34-.15-.76-.22-1-.29-.07-.06-.11-.06-.19-.13-.08,0-.16-.02-.25,0-2.71-.79-4.86-1.79-6.51-2.94-1.65-1.2-2.4-3.42-2.4-6.75s1.07-6.23,3.3-8.44c2.29-2.08,5.11-3.09,8.61-3.1.67,0,1.39.03,2.14.07.74.06,1.5.2,2.2.37,1.22.25,2.34.59,3.45.95,1.08.45,2.14.86,3.02,1.42v-.05Z" />
      <path d="M376.35,181.16c4.97.02,9.42,1.7,13.3,5.06,3.92,3.28,5.85,7.56,5.85,12.8,0,5.59-1.74,10.18-5.42,13.74-3.56,3.59-8.14,5.31-13.7,5.31-5.55.03-10.1-1.72-13.76-5.27-3.62-3.54-5.42-8.12-5.42-13.75,0-5.23,1.96-9.5,5.86-12.8,3.88-3.37,8.3-4.99,13.28-4.99v-.1h0ZM376.35,189.9c-2.65.06-4.99.99-6.93,2.85-1.87,1.85-2.86,3.97-2.83,6.32,0,3.01.96,5.45,2.86,7.43,1.96,1.96,4.26,2.95,6.94,2.9,2.68.05,4.99-.98,6.91-2.97,1.9-1.92,2.85-4.42,2.85-7.36,0-2.4-1-4.52-2.86-6.34-1.93-1.9-4.24-2.83-6.93-2.83Z" />
      <polygon points="400.3 217.94 400.25 182.56 409.24 182.54 425.81 204.14 425.91 204.15 425.87 182.5 434.83 182.5 434.88 217.88 425.91 217.93 409.37 196.2 409.3 196.2 409.3 217.93 400.3 217.94" />
    </svg>
  )
}

const DROPDOWNS: Record<string, string[]> = {
  'Our People': ['Our Story', 'Leadership Team', 'Life at JLM'],
  'Our Brands': ['Morisons Baby Dreams', 'Bigen', 'Emoform', 'Morisons'],
}

// Order shown in the right-aligned desktop cluster (all right-aligned via ml-auto).
// ESG and Philanthropy are two separate top-level links (no combined dropdown).
const NAV_ITEMS = ['Our Brands', 'Our People', 'ESG', 'Philanthropy']
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
              <Logo className="h-7 md:h-8 w-auto text-white" />
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
              <Logo className="h-7 md:h-8 w-auto text-white" />
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

            <nav className="flex-1 flex flex-col items-center justify-center gap-7 px-8">
              {ALL_MOBILE.map((label, i) => {
                const subs = DROPDOWNS[label]
                const isExpanded = mobileExpanded === label
                const isPill = label === 'Contact Us'
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
                        className="text-white text-[clamp(2rem,8vw,2.75rem)] font-light tracking-wide leading-tight py-1"
                      >
                        {label}
                      </button>
                    ) : isPill ? (
                      <Link
                        href="/contact-us"
                        onClick={() => setMobileOpen(false)}
                        className="inline-block rounded-full border border-white bg-transparent text-white px-6 py-2.5 text-lg font-normal"
                      >
                        {label}
                      </Link>
                    ) : (
                      <Link
                        href={linkHref(label)}
                        onClick={() => setMobileOpen(false)}
                        className="text-white text-[clamp(2rem,8vw,2.75rem)] font-light tracking-wide leading-tight py-1"
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
                          className="overflow-hidden mt-4 flex flex-col items-center gap-4"
                        >
                          {subs.map((sub) => (
                            <Link
                              key={sub}
                              href={`/${slug(sub)}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-white/70 text-lg tracking-wide"
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

