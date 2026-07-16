import { defineType, defineField, defineArrayMember } from 'sanity'
import { socialCardFields } from './socialCard'

/* Shared pastel tint options for the product-category tiles. */
const TINTS = [
  { title: 'Mint', value: 'mint' },
  { title: 'Blush', value: 'blush' },
  { title: 'Butter', value: 'butter' },
  { title: 'Lilac', value: 'lilac' },
  { title: 'Sky', value: 'sky' },
]

/**
 * Morisons Baby Dreams brand page — singleton document.
 * Every banner, category, string and link on the /morisons-baby-dreams page
 * lives here so marketing can update the page without touching code.
 */
export default defineType({
  name: 'babyDreams',
  title: 'Morisons Baby Dreams',
  type: 'document',
  groups: [
    { name: 'banners', title: 'Banner carousel' },
    { name: 'products', title: 'Product categories' },
    { name: 'video', title: 'Video' },
    { name: 'range', title: 'Explore range' },
    { name: 'blogs', title: 'Doctor blogs' },
    { name: 'social', title: 'Social links' },
  ],
  fields: [
    /* ───────────── Banner carousel ───────────── */
    defineField({
      name: 'bannerInterval',
      title: 'Seconds between banners',
      group: 'banners',
      description:
        'How long each banner stays before the carousel moves to the next one. ' +
        'Default is 5 seconds.',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(2).max(30),
    }),
    defineField({
      name: 'banners',
      title: 'Banner images',
      group: 'banners',
      description:
        'Wide brand banners shown in the top carousel. Drag to reorder. ' +
        'Designed for a wide 1464×600 (roughly 2.4:1) frame. ' +
        'Add a link to make a banner clickable.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'banner',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'href', title: 'Link (optional)', type: 'string' }),
          ],
          preview: { select: { title: 'alt', media: 'image' } },
        }),
      ],
    }),

    /* ───────────── Product categories (used by both sections) ───────────── */
    defineField({
      name: 'productsHeadline',
      title: 'Our products — headline',
      group: 'products',
      type: 'string',
    }),
    defineField({
      name: 'productsIntro',
      title: 'Our products — intro',
      group: 'products',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'categories',
      title: 'Product categories',
      group: 'products',
      description:
        'Shown in both the "Our products" tiles and the "Explore our product ' +
        'range" carousel. Edit once, updates both.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'category',
          fields: [
            defineField({
              name: 'title',
              title: 'Category name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'blurb', title: 'Short blurb', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Product / category photo',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'tint',
              title: 'Tile colour',
              type: 'string',
              options: { list: TINTS, layout: 'radio' },
              initialValue: 'mint',
            }),
            defineField({ name: 'href', title: 'Link', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'blurb', media: 'image' } },
        }),
      ],
    }),

    /* ───────────── Video ───────────── */
    defineField({
      name: 'videoHeadline',
      title: 'Video headline',
      group: 'video',
      type: 'string',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (Google Cloud Storage MP4)',
      group: 'video',
      type: 'url',
      description: 'Paste the public GCS MP4 link. Leave empty to hide the video.',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'videoPoster',
      title: 'Video poster image',
      group: 'video',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Explore range ───────────── */
    defineField({
      name: 'rangeHeadline',
      title: 'Explore range — headline',
      group: 'range',
      type: 'string',
    }),
    defineField({
      name: 'rangeIntro',
      title: 'Explore range — intro',
      group: 'range',
      type: 'text',
      rows: 2,
    }),

    /* ───────────── Doctor blogs ───────────── */
    defineField({
      name: 'blogsHeadline',
      title: 'Blogs — headline',
      group: 'blogs',
      type: 'string',
    }),
    defineField({
      name: 'blogsIntro',
      title: 'Blogs — intro',
      group: 'blogs',
      type: 'text',
      rows: 2,
    }),

    /* ───────────── Social links ───────────── */
    defineField({
      name: 'instagramUrl',
      title: 'Instagram page URL',
      group: 'social',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook page URL',
      group: 'social',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube channel URL',
      group: 'social',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['https'] }),
    }),
    ...socialCardFields('instagram', 'Instagram'),
    ...socialCardFields('facebook', 'Facebook'),
    ...socialCardFields('youtube', 'YouTube'),
  ],
  preview: {
    prepare: () => ({ title: 'Morisons Baby Dreams' }),
  },
})
