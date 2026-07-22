import { defineField } from 'sanity'

/**
 * Reusable SEO / social-sharing fields.
 *
 * Spread into any document's `fields` array with `...seoFields()`. On schemas
 * that use field-group tabs, pass the group name (e.g. `seoFields('seo')`) and
 * add `{ name: 'seo', title: 'SEO' }` to that schema's `groups` so these fields
 * sit under their own "SEO" tab.
 *
 * The website reads these via `fetchPageSeo()` / the `seoProjection` in
 * `src/sanity/seo.ts`, with sensible fallbacks when a field is left blank.
 */
export const seoFields = (group?: string) => {
  const g = group ? { group } : {}
  return [
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      ...g,
      description:
        'Shown as the blue link title on Google and the browser tab. ' +
        'Ideal length: 50–60 characters. Falls back to the page’s own title.',
      validation: (Rule) =>
        Rule.max(60).warning('Longer than 60 characters may be cut off on Google.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      ...g,
      description:
        'The grey text under the title on Google. Ideal length: 140–160 characters.',
      validation: (Rule) =>
        Rule.max(160).warning('Longer than 160 characters may be cut off on Google.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share image (OG image)',
      type: 'image',
      ...g,
      description:
        'The image shown when this page is shared on WhatsApp, LinkedIn or ' +
        'Twitter/X. Ideal size: 1200×630px. Falls back to the site default.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogImageAlt',
      title: 'Share image — alt text',
      type: 'string',
      ...g,
      description: 'Describe what is in the share image (for accessibility and SEO).',
    }),
  ]
}

export default seoFields
