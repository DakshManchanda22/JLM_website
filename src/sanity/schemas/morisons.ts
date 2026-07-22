import { defineType, defineField } from 'sanity'
import { seoFields } from './seoFields'

/**
 * Morisons (house brand) page — singleton document.
 * The page is a single full-screen poster, so marketing can swap the poster
 * image (and its SEO) here without touching code.
 */
export default defineType({
  name: 'morisons',
  title: 'Morisons',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ───────────── Poster ───────────── */
    defineField({
      name: 'poster',
      title: 'Full-screen poster image',
      description:
        'The single full-bleed image shown on the Morisons page. It fills the screen edge-to-edge, so use a high-resolution landscape image.',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'posterAlt',
      title: 'Poster alt text',
      description: 'Describes the poster for accessibility and SEO.',
      type: 'string',
      group: 'content',
    }),

    /* ───────────── SEO ───────────── */
    ...seoFields('seo'),
  ],
  preview: {
    prepare: () => ({ title: 'Morisons' }),
  },
})
