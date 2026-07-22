import { defineType, defineField, defineArrayMember } from 'sanity'
import { seoFields } from './seoFields'

/**
 * ESG page — singleton document.
 * Every heading, paragraph, link and image on the /esg page lives here so
 * marketing can update the page without touching code. Split out of the
 * Philanthropy document so the two pages are edited independently.
 */
export default defineType({
  name: 'esg',
  title: 'ESG',
  type: 'document',
  groups: [
    { name: 'purpose', title: 'ESG title & collage' },
    { name: 'belief', title: 'Belief statement' },
    { name: 'stats', title: 'Stat cards' },
    { name: 'environment', title: 'Environment' },
    { name: 'social', title: 'Social gallery' },
    { name: 'policies', title: 'Governance & documents' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ───────────── ESG title + collage ───────────── */
    defineField({
      name: 'purposeEyebrow',
      title: 'Small eyebrow',
      group: 'purpose',
      description: 'The small line above the heading, e.g. "What drives us".',
      type: 'string',
    }),
    defineField({
      name: 'purposeHeading',
      title: 'Heading',
      group: 'purpose',
      description: 'The big word at the top of the page, e.g. "ESG".',
      type: 'string',
    }),
    defineField({
      name: 'useBannerImage',
      title: 'Show a banner image instead of the heading',
      group: 'purpose',
      description:
        'Turn ON to replace the big "ESG" heading at the top of the page with a ' +
        'banner image. Turn OFF to show the text heading as usual.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner image',
      group: 'purpose',
      description:
        'Shown at the top of the page in place of the heading when the switch ' +
        'above is ON. A wide (landscape) image works best.',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => !parent?.useBannerImage,
    }),
    defineField({
      name: 'purposeBackgroundWord',
      title: 'Background word',
      group: 'purpose',
      description: 'The large faded word shown behind the photo collage, e.g. "Goodness".',
      type: 'string',
    }),
    defineField({
      name: 'purposeImages',
      title: 'Collage photos (up to 3)',
      group: 'purpose',
      description:
        'Three photos that start stacked and fan out into a collage as the visitor scrolls.',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      validation: (Rule) => Rule.max(3),
    }),

    /* ───────────── Belief statement ───────────── */
    defineField({
      name: 'beliefEyebrow',
      title: 'Small eyebrow',
      group: 'belief',
      type: 'string',
    }),
    defineField({
      name: 'beliefText',
      title: 'Statement',
      group: 'belief',
      description: 'The large centred belief statement.',
      type: 'text',
      rows: 4,
    }),

    /* ───────────── Stat cards (hover to reveal) ───────────── */
    defineField({
      name: 'statCards',
      title: 'Stat cards',
      group: 'stats',
      description:
        'Cards that show a title + big number, and reveal their description on ' +
        'hover (desktop) or when scrolled over (mobile).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statCard',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Big number / value',
              description: 'e.g. "15 MT +", "1,27,000", "10%", "80+".',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Description (revealed on hover)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'tag',
              title: 'Tag label',
              description: 'Small chip, e.g. "Environment" or "Social".',
              type: 'string',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Recycle', value: 'recycle' },
                  { title: 'Solar panel', value: 'solarPanel' },
                  { title: 'People', value: 'people' },
                  { title: 'Community / hands', value: 'community' },
                  { title: 'Solar / sun', value: 'solar' },
                  { title: 'Water / waves', value: 'water' },
                  { title: 'Leaf / nature', value: 'leaf' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'recycle',
            }),
            defineField({
              name: 'image',
              title: 'Background image',
              description:
                'Shown behind the card (with a dark overlay so the text stays readable). ' +
                'Pick something related to the card, e.g. solar panels for Green Energy.',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'value', media: 'image' } },
        }),
      ],
    }),

    /* ───────────── Environment (word + paragraph + photo wall) ───────────── */
    defineField({
      name: 'esgWord',
      title: 'Environment — heading word',
      group: 'environment',
      description: 'The big highlighted word, e.g. "Environment".',
      type: 'string',
    }),
    defineField({
      name: 'esgIntro',
      title: 'Environment — paragraph',
      group: 'environment',
      description: 'The paragraph shown under the Environment heading.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'esgGallery',
      title: 'Environment — photo wall',
      group: 'environment',
      description: 'The scrolling photo carousel for Environment. Drag to reorder.',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      options: { layout: 'grid' },
    }),

    /* ───────────── Social (heading + carousel) ───────────── */
    defineField({
      name: 'socialWord',
      title: 'Social — heading word',
      group: 'social',
      description: 'The highlighted heading, e.g. "Social".',
      type: 'string',
    }),
    defineField({
      name: 'socialGallery',
      title: 'Social — photo carousel',
      group: 'social',
      description:
        'Community photos shown in the Social carousel. Drag to reorder. Any number of images.',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'carouselSpeed',
      title: 'Carousel scroll speed (Environment & Social)',
      group: 'social',
      description:
        'How fast the Environment and Social photo carousels scroll. 1 = normal, ' +
        'higher = faster (e.g. 2 = twice as fast).',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(0.5).max(5),
    }),

    /* ───────────── Governance (dark split + document table) ───────────── */
    defineField({
      name: 'policiesHeading',
      title: 'Governance — heading',
      group: 'policies',
      type: 'string',
    }),
    defineField({
      name: 'policiesIntro',
      title: 'Governance — intro paragraph',
      group: 'policies',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'policiesImage',
      title: 'Governance — photo (left side)',
      group: 'policies',
      description: 'Portrait works best in the split layout.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'policyDocuments',
      title: 'Governance — document links',
      group: 'policies',
      description:
        'Each row links to a PDF that opens in a new tab. Upload the PDF file, ' +
        'or paste a URL (the uploaded file is used when both are set).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Document name', type: 'string' }),
            defineField({
              name: 'file',
              title: 'PDF file (upload)',
              type: 'file',
              options: { accept: 'application/pdf' },
            }),
            defineField({
              name: 'url',
              title: 'or PDF URL',
              type: 'url',
              description: 'Used only if no file is uploaded above.',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        }),
      ],
    }),
    ...seoFields('seo'),
  ],
  preview: {
    prepare: () => ({ title: 'ESG' }),
  },
})
