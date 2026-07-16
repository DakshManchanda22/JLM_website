import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Philanthropy page — singleton document.
 * Every heading, paragraph, link and image on the /philanthropy page lives here
 * so marketing can update the page without touching code.
 *
 * Each programme stage can hold MULTIPLE images — the website picks a random one
 * from the set on every page load, so the card feels alive.
 */
export default defineType({
  name: 'philanthropy',
  title: 'Philanthropy',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'difference', title: 'Making a difference' },
    { name: 'programs', title: 'Programmes' },
    { name: 'impact', title: 'Impact (5 years)' },
    { name: 'purpose', title: 'Purpose collage' },
    { name: 'belief', title: 'Belief statement' },
    { name: 'stats', title: 'Stat cards' },
    { name: 'esg', title: 'Environment' },
    { name: 'social', title: 'Social gallery' },
    { name: 'policies', title: 'Policies & documents' },
  ],
  fields: [
    /* ───────────── Hero ───────────── */
    defineField({
      name: 'heroLine1',
      title: 'Hero — line 1',
      group: 'hero',
      description: 'First highlighted line, e.g. "Changing Lives,".',
      type: 'string',
    }),
    defineField({
      name: 'heroLine2',
      title: 'Hero — line 2',
      group: 'hero',
      description: 'Second highlighted line, e.g. "Building Futures".',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero background image',
      group: 'hero',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Making a difference ───────────── */
    defineField({
      name: 'differenceHeadingLine1',
      title: 'Heading — line 1',
      group: 'difference',
      description: 'e.g. "Making a".',
      type: 'string',
    }),
    defineField({
      name: 'differenceHeadingLine2',
      title: 'Heading — line 2',
      group: 'difference',
      description: 'e.g. "difference".',
      type: 'string',
    }),
    defineField({
      name: 'differenceBody',
      title: 'Body paragraph',
      group: 'difference',
      description:
        'The words "Project Kaamyaab" are automatically shown in bold wherever they appear.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'differenceCtaLabel',
      title: 'Button label',
      group: 'difference',
      type: 'string',
    }),
    defineField({
      name: 'differenceCtaHref',
      title: 'Button link',
      group: 'difference',
      type: 'string',
    }),
    defineField({
      name: 'differenceImage',
      title: 'Section image (left)',
      group: 'difference',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Programmes ───────────── */
    defineField({
      name: 'programsHeading',
      title: 'Section heading',
      group: 'programs',
      description: 'The big word, e.g. "Programs".',
      type: 'string',
    }),
    defineField({
      name: 'programsIntro',
      title: 'Section intro',
      group: 'programs',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'stages',
      title: 'Programme stages (cards)',
      group: 'programs',
      description: 'Each card shows a title on the image and a description below.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stage',
          fields: [
            defineField({
              name: 'title',
              title: 'Title (shown on the image)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'lead',
              title: 'Bold lead (below the card)',
              type: 'string',
            }),
            defineField({
              name: 'body',
              title: 'Description (below the card)',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'images',
              title: 'Images',
              description:
                'Add one or more photos. The website shows a different one at random on each visit.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'lead', media: 'images.0' } },
        }),
      ],
    }),

    /* ───────────── Impact (5-year milestone stats) ───────────── */
    defineField({
      name: 'impactLogo',
      title: 'Impact — logo image',
      group: 'impact',
      description: 'The Project Kaamyaab logo shown above the headline.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'impactHeading',
      title: 'Impact — headline',
      group: 'impact',
      description: 'e.g. "Five years of Project Kaamyaab".',
      type: 'string',
    }),
    defineField({
      name: 'impactIntro',
      title: 'Impact — supporting line',
      group: 'impact',
      description: 'A short sentence below the headline.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'impactStats',
      title: 'Impact — numbers',
      group: 'impact',
      description:
        'The big numbers, shown in a row (they count up on scroll). e.g. "1,655" / "Women trained".',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'impactStat',
          fields: [
            defineField({
              name: 'value',
              title: 'Number / value',
              description: 'e.g. "5", "1,655", "220+".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              description: 'e.g. "Years of impact", "Women trained".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),

    /* ───────────── Purpose collage ───────────── */
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
      description: 'The big word, e.g. "Purpose".',
      type: 'string',
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
          ],
          preview: { select: { title: 'title', subtitle: 'value' } },
        }),
      ],
    }),

    /* ───────────── Environment (word + paragraph + photo wall) ───────────── */
    defineField({
      name: 'esgWord',
      title: 'Environment — heading word',
      group: 'esg',
      description: 'The big pinned word, e.g. "Environment".',
      type: 'string',
    }),
    defineField({
      name: 'esgIntro',
      title: 'Environment — paragraph',
      group: 'esg',
      description: 'The paragraph that rises up as the word slot-machines away.',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'esgGallery',
      title: 'Environment — photo wall',
      group: 'esg',
      description: 'The framed photo grid behind the word. Drag to reorder.',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      options: { layout: 'grid' },
    }),

    /* ───────────── Social (heading + masonry) ───────────── */
    defineField({
      name: 'socialWord',
      title: 'Social — heading word',
      group: 'social',
      description: 'The highlighted heading, e.g. "Social".',
      type: 'string',
    }),
    defineField({
      name: 'socialGallery',
      title: 'Social — photo masonry',
      group: 'social',
      description:
        'A Pinterest-style masonry of community photos. Drag to reorder. Any number of images.',
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

    /* ───────────── Policies (dark split + document table) ───────────── */
    defineField({
      name: 'policiesHeading',
      title: 'Policies — heading',
      group: 'policies',
      type: 'string',
    }),
    defineField({
      name: 'policiesIntro',
      title: 'Policies — intro paragraph',
      group: 'policies',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'policiesImage',
      title: 'Policies — photo (left side)',
      group: 'policies',
      description: 'Portrait works best in the split layout.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'policyDocuments',
      title: 'Policies — document links',
      group: 'policies',
      description: 'Each row links to a PDF that opens in a new tab.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Document name', type: 'string' }),
            defineField({ name: 'url', title: 'PDF URL', type: 'url' }),
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Philanthropy' }),
  },
})
