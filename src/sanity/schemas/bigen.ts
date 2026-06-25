import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Bigen brand page — singleton document.
 * For now it manages the customer video testimonials (Instagram reels)
 * shown in the "Decades of Trust" section, so marketing can swap reels
 * without touching code.
 */
export default defineType({
  name: 'bigen',
  title: 'Bigen',
  type: 'document',
  fields: [
    defineField({
      name: 'testimonialsHeadline',
      title: 'Testimonials headline',
      type: 'string',
      description: 'Headline above the reel carousel.',
      initialValue: 'Decades of Trust. Endorsed by icons.',
    }),
    defineField({
      name: 'reels',
      title: 'Customer video reels (Instagram)',
      type: 'array',
      description:
        'Paste each Instagram reel link (e.g. https://www.instagram.com/reel/ABC123/). ' +
        'The reel — with its own thumbnail — shows automatically and plays in place. ' +
        'Reorder by dragging; add or remove to change the carousel.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reel',
          fields: [
            defineField({
              name: 'url',
              title: 'Instagram reel URL',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({ scheme: ['https'] }),
            }),
            defineField({
              name: 'name',
              title: 'Caption / person name (optional)',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'url' },
            prepare: ({ title, subtitle }) => ({
              title: title || 'Reel',
              subtitle,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Bigen' }),
  },
})
