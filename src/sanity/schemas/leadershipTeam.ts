import { defineType, defineField, defineArrayMember } from 'sanity'

/**
 * Leadership order — singleton document.
 * Holds a drag-to-reorder list of leadership team members. The website shows the
 * leaders in exactly this order. Anyone not added to the list simply appears
 * after those that are (kept in their old number order as a fallback), so adding
 * a new person never breaks the page — you just drag them into place here.
 */
export default defineType({
  name: 'leadershipTeam',
  title: 'Leadership order',
  type: 'document',
  fields: [
    defineField({
      name: 'members',
      title: 'Team order',
      description:
        'Drag the cards up or down to change the order they appear in on the ' +
        'website. Add a person with “Add item”, or remove them from the list ' +
        '(removing here does NOT delete the person — edit them under “Leadership ' +
        'Team”).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'leader' }],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Leadership order' }),
  },
})
