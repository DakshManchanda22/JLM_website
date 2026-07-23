import { defineType, defineField, defineArrayMember } from 'sanity'
import { seoFields } from './seoFields'

/**
 * "Our Story" — singleton.
 * Editorial spread covering the JLM 100-year journey: hero, 5-stage
 * trajectory, 5 defining eras, 5 guiding pillars, closing line.
 */
export default defineType({
  name: 'ourStory',
  title: 'Our Story',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'journey', title: 'Journey in a nutshell' },
    { name: 'eras', title: 'The five eras' },
    { name: 'pillars', title: 'Guiding pillars' },
    { name: 'closing', title: 'Closing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ─────────── Hero ─────────── */
    defineField({
      name: 'eyebrow',
      title: 'Hero eyebrow',
      description: 'Tiny tracked label at the top, e.g. "Our Story"',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'headlineTop',
      title: 'Hero headline — first line',
      description: 'e.g. "A hundred years of"',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'headlineBottom',
      title: 'Hero headline — second line',
      description: 'Whatever follows. Wrap the italic word(s) in *asterisks*: "building *goodness*."',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero tagline (long-form quote)',
      description: 'Shown under the headline. Sets up the story.',
      group: 'hero',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'establishedMark',
      title: 'Establishment mark',
      description: 'The Anton mark at the bottom of the hero, e.g. "EST. 1920"',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'introVideo',
      title: 'Intro video',
      description:
        'Optional video shown at the very top of the page, above the headline. Upload a file or paste a link. ' +
        'Until one is added, a "Video coming soon" placeholder is shown.',
      group: 'hero',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'videoFile',
          title: 'Upload video',
          description:
            'Upload an MP4 video here. Keep it under ~50MB for fast loading. For very large videos, use the "Video link" field below instead.',
          type: 'file',
          options: { accept: 'video/*' },
        }),
        defineField({
          name: 'videoUrl',
          title: 'Video link (optional)',
          description:
            'Alternative to uploading: paste a direct link to an MP4 video (e.g. a Google Cloud Storage URL). Used only if no video is uploaded above.',
          type: 'url',
        }),
        defineField({
          name: 'poster',
          title: 'Video thumbnail',
          description:
            'A still image shown in place of the video while it loads (and if it ' +
            'is slow to start). Use a frame from the video, or a related photo.',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),

    /* ─────────── Journey in a Nutshell ─────────── */
    defineField({
      name: 'journeyEyebrow',
      title: 'Journey eyebrow',
      group: 'journey',
      type: 'string',
    }),
    defineField({
      name: 'journeyHeadline',
      title: 'Journey headline',
      group: 'journey',
      type: 'string',
    }),
    defineField({
      name: 'journeyStages',
      title: 'Journey stages (3–6, shown as a horizontal track)',
      group: 'journey',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'journeyStage',
          fields: [
            defineField({ name: 'period', title: 'Period (e.g. "1920s")', type: 'string' }),
            defineField({ name: 'name', title: 'Stage name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'note', title: 'Single-line note', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'period' } },
        }),
      ],
    }),

    /* ─────────── The Five Eras ─────────── */
    defineField({
      name: 'erasEyebrow',
      title: 'Eras eyebrow',
      group: 'eras',
      type: 'string',
    }),
    defineField({
      name: 'erasHeadline',
      title: 'Eras headline',
      group: 'eras',
      type: 'string',
    }),
    defineField({
      name: 'eras',
      title: 'Eras (3–8, full-screen scroll sections)',
      group: 'eras',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'era',
          fields: [
            defineField({
              name: 'number',
              title: 'Display number',
              description: 'e.g. "01". Used as the huge Anton numeral.',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'dateRange',
              title: 'Date range',
              description: 'e.g. "1920 — 1940"',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'title',
              title: 'Era title',
              description: 'e.g. "Global Origins"',
              type: 'string',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              description:
                'The era’s description. Use the toolbar for paragraphs, bulleted or ' +
                'numbered lists, and bold / italic text.',
              type: 'array',
              validation: (R) => R.required(),
              of: [
                defineArrayMember({
                  type: 'block',
                  // Keep it focused: paragraphs + lists, no headings/images —
                  // this body sits in a compact editorial column.
                  styles: [{ title: 'Paragraph', value: 'normal' }],
                  lists: [
                    { title: 'Bulleted', value: 'bullet' },
                    { title: 'Numbered', value: 'number' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Bold', value: 'strong' },
                      { title: 'Italic', value: 'em' },
                    ],
                    annotations: [],
                  },
                }),
              ],
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'dateRange', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────── Pillars ─────────── */
    defineField({
      name: 'pillars',
      title: 'Pillars (3–8)',
      group: 'pillars',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pillar',
          fields: [
            defineField({ name: 'name', title: 'Pillar name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'description', title: 'One-line description', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        }),
      ],
    }),

    /* ─────────── Closing ─────────── */
    defineField({
      name: 'closingLine',
      title: 'Closing italic line',
      group: 'closing',
      type: 'string',
    }),
    defineField({
      name: 'closingSubline',
      title: 'Tiny note beneath closing',
      group: 'closing',
      type: 'string',
    }),
    defineField({
      name: 'signatureName',
      title: 'Closing signature — name',
      description: 'The signature line on the closing quote card, e.g. "J.L. Morison". Leave blank to hide it.',
      group: 'closing',
      type: 'string',
      initialValue: 'J.L. Morison',
    }),
    defineField({
      name: 'signatureNote',
      title: 'Closing signature — small note',
      description: 'The small tracked note under the signature, e.g. "Since 1920". Leave blank to hide it.',
      group: 'closing',
      type: 'string',
      initialValue: 'Since 1920',
    }),
    ...seoFields('seo'),
  ],
  preview: { prepare: () => ({ title: 'Our Story' }) },
})
