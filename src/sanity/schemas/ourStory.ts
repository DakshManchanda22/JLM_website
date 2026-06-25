import { defineType, defineField, defineArrayMember } from 'sanity'

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
    { name: 'legacy', title: 'Legacy (old timeline — unused)' },
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
              title: 'Body paragraph',
              type: 'text',
              rows: 5,
              validation: (R) => R.required(),
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
      name: 'pillarsEyebrow',
      title: 'Pillars eyebrow',
      group: 'pillars',
      type: 'string',
    }),
    defineField({
      name: 'pillarsHeadline',
      title: 'Pillars headline',
      group: 'pillars',
      type: 'string',
    }),
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

    /* ─────────── Legacy timeline (kept for backwards compat) ─────────── */
    defineField({
      name: 'milestones',
      title: 'Legacy milestones (no longer rendered)',
      description:
        'The old vertical timeline has been replaced. This field stays so any data already entered isn’t lost. Safe to leave empty.',
      group: 'legacy',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'milestone',
          fields: [
            { name: 'year', type: 'string', title: 'Year' },
            { name: 'description', type: 'text', title: 'Description' },
            {
              name: 'side',
              type: 'string',
              title: 'Side',
              options: { list: [{ title: 'Left', value: 'left' }, { title: 'Right', value: 'right' }] },
            },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
            { name: 'offsetY', type: 'number', title: 'Offset Y (px)' },
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Our Story' }) },
})
