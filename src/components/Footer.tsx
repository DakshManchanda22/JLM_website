'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Privacy Policy', href: 'https://storage.googleapis.com/jlm_website_v2/Privacy-Policy.pdf', external: true },
]

/* Simple inline SVGs — no extra dependency */
const SOCIAL = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UCp6BmL9xsqjrCmiJbocn4tg',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
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
  {
    name: 'X / Twitter',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 52 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: EASE }}
      className="bg-[#111111]"
      style={{ borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }}
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
              <p>J.L. Morison (India) Ltd.</p>
              <p>1A, Shakespeare Sarani</p>
              <p>Kolkata, West Bengal 700 071</p>
            </address>
            <p className="text-white/30 text-xs mt-5 leading-relaxed">
              Mon – Fri &nbsp;·&nbsp; 9 am – 6 pm IST
            </p>
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
