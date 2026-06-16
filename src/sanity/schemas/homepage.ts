import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Homepage singleton — every editable string and image on the home page lives
 * here. Marketing can rewrite copy, swap any image, change brand taglines, and
 * publish, without touching the code.
 */
export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  // Singleton: only one document of this type can exist. Studio shows it as
  // a single editable page instead of a list.
  __experimental_actions: ['update', 'publish'] as any,
  groups: [
    { name: 'hero', title: 'Hero slideshow' },
    { name: 'quote', title: 'Quote' },
    { name: 'brands', title: 'Brand cards' },
    { name: 'stats', title: 'Stats' },
  ],
  fields: [
    /* ─────────────── Hero slideshow ─────────────── */
    defineField({
      name: 'heroSlides',
      title: 'Hero slides',
      description: 'The crossfading slides at the top of the homepage.',
      type: 'array',
      group: 'hero',
      validation: (Rule) => Rule.min(1).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroSlide',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'brand',
              title: 'Brand name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tagline',
              title: 'Tagline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'brand', subtitle: 'tagline', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────────── Quote section ─────────────── */
    defineField({
      name: 'quote',
      title: 'Editorial quote',
      type: 'object',
      group: 'quote',
      fields: [
        defineField({
          name: 'lines',
          title: 'Quote lines (one per line break)',
          description:
            'Each line is shown on its own row. Animates word-by-word on scroll.',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.min(1).max(8),
        }),
        defineField({
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
          description: 'e.g. "— J.L. MORISON"',
        }),
      ],
    }),

    /* ─────────────── Brand cards ─────────────── */
    defineField({
      name: 'brands',
      title: 'Brand cards',
      type: 'array',
      group: 'brands',
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'brand',
          fields: [
            defineField({
              name: 'name',
              title: 'Brand name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'shortName',
              title: 'Short name',
              description: 'Used in the hover label. Keep it tight.',
              type: 'string',
            }),
            defineField({
              name: 'tagline',
              title: 'Tagline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description:
                'Where the card links to, e.g. /brands/morisons-baby-dreams',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'tagline', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────────── Stats section ─────────────── */
    defineField({
      name: 'stats',
      title: 'Stat cards',
      type: 'array',
      group: 'stats',
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              description: 'e.g. "100+", "3", "1"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              description: 'e.g. "Years", "Brands", "Promise"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body copy',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
