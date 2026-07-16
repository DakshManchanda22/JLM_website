import { defineField } from 'sanity'

type Platform = 'instagram' | 'facebook' | 'youtube'

/**
 * Editable content for one social "stamp" card (the Follow us / Join the
 * community section on the brand pages). Spread the returned fields into a
 * brand schema's `fields` array — they all live in the `social` group.
 *
 * Usage: `...socialCardFields('instagram', 'Instagram')`
 */
export function socialCardFields(platform: Platform, label: string) {
  const countLabel = platform === 'youtube' ? 'Subscribers' : 'Followers'
  return [
    defineField({
      name: `${platform}Followers`,
      title: `${label} — ${countLabel} count`,
      description: `Big number shown on the ${label} card, e.g. "25K". Type it in — this is not fetched live.`,
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: `${platform}CardHeading`,
      title: `${label} — Card heading`,
      type: 'string',
      group: 'social',
    }),
    defineField({
      name: `${platform}CardSubcopy`,
      title: `${label} — Card subtext`,
      type: 'text',
      rows: 2,
      group: 'social',
    }),
    defineField({
      name: `${platform}CardImage`,
      title: `${label} — Card image`,
      description: 'Optional photo shown on one half of the card.',
      type: 'image',
      options: { hotspot: true },
      group: 'social',
    }),
  ]
}
