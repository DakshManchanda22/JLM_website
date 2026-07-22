import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * "Life at JL Morison" — singleton document.
 * Every text string and image on the /life-at-jlm page lives here.
 */
export default defineType({
  name: 'lifeAtJlm',
  title: 'Life at JL Morison',
  type: 'document',
  // Singleton behaviour is enforced by the Studio structure config
  // (see sanity.config.ts), which pins this to a single document id.
  groups: [
    { name: 'intro', title: 'Intro curtain' },
    { name: 'hero', title: 'Hero' },
    { name: 'caption', title: 'Photo carousel' },
    { name: 'people', title: 'Intro statement' },
    { name: 'arent', title: 'Employee testimonials' },
  ],
  fields: [
    /* ───── Intro curtain photos ───── */
    defineField({
      name: 'showIntro',
      title: 'Play intro animation',
      group: 'intro',
      description:
        'When on, the page opens with the overlapping photos that fade in one by one and then wipe up like a curtain to reveal the hero. Turn OFF to show the hero and title straight away, with no intro animation.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'introImages',
      title: 'Intro curtain photos (max 6, shown one by one)',
      group: 'intro',
      type: 'array',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'introFinalImage',
      title: 'Intro final establishing photo',
      group: 'intro',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───── Hero ───── */
    defineField({
      name: 'heroImage',
      title: 'Hero background photo (team group photo)',
      group: 'hero',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroLine1',
      title: 'Hero line 1 (e.g. "Life at")',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroLine2',
      title: 'Hero line 2 (e.g. "JL Morison")',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroCaptionSmall',
      title: 'Tiny caption above tagline (e.g. "Since 1920")',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroCaptionLarge',
      title: 'Italic tagline below hero (e.g. "A century of building goodness…")',
      group: 'hero',
      type: 'string',
    }),

    /* ───── Photo carousel (below the intro statement) ───── */
    defineField({
      name: 'captionStrip',
      title: 'Photo carousel (infinite loop below the intro statement)',
      description: 'Add any number of photos — they scroll in an infinite loop.',
      group: 'caption',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'captionImage',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'caption', title: 'Italic caption beneath', type: 'string' }),
          ],
          preview: { select: { title: 'caption', media: 'image' } },
        }),
      ],
    }),

    /* ───── Intro statement ───── */
    defineField({
      name: 'introStatement',
      title: 'Intro statement (large paragraph under the hero)',
      group: 'people',
      type: 'text',
      rows: 6,
    }),

    /* ───── Employee testimonials ───── */
    defineField({ name: 'arentHeadline', title: 'Headline', group: 'arent', type: 'text', rows: 3 }),
    defineField({ name: 'arentBody', title: 'Body paragraph', group: 'arent', type: 'text', rows: 4 }),
    defineField({
      name: 'testimonials',
      title: 'Employee testimonials (card row)',
      group: 'arent',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 5 }),
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'role', title: 'Role / team', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        }),
      ],
    }),

    defineField({
      name: 'carouselSpeed',
      title: 'Carousel scroll speed',
      group: 'caption',
      description:
        'How fast the auto-scrolling photo carousels move. 1 = normal, higher = faster ' +
        '(e.g. 2 = twice as fast).',
      type: 'number',
      initialValue: 2,
      validation: (Rule) => Rule.min(0.5).max(5),
    }),
  ],
  preview: { prepare: () => ({ title: 'Life at JL Morison' }) },
})
