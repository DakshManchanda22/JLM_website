import { defineType, defineField } from 'sanity'

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
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      description: 'Meta title shown on Google / browser tab.',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      description: 'Meta description shown on Google.',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image (OG)',
      description: 'Shown when the page is shared on WhatsApp / LinkedIn.',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Morisons' }),
  },
})
