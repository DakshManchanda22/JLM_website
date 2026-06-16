import { defineType, defineField } from 'sanity'

/**
 * Leadership team member — one document per leader.
 * Used on /leadership-team (grid) and /leadership-team/[slug] (profile).
 */
export default defineType({
  name: 'leader',
  title: 'Leadership team member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (used in the URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      description: 'e.g. "Executive Director", "Chief Operating Officer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order (lowest first)',
      description: 'Controls where this person appears in the grid. 1 = first.',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      description:
        'Optional — leaders without a photo show a neutral placeholder until you upload one.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
    defineField({
      name: 'quote',
      title: 'Personal quote',
      description: 'Shown in italics on the profile page.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      // Optional by default; only validates the format if a value is entered
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio paragraphs',
      description:
        'One entry per paragraph. Each is shown as its own paragraph on the profile page.',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'image' },
  },
})
