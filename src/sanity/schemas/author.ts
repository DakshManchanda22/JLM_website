import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
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
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      description: 'One or two lines about the writer — shown beneath the post',
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
      description: 'Optional — e.g. “Paediatrician” or “Mother of two”',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar', subtitle: 'role' },
  },
})
