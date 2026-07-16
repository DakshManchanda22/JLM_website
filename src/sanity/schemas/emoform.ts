import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Emoform brand page — every headline, label, caption, link and image on the
 * /emoform page lives here so marketing can edit copy and swap photos without
 * touching code. Decorative icons, the RDA gauge and the scroll/pin behaviour
 * stay in code; the text inside them is editable here.
 */
export default defineType({
  name: 'emoform',
  title: 'Emoform',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'features', title: '5-in-1 section' },
    { name: 'steps', title: 'Scroll sections' },
    { name: 'cta', title: 'Closing CTA' },
    { name: 'social', title: 'Social links' },
  ],
  fields: [
    /* ─────────────── Hero ─────────────── */
    defineField({
      name: 'heroLine1',
      title: 'Headline line 1 (English)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroLine2',
      title: 'Headline line 2 (Hindi)',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroFlag',
      title: 'Corner flag text',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image (toothpaste)',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),

    /* ─────────────── 5-in-1 section ─────────────── */
    defineField({
      name: 'featuresTitleTop',
      title: 'Title line 1',
      type: 'string',
      group: 'features',
    }),
    defineField({
      name: 'featuresTitleBottom',
      title: 'Title line 2',
      type: 'string',
      group: 'features',
    }),
    defineField({
      name: 'features',
      title: 'Benefit labels (5)',
      description: 'The icon for each stays fixed; only the text is editable.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(6),
      group: 'features',
    }),
    defineField({
      name: 'featuresImage',
      title: 'Toothbrush image',
      type: 'image',
      options: { hotspot: true },
      group: 'features',
    }),

    /* ─────────────── Scroll sections ─────────────── */
    defineField({
      name: 'steps',
      title: 'Scroll sections',
      description:
        'The pinned scroll-through sections. Keep these three in order; the ' +
        'icons, RDA gauge and layout are fixed per position.',
      type: 'array',
      group: 'steps',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'emoformStep',
          fields: [
            defineField({ name: 'tag', title: 'Card label', type: 'string' }),
            defineField({ name: 'title', title: 'Heading', type: 'string' }),
            defineField({
              name: 'sub',
              title: 'Sub-text (optional)',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'image',
              title: 'Card image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'points',
              title: 'Bullet / badge labels (optional)',
              description:
                'Text for the small items in this section. Icons stay fixed.',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'tag' } },
        }),
      ],
    }),

    /* ─────────────── Closing CTA ─────────────── */
    defineField({
      name: 'ctaTitle',
      title: 'Heading',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaSubtext',
      title: 'Sub-text',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'Button label',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaButtonHref',
      title: 'Button link',
      type: 'url',
      group: 'cta',
    }),

    /* ─────────────── Social links ─────────────── */
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      group: 'social',
    }),
  ],
  preview: { prepare: () => ({ title: 'Emoform' }) },
})
