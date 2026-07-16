/* eslint-disable @typescript-eslint/no-explicit-any */
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

import { urlFor } from '@/sanity/image'
import InlineImage from './InlineImage'
import PullQuote from './PullQuote'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})
const dmSans = DM_Sans({ subsets: ['latin'] })

/**
 * Maps Sanity Portable Text blocks to editorial-style React.
 * Handles paragraphs, H2/H3 subheadings, blockquotes, bulleted + numbered lists,
 * plus custom blocks: inline images (with optional full-bleed) and pull quotes.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p
        className={`${dmSans.className} text-[#222222] mb-7 text-[18px] leading-[1.8]`}
      >
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className={`${cormorant.className} text-[#111111] mt-16 mb-6 font-medium leading-[1.15]`}
        style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={`${cormorant.className} text-[#111111] mt-12 mb-4 font-semibold leading-[1.2]`}
        style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)' }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`${cormorant.className} italic text-[#333333] border-l-2 border-[#E8E0D5] pl-6 my-10`}
        style={{ fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', lineHeight: 1.55 }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className={`${dmSans.className} text-[#222222] mb-7 pl-6 space-y-3 text-[18px] leading-[1.75]`}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className={`${dmSans.className} text-[#222222] mb-7 pl-6 space-y-3 text-[18px] leading-[1.75] list-decimal marker:text-[#7A6438] marker:font-medium`}
      >
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-1 marker:text-[#7A6438]">{children}</li>
    ),
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[#111111]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href ?? '#'
      const external = /^https?:\/\//.test(href)
      const cls = 'underline underline-offset-4 decoration-[#B8956A] hover:text-[#7A6438] transition-colors'
      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      )
    },
  },
  types: {
    inlineImage: ({ value }) => {
      // Supports both Sanity image refs and a plain string URL (for demo fallback)
      const src: string | undefined = value?._url
        ? value._url
        : value?.asset
          ? urlFor(value).width(1600).url()
          : undefined
      if (!src) return null
      return (
        <InlineImage
          src={src}
          alt={value?.alt ?? ''}
          caption={value?.caption}
          fullBleed={value?.fullBleed}
        />
      )
    },
    pullQuote: ({ value }) => (
      <PullQuote quote={value?.quote ?? ''} attribution={value?.attribution} />
    ),
  },
}

export default function PortableBody({ value }: { value: any }) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}
