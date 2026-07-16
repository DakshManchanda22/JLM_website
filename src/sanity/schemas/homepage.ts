import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Homepage singleton — every editable string and image on the home page lives
 * here. Marketing can rewrite copy, swap any image, change brand taglines, and
 * publish, without touching the code.
 */
export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  // Singleton behaviour is enforced by the Studio structure config
  // (see sanity.config.ts), which pins this to a single document id.
  groups: [
    { name: 'heroMode', title: 'Hero mode' },
    { name: 'heroVideo', title: 'Hero · Video' },
    { name: 'hero', title: 'Hero · Photo carousel' },
    { name: 'vision', title: 'Our Vision' },
    { name: 'quote', title: 'Quote' },
    { name: 'values', title: 'Values image' },
    { name: 'brands', title: 'Brand cards' },
    { name: 'stats', title: 'Stats' },
    { name: 'features', title: 'Feature sections' },
  ],
  fields: [
    /* ─────────────── Hero mode switch ─────────────── */
    defineField({
      name: 'heroUseCarousel',
      title: 'Show photo carousel instead of video',
      description:
        'OFF  →  the hero is a single video (set it up under the “Hero · Video” tab). ' +
        'ON  →  the hero becomes a photo carousel (add photos under the “Hero · Photo carousel” tab). ' +
        'This switch decides which one visitors see.',
      type: 'boolean',
      group: 'heroMode',
      initialValue: false,
      options: { layout: 'switch' },
    }),

    /* ─────────────── Hero video (shown when the switch is OFF) ─────────────── */
    defineField({
      name: 'heroVideo',
      title: 'Hero video',
      description:
        'Shown when “Show photo carousel instead of video” is OFF. ' +
        'Add a video link (or upload a file) and it plays full-screen at the top of the homepage.',
      type: 'object',
      group: 'heroVideo',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'videoFile',
          title: 'Upload video',
          description:
            'Upload an MP4 video here. This is the easiest option — just click and choose a file. ' +
            'Keep it under ~50MB for fast loading. For very large videos, use the “Video link” field below instead.',
          type: 'file',
          options: { accept: 'video/*' },
        }),
        defineField({
          name: 'videoUrl',
          title: 'Video link (optional)',
          description:
            'Alternative to uploading: paste a direct link to an MP4 video (e.g. a Google Cloud Storage URL). ' +
            'Used only if no video is uploaded above.',
          type: 'url',
        }),
        defineField({
          name: 'poster',
          title: 'Poster / fallback image (optional)',
          description:
            'Shown while the video loads. Recommended so visitors never see a blank box.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'brand',
          title: 'Headline text',
          description: 'Big headline shown over the video, e.g. a brand name.',
          type: 'string',
        }),
        defineField({
          name: 'tagline',
          title: 'Small text above headline',
          description: 'Small caption shown above the headline, e.g. a tagline.',
          type: 'string',
        }),
      ],
      preview: {
        select: { title: 'brand', subtitle: 'tagline', media: 'poster' },
        prepare: ({ title, subtitle, media }) => ({
          title: title || 'Hero video',
          subtitle: subtitle || 'Plays instead of the slideshow when set',
          media,
        }),
      },
    }),

    /* ─────────────── Hero slideshow ─────────────── */
    defineField({
      name: 'heroSlideInterval',
      title: 'Seconds each photo stays on screen',
      description:
        'How long each photo shows before the carousel moves to the next one. ' +
        'Only used when “Show photo carousel instead of video” is ON.',
      type: 'number',
      group: 'hero',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(30),
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero photos',
      description:
        'The crossfading photos at the top of the homepage (used when the carousel is ON). ' +
        'Add as many as you like, drag to reorder, and give each one its own headline and caption.',
      type: 'array',
      group: 'hero',
      validation: (Rule) => Rule.min(1).max(20),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'heroSlide',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'brand',
              title: 'Brand name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'tagline',
              title: 'Tagline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'brand', subtitle: 'tagline', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────────── Our Vision ─────────────── */
    defineField({
      name: 'vision',
      title: 'Our Vision',
      type: 'object',
      group: 'vision',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          description: 'Small heading above the statement, e.g. "Our Vision".',
        }),
        defineField({
          name: 'text',
          title: 'Vision statement',
          description: 'Reveals with a beige marker highlight as it scrolls into view.',
          type: 'text',
          rows: 3,
        }),
      ],
    }),

    /* ─────────────── Quote section (legacy — no longer rendered) ─────────────── */
    defineField({
      name: 'quote',
      title: 'Editorial quote',
      type: 'object',
      group: 'quote',
      fields: [
        defineField({
          name: 'lines',
          title: 'Quote lines (one per line break)',
          description:
            'Each line is shown on its own row. Animates word-by-word on scroll.',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.min(1).max(8),
        }),
        defineField({
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
          description: 'e.g. "— J.L. MORISON"',
        }),
      ],
    }),

    /* ─────────────── Values image ─────────────── */
    defineField({
      name: 'showValuesImage',
      title: 'Show the values image',
      description:
        'ON → the values image is shown just below the quote on the homepage. ' +
        'OFF → the whole section is hidden and no empty space is left behind.',
      type: 'boolean',
      group: 'values',
      initialValue: true,
      options: { layout: 'switch' },
    }),
    defineField({
      name: 'valuesImage',
      title: 'Values image',
      description:
        'A single full-width image shown below the quote (e.g. the JLM values graphic). ' +
        'Use the switch above to show or hide it.',
      type: 'image',
      group: 'values',
      options: { hotspot: true },
    }),

    /* ─────────────── Brand cards ─────────────── */
    defineField({
      name: 'brands',
      title: 'Brand cards',
      type: 'array',
      group: 'brands',
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'brand',
          fields: [
            defineField({
              name: 'name',
              title: 'Brand name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'shortName',
              title: 'Short name',
              description: 'Used in the hover label. Keep it tight.',
              type: 'string',
            }),
            defineField({
              name: 'tagline',
              title: 'Tagline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description:
                'Where the card links to, e.g. /brands/morisons-baby-dreams',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'tagline', media: 'image' },
          },
        }),
      ],
    }),

    /* ─────────────── Stats section ─────────────── */
    defineField({
      name: 'statsHeading',
      title: 'Stats — section heading',
      description: 'Large editorial heading above the metric cards.',
      type: 'string',
      group: 'stats',
    }),
    defineField({
      name: 'statsNote',
      title: 'Stats — small note',
      description: 'Small uppercase note shown to the right of the heading, e.g. "Since 1920".',
      type: 'string',
      group: 'stats',
    }),
    defineField({
      name: 'stats',
      title: 'Stat cards',
      type: 'array',
      group: 'stats',
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              description: 'e.g. "100+", "3", "1"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              description: 'e.g. "Years", "Brands", "Promise"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body copy',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
          },
        }),
      ],
    }),

    /* ─────────────── Feature sections ─────────────── */
    defineField({
      name: 'features',
      title: 'Feature sections',
      description:
        'The large image + text sections near the bottom of the homepage. Each one ' +
        'alternates the image left/right and links somewhere with a button.',
      type: 'array',
      group: 'features',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({
              name: 'eyebrow',
              title: 'Eyebrow',
              description: 'Small uppercase label above the headline.',
              type: 'string',
            }),
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body copy',
              type: 'text',
              rows: 3,
            }),
            defineField({
              name: 'ctaLabel',
              title: 'Button label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Button link',
              description: 'e.g. /life-at-jlm or a full https:// URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'imageRight',
              title: 'Show image on the right',
              description: 'ON → image on the right, text on the left. OFF → image on the left.',
              type: 'boolean',
              initialValue: false,
              options: { layout: 'switch' },
            }),
          ],
          preview: {
            select: { title: 'headline', subtitle: 'eyebrow', media: 'image' },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
})
