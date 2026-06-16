import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * "Our Story" — singleton document.
 * Page header + an ordered timeline of milestones (year, description, image,
 * optional vertical offset, which side of the centre line it sits on).
 */
export default defineType({
  name: 'ourStory',
  title: 'Our Story',
  type: 'document',
  // Singleton behaviour is enforced by the Studio structure config
  // (see sanity.config.ts), which pins this to a single document id.
  groups: [
    { name: 'header', title: 'Page header' },
    { name: 'timeline', title: 'Timeline' },
  ],
  fields: [
    /* ─────────── Header ─────────── */
    defineField({
      name: 'eyebrow',
      title: 'Small eyebrow text',
      description: 'e.g. "A look back on our history"',
      group: 'header',
      type: 'string',
    }),
    defineField({
      name: 'headlineTop',
      title: 'Headline — top line',
      description: 'e.g. "Building Goodness"',
      group: 'header',
      type: 'string',
    }),
    defineField({
      name: 'headlineBottom',
      title: 'Headline — italic bottom line',
      description: 'e.g. "Since 1920."',
      group: 'header',
      type: 'string',
    }),

    /* ─────────── Timeline ─────────── */
    defineField({
      name: 'milestones',
      title: 'Milestones',
      description: 'Listed top to bottom in the order shown here.',
      group: 'timeline',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'milestone',
          fields: [
            defineField({
              name: 'year',
              title: 'Year (or short label)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'side',
              title: 'Which side of the centre line?',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
              validation: (Rule) => Rule.required(),
              initialValue: 'left',
            }),
            defineField({
              name: 'image',
              title: 'Image (optional)',
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alt text' },
              ],
            }),
            defineField({
              name: 'offsetY',
              title: 'Vertical offset in px (optional)',
              description:
                'Nudges the image down to give the timeline an editorial, off-grid feel. Leave blank for none.',
              type: 'number',
            }),
          ],
          preview: {
            select: { title: 'year', subtitle: 'description', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Our Story' }) },
})
