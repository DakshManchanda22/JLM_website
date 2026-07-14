import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Site settings singleton — global bits of the site marketing can edit without
 * a developer. Currently this drives the footer (links, address, socials,
 * copyright). Pinned to a single document id by the Studio structure config.
 */
export default defineType({
  name: 'siteSettings',
  title: 'Footer & site settings',
  type: 'document',
  groups: [{ name: 'footer', title: 'Footer' }],
  fields: [
    /* ─────────────── Footer: Company column ─────────────── */
    defineField({
      name: 'footerCompanyLinks',
      title: 'Footer — “Company” links',
      description:
        'The list of links under the “Company” heading in the footer. Drag to reorder.',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              description:
                'An internal path like /careers, or a full https:// link for an external page.',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'external',
              title: 'Opens in a new tab',
              description:
                'Turn ON for links to other websites or PDFs so they open in a new tab.',
              type: 'boolean',
              initialValue: false,
              options: { layout: 'checkbox' },
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),

    /* ─────────────── Footer: Address ─────────────── */
    defineField({
      name: 'footerAddress',
      title: 'Footer — address (one line per row)',
      description:
        'Shown under the “Visit Us” heading. Add each line of the address as its own row.',
      type: 'array',
      group: 'footer',
      of: [{ type: 'string' }],
    }),

    /* ─────────────── Footer: Social links ─────────────── */
    defineField({
      name: 'footerSocial',
      title: 'Footer — social links',
      description:
        'Paste the full profile link for each platform. Leave a field blank to hide that icon.',
      type: 'object',
      group: 'footer',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X / Twitter URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'footerFollowText',
      title: 'Footer — text under the social icons',
      type: 'text',
      rows: 3,
      group: 'footer',
    }),

    /* ─────────────── Footer: bottom bar ─────────────── */
    defineField({
      name: 'footerCopyright',
      title: 'Footer — copyright line',
      description: 'The small print in the bottom bar, e.g. “© 2024 JL Morison India Ltd. All rights reserved.”',
      type: 'string',
      group: 'footer',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Footer & site settings' }),
  },
})
