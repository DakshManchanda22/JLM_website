import JsonLd from './JsonLd'
import { SITE_URL } from '@/sanity/seo'

export type Crumb = {
  name: string
  /** Absolute path (e.g. '/emoform') or a full URL. */
  url: string
}

/**
 * Emits a BreadcrumbList JSON-LD for an inner page so Google can show the
 * page's place in the site hierarchy. Pass crumbs from the site root down to
 * the current page, e.g.
 *   <BreadcrumbSchema items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Emoform', url: '/emoform' },
 *   ]} />
 */
export default function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
        })),
      }}
    />
  )
}
