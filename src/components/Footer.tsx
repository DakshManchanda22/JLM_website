'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/components/SiteSettingsProvider'
import type { FooterLinkData } from '@/sanity/queries'

/* ─────────────── Code defaults (used until Sanity is filled in) ─────────────── */

const DEFAULT_COMPANY_LINKS: FooterLinkData[] = [
  { label: 'About', href: '/our-story' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Privacy Policy', href: 'https://storage.googleapis.com/jlm_website_v2/Privacy-Policy.pdf', external: true },
]

const DEFAULT_ADDRESS = [
  'J. L. Morison (India) Limited',
  'Peninsula Business Park, 8th Floor, Tower A,',
  'Senapati Bapat Marg, Lower Parel,',
  'Mumbai 400013',
]

const DEFAULT_SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/j-l-morison/',
}

const DEFAULT_FOLLOW_TEXT =
  "Follow our journey — products, stories, and the goodness we're building every day."

const DEFAULT_COPYRIGHT = '© 2024 JL Morison India Ltd. All rights reserved.'

/* Simple inline SVGs — no extra dependency. Keyed so any social link set in
   Sanity renders its matching icon. */
type SocialKey = 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'twitter'

const SOCIAL_ICONS: Record<SocialKey, { name: string; icon: React.ReactNode }> = {
  linkedin: {
    name: 'LinkedIn',
    // Full official LinkedIn logo (brand blue), shown at a larger size than the
    // other monochrome social marks.
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="4.2" fill="#0A66C2" />
        <path
          fill="#fff"
          d="M7.06 9.4H4.5V19.5h2.56V9.4Zm.17-2.9a1.48 1.48 0 1 0-2.96 0 1.48 1.48 0 0 0 2.96 0ZM19.5 19.5h-2.56v-4.93c0-1.18-.02-2.69-1.64-2.69-1.64 0-1.9 1.28-1.9 2.6v5.02H10.85V9.4h2.46v1.38h.03c.34-.65 1.18-1.34 2.44-1.34 2.6 0 3.08 1.71 3.08 3.94v6.12Z"
        />
      </svg>
    ),
  },
  instagram: {
    name: 'Instagram',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  facebook: {
    name: 'Facebook',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  youtube: {
    name: 'YouTube',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  twitter: {
    name: 'X / Twitter',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
}

const SOCIAL_ORDER: SocialKey[] = ['linkedin', 'instagram', 'facebook', 'youtube', 'twitter']

const EASE = [0.16, 1, 0.3, 1] as const

/* Reusable animated link with sliding underline */
function FooterLink({ label, href, external }: FooterLinkData) {
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
  const settings = useSiteSettings()

  /* Prefer Sanity content; fall back to the code defaults when unset. */
  const companyLinks =
    settings?.footerCompanyLinks && settings.footerCompanyLinks.length > 0
      ? settings.footerCompanyLinks
      : DEFAULT_COMPANY_LINKS
  const address =
    settings?.footerAddress && settings.footerAddress.length > 0
      ? settings.footerAddress
      : DEFAULT_ADDRESS
  const social = settings?.footerSocial ?? DEFAULT_SOCIAL
  const socialLinks = SOCIAL_ORDER.flatMap((key) => {
    const href = (social as Record<string, string | undefined>)[key]
    return href ? [{ key, href, ...SOCIAL_ICONS[key] }] : []
  })
  const followText = settings?.footerFollowText ?? DEFAULT_FOLLOW_TEXT
  const copyright = settings?.footerCopyright ?? DEFAULT_COPYRIGHT

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
              {companyLinks.map((link) => (
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
            <address className="not-italic text-white/55 text-sm leading-[1.9] space-y-0">
              {address.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </address>
          </motion.div>

          {/* Col 3 — Follow Us */}
          {socialLinks.length > 0 && (
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
                {socialLinks.map(({ key, name, href, icon }) => (
                  <a
                    key={key}
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
              {followText && (
                <p className="text-white/30 text-xs mt-8 leading-relaxed max-w-[220px]">
                  {followText}
                </p>
              )}
            </motion.div>
          )}

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
          {copyright}
        </span>
      </div>
    </motion.footer>
  )
}
