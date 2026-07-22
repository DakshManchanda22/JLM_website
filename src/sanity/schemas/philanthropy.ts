import { defineType, defineField, defineArrayMember } from 'sanity'
import { seoFields } from './seoFields'

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
    { name: 'video', title: 'Video' },
    { name: 'difference', title: 'Making a difference' },
    { name: 'programs', title: 'Programmes' },
    { name: 'impact', title: 'Impact (5 years)' },
    { name: 'seo', title: 'SEO' },
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

    /* ───────────── Video (the Kaamyaab film) ───────────── */
    defineField({
      name: 'videoFile',
      title: 'Upload video',
      group: 'video',
      description:
        'Upload an MP4 here — the easiest option. Keep it under ~50MB for fast ' +
        'loading. For very large videos, use the “Video link” field below instead.',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video link (optional)',
      group: 'video',
      description:
        'Alternative to uploading: paste a direct MP4 link (e.g. a Google Cloud ' +
        'Storage URL). Used only if no video is uploaded above. Leave everything ' +
        'empty to hide the video.',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video thumbnail',
      group: 'video',
      description:
        'A still image shown in place of the video while it loads (and if it ' +
        'is slow to start). Use a frame from the video, or a related photo.',
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

    /* ───────────── SEO ───────────── */
    ...seoFields('seo'),
  ],
  preview: {
    prepare: () => ({ title: 'Philanthropy' }),
  },
})
