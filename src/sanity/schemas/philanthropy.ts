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
    { name: 'purpose', title: 'Purpose collage' },
    { name: 'belief', title: 'Belief statement' },
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
  ],
  preview: {
    prepare: () => ({ title: 'Philanthropy' }),
  },
})
