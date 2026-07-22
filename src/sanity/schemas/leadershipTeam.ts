import { defineType, defineField, defineArrayMember } from 'sanity'
import { seoFields } from './seoFields'

/**
 * Leadership Team — singleton document.
 * The single place to manage the whole team: a drag-to-reorder list of members.
 * The website shows the leaders in exactly this order. Click a person to edit
 * their photo, bio and details; "Add item" creates a new leader. Anyone not
 * added here still appears after those that are (kept in their old number order
 * as a fallback), so nothing ever silently disappears from the page.
 */
export default defineType({
  name: 'leadershipTeam',
  title: 'Leadership Team',
  type: 'document',
  fields: [
    defineField({
      name: 'members',
      title: 'The team',
      description:
        'Drag the cards up or down to set the order they appear in on the ' +
        'website. Click a person to edit their photo, bio and details. Use ' +
        '“Add item” to add a new leader (or an existing one). Removing a card ' +
        'here does NOT delete that person — it only takes them off the page.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'leader' }],
        }),
      ],
    }),
    ...seoFields(),
  ],
  preview: {
    prepare: () => ({ title: 'Leadership Team' }),
  },
})
