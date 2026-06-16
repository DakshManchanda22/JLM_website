import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * "Life at JL Morison" — singleton document.
 * Every text string and image on the /life-at-jlm page lives here.
 */
export default defineType({
  name: 'lifeAtJlm',
  title: 'Life at JL Morison',
  type: 'document',
  __experimental_actions: ['update', 'publish'] as any,
  groups: [
    { name: 'intro', title: 'Intro curtain' },
    { name: 'hero', title: 'Hero' },
    { name: 'anchors', title: 'Anchor menu' },
    { name: 'caption', title: 'Caption strip' },
    { name: 'people', title: '1 · People' },
    { name: 'arent', title: '2 · We are / We aren’t' },
    { name: 'values', title: '3 · Values' },
    { name: 'workplace', title: '4 · Workplace' },
    { name: 'together', title: '5 · Together' },
  ],
  fields: [
    /* ───── Intro curtain photos ───── */
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

    /* ───── Anchor menu ───── */
    defineField({
      name: 'anchors',
      title: 'Anchor menu (the 4 numbered jumps)',
      group: 'anchors',
      type: 'array',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'anchor',
          fields: [
            defineField({ name: 'num', title: 'Number label (e.g. "/1")', type: 'string' }),
            defineField({ name: 'label', title: 'Label (e.g. "People")', type: 'string' }),
            defineField({
              name: 'targetId',
              title: 'Section anchor id',
              description: 'Must match a section below, one of: people, values, workplace, together',
              type: 'string',
            }),
            defineField({ name: 'image', title: 'Hover image', type: 'image', options: { hotspot: true } }),
          ],
          preview: { select: { title: 'label', subtitle: 'num', media: 'image' } },
        }),
      ],
    }),

    /* ───── Caption strip ───── */
    defineField({
      name: 'captionStrip',
      title: 'Editorial caption strip (2 images)',
      group: 'caption',
      type: 'array',
      validation: (Rule) => Rule.max(4),
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

    /* ───── 1 · People ───── */
    defineField({ name: 'peopleLabel', title: 'Label (e.g. "/1 People")', group: 'people', type: 'string' }),
    defineField({ name: 'peopleHeadline', title: 'Headline', group: 'people', type: 'text', rows: 3 }),
    defineField({ name: 'peopleTagline', title: 'Italic tagline below headline', group: 'people', type: 'string' }),
    defineField({ name: 'peopleBody', title: 'Body paragraph', group: 'people', type: 'text', rows: 5 }),

    /* ───── 2 · We are / We aren't ───── */
    defineField({ name: 'arentEyebrow', title: 'Eyebrow text', group: 'arent', type: 'string' }),
    defineField({ name: 'arentHeadline', title: 'Headline', group: 'arent', type: 'text', rows: 3 }),
    defineField({ name: 'arentBody', title: 'Body paragraph', group: 'arent', type: 'text', rows: 4 }),
    defineField({
      name: 'arentList',
      title: 'We aren’t list (with strikethrough animation)',
      group: 'arent',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'arentItem',
          fields: [
            defineField({ name: 'word', title: 'Word', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption (small text below)', type: 'string' }),
            defineField({ name: 'icon', title: 'Emoji icon', type: 'string' }),
          ],
          preview: { select: { title: 'word', subtitle: 'caption' } },
        }),
      ],
    }),
    defineField({
      name: 'areList',
      title: 'We are list',
      group: 'arent',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'areItem',
          fields: [
            defineField({ name: 'word', title: 'Word', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption (small text below)', type: 'string' }),
            defineField({ name: 'icon', title: 'Emoji icon', type: 'string' }),
          ],
          preview: { select: { title: 'word', subtitle: 'caption' } },
        }),
      ],
    }),

    /* ───── 3 · Values ───── */
    defineField({ name: 'valuesLabel', title: 'Label (e.g. "/2 Values")', group: 'values', type: 'string' }),
    defineField({ name: 'valuesHeadline', title: 'Headline', group: 'values', type: 'text', rows: 3 }),
    defineField({ name: 'valuesTagline', title: 'Italic tagline', group: 'values', type: 'string' }),
    defineField({
      name: 'values',
      title: 'Value items (hover-driven list)',
      group: 'values',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'valueItem',
          fields: [
            defineField({ name: 'icon', title: 'Emoji icon', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
            defineField({ name: 'image', title: 'Image (shown on hover)', type: 'image', options: { hotspot: true } }),
          ],
          preview: { select: { title: 'title', subtitle: 'body', media: 'image' } },
        }),
      ],
    }),

    /* ───── 4 · Workplace ───── */
    defineField({ name: 'workplaceLabel', title: 'Label', group: 'workplace', type: 'string' }),
    defineField({ name: 'workplaceHeadline', title: 'Headline', group: 'workplace', type: 'text', rows: 3 }),
    defineField({ name: 'workplaceTagline', title: 'Italic tagline', group: 'workplace', type: 'string' }),
    defineField({ name: 'workplaceBody', title: 'Body paragraph', group: 'workplace', type: 'text', rows: 5 }),
    defineField({
      name: 'workplaceImages',
      title: 'Workplace photo grid (with captions)',
      group: 'workplace',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workplaceImage',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
          preview: { select: { title: 'caption', media: 'image' } },
        }),
      ],
    }),

    /* ───── 5 · Together ───── */
    defineField({ name: 'togetherLabel', title: 'Label', group: 'together', type: 'string' }),
    defineField({ name: 'togetherHeadline', title: 'Headline', group: 'together', type: 'text', rows: 3 }),
    defineField({ name: 'togetherTagline', title: 'Italic tagline', group: 'together', type: 'string' }),
    defineField({ name: 'togetherBody', title: 'Body paragraph', group: 'together', type: 'text', rows: 5 }),
    defineField({
      name: 'togetherBrands',
      title: 'Brand cards at the bottom',
      group: 'together',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'togetherBrand',
          fields: [
            defineField({ name: 'name', title: 'Brand name', type: 'string' }),
            defineField({ name: 'tag', title: 'Italic tagline', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'tag' } },
        }),
      ],
    }),
    defineField({ name: 'togetherClosingMark', title: 'Closing mark (e.g. "end <life at jlm>")', group: 'together', type: 'string' }),
    defineField({ name: 'togetherClosingLine', title: 'Closing italic line', group: 'together', type: 'string' }),
    defineField({ name: 'togetherCtaLabel', title: 'CTA button label (e.g. "Get in touch")', group: 'together', type: 'string' }),
    defineField({ name: 'togetherCtaHref', title: 'CTA button link', group: 'together', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Life at JL Morison' }) },
})
