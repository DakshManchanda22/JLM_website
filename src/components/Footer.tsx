'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const COMPANY_LINKS = [
  { label: 'About', href: '/our-story' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Privacy Policy', href: 'https://storage.googleapis.com/jlm_website_v2/Privacy-Policy.pdf', external: true },
]

/* Simple inline SVGs — no extra dependency */
const SOCIAL = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/j-l-morison/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
]

const EASE = [0.16, 1, 0.3, 1] as const

/* Reusable animated link with sliding underline */
function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const className =
    'group relative inline-block text-white/55 text-sm leading-relaxed hover:text-white transition-colors duration-200'
  const underline = (
    <span className="absolute bottom-[-1px] left-0 h-px w-0 bg-white/60 transition-[width] duration-300 ease-out group-hover:w-full" />
  )
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
          {underline}
        </a>
      ) : (
        <Link href={href} className={className}>
          {label}
          {underline}
        </Link>
      )}
    </li>
  )
}

export default function Footer({ roundedTop = true }: { roundedTop?: boolean }) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 52 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: EASE }}
      className="bg-[#111111]"
      style={
        roundedTop
          ? { borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }
          : undefined
      }
    >
      {/* ── 3-column content ── */}
      <div className="px-10 md:px-16 lg:px-20 pt-16 md:pt-20 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16">

          {/* Col 1 — Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
          >
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-7">
              Company
            </h4>
            <ul className="space-y-3.5">
              {COMPANY_LINKS.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </ul>
          </motion.div>

          {/* Col 2 — Visit Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
          >
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-7">
              Visit Us
            </h4>
            {/* ADD ADDRESS HERE */}
            <address className="not-italic text-white/55 text-sm leading-[1.9] space-y-0">
              <p>J. L. Morison (India) Limited</p>
              <p>Peninsula Business Park, 8th Floor, Tower A,</p>
              <p>Senapati Bapat Marg, Lower Parel,</p>
              <p>Mumbai 400013</p>
            </address>
          </motion.div>

          {/* Col 3 — Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.19 }}
          >
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-7">
              Follow Us
            </h4>
            <div className="flex gap-5 flex-wrap">
              {SOCIAL.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/45 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-white/30 text-xs mt-8 leading-relaxed max-w-[220px]">
              Follow our journey — products, stories, and the goodness we&apos;re building every day.
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-10 md:mx-16 lg:mx-20 border-t border-white/[0.1]" />

      {/* ── Bottom bar ── */}
      <div className="px-10 md:px-16 lg:px-20 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span className="text-white/25 text-[11px] tracking-[0.28em] font-medium uppercase">
          JL MORISON
        </span>
        <span className="text-white/25 text-[11px]">
          © 2024 JL Morison India Ltd. All rights reserved.
        </span>
      </div>
    </motion.footer>
  )
}
