import JsonLd from './JsonLd'
import { SITE_URL } from '@/sanity/seo'

/**
 * Organization JSON-LD for the company — rendered once in the root layout so it
 * appears on every page. `sameAs` links are pulled from Sanity site settings
 * (footer social links) when available, so marketing controls them.
 */
export default function OrganizationSchema({ sameAs = [] }: { sameAs?: string[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'J.L. Morison (India) Ltd.',
        alternateName: 'JL Morison',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        foundingDate: '1920',
        description:
          'Indian FMCG company behind Morisons Baby Dreams, Emoform and Bigen — ' +
          'building goodness for every Indian family since 1920.',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
      }}
    />
  )
}
