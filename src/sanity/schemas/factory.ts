import { defineField, defineArrayMember } from 'sanity'

/**
 * Shared "Our Factory" section fields, reused across the brand pages
 * (Morisons Baby Dreams, Bigen, Emoform). One photo of the factory, a short
 * description, and the certifications the factory has obtained (each shown as a
 * badge with an optional logo). Pass the Studio field group these should live
 * under so every brand keeps a tidy "Factory" tab.
 */
export function factoryFields(group: string) {
  return [
    defineField({
      name: 'factoryHeading',
      title: 'Factory — heading',
      description: 'e.g. "Our Factory". Leave empty to use the default.',
      type: 'string',
      group,
    }),
    defineField({
      name: 'factoryImage',
      title: 'Factory — photo',
      description: 'A single photo of the factory.',
      type: 'image',
      options: { hotspot: true },
      group,
    }),
    defineField({
      name: 'factoryDescription',
      title: 'Factory — description',
      description: 'A short paragraph about the factory.',
      type: 'text',
      rows: 4,
      group,
    }),
    defineField({
      name: 'certifications',
      title: 'Factory — certifications',
      description:
        'Every certification the factory has obtained. Each shows as a badge; ' +
        'add a logo to display it, otherwise just the name is shown.',
      type: 'array',
      group,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'certification',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              description: 'e.g. "ISO 9001:2015", "GMP", "WHO-GMP".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              title: 'Logo (optional)',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),
  ]
}
