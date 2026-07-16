import { defineType, defineField, defineArrayMember } from 'sanity'
import { socialCardFields } from './socialCard'

/**
 * Inline rich text for headlines / copy: lets editors make selected words
 * Bold, Italic, or apply a brand Colour (Gold / Dark / Muted) from the toolbar.
 * Returns a fresh field config each call so schema objects aren't shared.
 */
const richText = () => ({
  type: 'array' as const,
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Gold', value: 'gold' },
          { title: 'Dark', value: 'dark' },
          { title: 'Muted', value: 'muted' },
        ],
        annotations: [],
      },
    }),
  ],
})

/**
 * Bigen brand page — singleton document.
 * Every text string and image on the /bigen page lives here so marketing can
 * edit copy, swap images and reorder products/reels without touching code.
 */
export default defineType({
  name: 'bigen',
  title: 'Bigen',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'video', title: 'Video' },
    { name: 'ritual', title: '10-minute ritual' },
    { name: 'shine', title: 'Natural shine' },
    { name: 'testimonials', title: 'Reels / testimonials' },
    { name: 'range', title: 'Product range' },
    { name: 'social', title: 'Social links' },
  ],
  fields: [
    /* ───────────── Hero ───────────── */
    defineField({
      name: 'heroLogo',
      title: 'Bigen logo',
      group: 'hero',
      type: 'image',
      description: 'Leave empty to use the built-in Bigen logo.',
    }),
    defineField({
      name: 'heroHeadline1',
      title: 'Headline line 1',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroHeadline2',
      title: 'Headline line 2',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroHeadline3',
      title: 'Headline line 3 (gold italic)',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Eyebrow pill text',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Button label',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Button link',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero photo (right side)',
      group: 'hero',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Video ───────────── */
    defineField({
      name: 'videoHeadline',
      title: 'Video headline',
      group: 'video',
      ...richText(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (Google Cloud Storage MP4)',
      group: 'video',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),

    /* ───────────── 10-minute ritual ───────────── */
    defineField({
      name: 'ritualHeadlinePlain',
      title: 'Headline — plain part',
      group: 'ritual',
      type: 'string',
    }),
    defineField({
      name: 'ritualHeadlineItalic1',
      title: 'Headline — gold italic (inline)',
      group: 'ritual',
      type: 'string',
    }),
    defineField({
      name: 'ritualHeadlineItalic2',
      title: 'Headline — gold italic (own line)',
      group: 'ritual',
      type: 'string',
    }),
    defineField({
      name: 'ritualBody',
      title: 'Body text',
      group: 'ritual',
      ...richText(),
    }),
    defineField({
      name: 'ritualFeatures',
      title: 'Feature pills',
      group: 'ritual',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Sparkle', value: 'sparkle' },
                  { title: 'Drop', value: 'drop' },
                ],
              },
              initialValue: 'sparkle',
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'ritualImage',
      title: 'Product photo',
      group: 'ritual',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Natural shine ───────────── */
    defineField({
      name: 'shineBannerTop',
      title: 'Banner — top line',
      group: 'shine',
      type: 'string',
    }),
    defineField({
      name: 'shineBannerBottom',
      title: 'Banner — bottom line (gold highlight)',
      group: 'shine',
      type: 'string',
    }),
    defineField({
      name: 'shineHeadline',
      title: 'Headline',
      group: 'shine',
      ...richText(),
    }),
    defineField({
      name: 'shineBody',
      title: 'Body text',
      group: 'shine',
      ...richText(),
    }),
    defineField({
      name: 'shinePillLabel',
      title: 'Pill label',
      group: 'shine',
      type: 'string',
    }),
    defineField({
      name: 'shineImage',
      title: 'Photo (right side)',
      group: 'shine',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Reels / testimonials ───────────── */
    defineField({
      name: 'testimonialsHeadline',
      title: 'Testimonials headline',
      group: 'testimonials',
      ...richText(),
    }),
    defineField({
      name: 'reels',
      title: 'Customer video reels (Instagram)',
      group: 'testimonials',
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
              validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
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

    /* ───────────── Product range ───────────── */
    defineField({
      name: 'rangeEyebrow',
      title: 'Eyebrow',
      group: 'range',
      type: 'string',
    }),
    defineField({
      name: 'rangeHeadline',
      title: 'Headline',
      group: 'range',
      ...richText(),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      group: 'range',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'product',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({ name: 'href', title: 'Shop link', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'desc', media: 'image' } },
        }),
      ],
    }),

    /* ───────────── Social links ───────────── */
    defineField({
      name: 'instagramUrl',
      title: 'Instagram page URL',
      description: 'The “Join the community” Instagram icon links here.',
      group: 'social',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook page URL',
      description: 'The “Join the community” Facebook icon links here.',
      group: 'social',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    ...socialCardFields('instagram', 'Instagram'),
    ...socialCardFields('facebook', 'Facebook'),
  ],
  preview: {
    prepare: () => ({ title: 'Bigen' }),
  },
})
