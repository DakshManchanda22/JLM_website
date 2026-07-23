import { defineType, defineField, defineArrayMember } from 'sanity'
import { seoFields } from './seoFields'

/**
 * Homepage singleton — every editable string and image on the home page lives
 * here. Marketing can rewrite copy, swap any image, change brand taglines, and
 * publish, without touching the code.
 */
export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  // Singleton behaviour is enforced by the Studio structure config
  // (see sanity.config.ts), which pins this to a single document id.
  groups: [
    { name: 'brands', title: 'Brand cards' },
    { name: 'stats', title: 'Stats' },
    { name: 'vision', title: 'Our Vision' },
    { name: 'values', title: 'Values image' },
    { name: 'features', title: 'Feature sections' },
    { name: 'quote', title: 'Quote' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ─────────────── Our Vision ─────────────── */
    defineField({
      name: 'vision',
      title: 'Our Vision',
      type: 'object',
      group: 'vision',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          description: 'Small heading above the statement, e.g. "Our Vision".',
        }),
        defineField({
          name: 'text',
          title: 'Vision statement',
          description: 'Reveals word by word as it scrolls into view.',
          type: 'text',
          rows: 3,
        }),
      ],
    }),

    /* ─────────────── Quote section (legacy — no longer rendered) ─────────────── */
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

    /* ─────────────── Values image ─────────────── */
    defineField({
      name: 'showValuesImage',
      title: 'Show the values image',
      description:
        'ON → the values image is shown just below the quote on the homepage. ' +
        'OFF → the whole section is hidden and no empty space is left behind.',
      type: 'boolean',
      group: 'values',
      initialValue: true,
      options: { layout: 'switch' },
    }),
    defineField({
      name: 'valuesImage',
      title: 'Values image',
      description:
        'A single full-width image shown below the quote (e.g. the JLM values graphic). ' +
        'Use the switch above to show or hide it.',
      type: 'image',
      group: 'values',
      options: { hotspot: true },
    }),

    /* ─────────────── Brand cards ─────────────── */
    defineField({
      name: 'brandsHeading',
      title: 'Brand cards — section heading',
      description:
        'The large heading shown above the four brand tiles, e.g. ' +
        '“Trusted in every Indian home.”',
      type: 'string',
      group: 'brands',
    }),
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
      name: 'statsHeading',
      title: 'Stats — section heading',
      description: 'Large editorial heading above the metric cards.',
      type: 'string',
      group: 'stats',
    }),
    defineField({
      name: 'stats',
      title: 'Stat cards',
      type: 'array',
      group: 'stats',
      description:
        'The metric cards, shown in a static grid of three per row. The numbers ' +
        'count up when the section scrolls into view.',
      validation: (Rule) => Rule.min(1).max(20),
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
            defineField({
              name: 'image',
              title: 'Background image (optional)',
              description:
                'Optional. When set, the card uses this photo as its background ' +
                '(with a dark overlay and white text), like the ESG cards. Leave ' +
                'empty for the plain beige card.',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
            }),
          ],
          preview: {
            select: { title: 'number', subtitle: 'label', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────────── Feature sections ─────────────── */
    defineField({
      name: 'features',
      title: 'Feature sections',
      description:
        'The large image + text sections near the bottom of the homepage. Each one ' +
        'alternates the image left/right and links somewhere with a button.',
      type: 'array',
      group: 'features',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow',
              description: 'Small uppercase label above the headline.',
              type: 'string',
            }),
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body copy',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Button label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Button link',
              description: 'e.g. /life-at-jlm or a full https:// URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'images',
              title: 'Images (rotate with a fade)',
              description:
                'Add one or more photos. With more than one, they cross-fade from one to ' +
                'the next automatically. Drag to reorder.',
              type: 'array',
              of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
              validation: (Rule) => Rule.min(1).error('Add at least one image.'),
            }),
            defineField({
              name: 'imageIntervalSeconds',
              title: 'Seconds each image shows',
              description:
                'How many seconds each photo stays before the deck shuffles to the next ' +
                '(default 3). Lower = faster.',
              type: 'number',
              initialValue: 3,
              validation: (Rule) => Rule.min(1).max(30),
            }),
            defineField({
              name: 'image',
              title: 'Image (fallback — used only if no images are added above)',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'imageRight',
              title: 'Show image on the right',
              description: 'ON → image on the right, text on the left. OFF → image on the left.',
              type: 'boolean',
              initialValue: false,
              options: { layout: 'switch' },
            }),
          ],
          preview: {
            select: { title: 'headline', subtitle: 'eyebrow', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────────── SEO ─────────────── */
    ...seoFields('seo'),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
