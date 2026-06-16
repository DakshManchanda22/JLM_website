import { defineArrayMember, defineType } from 'sanity'

/**
 * The rich-text editor used inside a blog post.
 *
 * Authors can:
 *  - Write paragraphs, H2 and H3 subheadings, and pull quotes
 *  - Drop bulleted and numbered lists
 *  - Insert images anywhere between paragraphs (with caption + alt text)
 *  - Add a callout "pull quote" block for editorial highlights
 */
export default defineType({
  title: 'Body',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bulleted', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      name: 'inlineImage',
      title: 'Inline image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the image for screen readers and SEO',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption shown beneath the image',
        },
        {
          name: 'fullBleed',
          type: 'boolean',
          title: 'Full-bleed (wider than text)',
          description: 'Tick to break the image out of the reading column',
          initialValue: false,
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'pullQuote',
      title: 'Pull quote',
      fields: [
        {
          name: 'quote',
          type: 'text',
          title: 'Quote',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution (optional)',
        },
      ],
      preview: {
        select: { quote: 'quote', attribution: 'attribution' },
        prepare: ({ quote, attribution }) => ({
          title: `“${(quote ?? '').slice(0, 60)}${(quote ?? '').length > 60 ? '…' : ''}”`,
          subtitle: attribution ? `— ${attribution}` : 'Pull quote',
        }),
      },
    }),
  ],
})
