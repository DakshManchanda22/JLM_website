import { defineType, defineField, defineArrayMember } from 'sanity'
import { seoFields } from './seoFields'

/**
 * Contact Us page — singleton document.
 * Holds all the on-page copy, the office details, the rotating portrait photos,
 * and — importantly — the email address(es) that enquiries are delivered to, so
 * marketing can change the recipient without a developer.
 */
export default defineType({
  name: 'contactUs',
  title: 'Contact Us',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Heading' },
    { name: 'offices', title: 'Offices' },
    { name: 'form', title: 'Form messages' },
    { name: 'wheel', title: 'Photo wheel' },
    { name: 'delivery', title: 'Where enquiries go' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ───────────── Heading ───────────── */
    defineField({
      name: 'heading',
      title: 'Heading (e.g. "Contact us")',
      group: 'intro',
      type: 'string',
    }),
    defineField({
      name: 'subcopy',
      title: 'Sub-copy under the heading',
      group: 'intro',
      type: 'text',
      rows: 2,
    }),

    /* ───────────── Offices ───────────── */
    defineField({
      name: 'offices',
      title: 'Office cards',
      group: 'offices',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'office',
          fields: [
            defineField({ name: 'title', title: 'Title (e.g. "Head Office: Mumbai")', type: 'string' }),
            defineField({
              name: 'address',
              title: 'Address',
              description: 'Each new line is shown on its own line.',
              type: 'text',
              rows: 4,
            }),
            defineField({ name: 'phone', title: 'Phone (display)', type: 'string' }),
            defineField({
              name: 'phoneHref',
              title: 'Phone link',
              description: 'e.g. "tel:+912261410300"',
              type: 'string',
            }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
          ],
          preview: { select: { title: 'title', subtitle: 'email' } },
        }),
      ],
    }),

    /* ───────────── Form messages ───────────── */
    defineField({
      name: 'formHeading',
      title: 'Form heading (e.g. "Write us a message")',
      group: 'form',
      type: 'string',
    }),
    defineField({
      name: 'formSuccessHeading',
      title: 'Success heading (e.g. "Message sent.")',
      group: 'form',
      type: 'string',
    }),
    defineField({
      name: 'formSuccessBody',
      title: 'Success message body',
      group: 'form',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'privacyPolicyUrl',
      title: 'Privacy Policy link',
      group: 'form',
      type: 'url',
    }),

    /* ───────────── Photo wheel ───────────── */
    defineField({
      name: 'showWheel',
      title: 'Show the “Want to work with us?” section',
      description:
        'Turn off to completely hide the rotating photo wheel and its button at ' +
        'the bottom of the Contact page. On by default.',
      group: 'wheel',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'wheelHeading',
      title: 'Wheel heading (e.g. "Want to work with us?")',
      group: 'wheel',
      type: 'string',
      hidden: ({ parent }) => parent?.showWheel === false,
    }),
    defineField({
      name: 'wheelCtaLabel',
      title: 'Wheel button label (e.g. "Join the team")',
      group: 'wheel',
      type: 'string',
    }),
    defineField({
      name: 'wheelCtaHref',
      title: 'Wheel button link (e.g. "/careers")',
      group: 'wheel',
      type: 'string',
    }),
    defineField({
      name: 'portraits',
      title: 'Rotating portrait photos',
      description: 'The circle of photos behind the "Want to work with us?" heading.',
      group: 'wheel',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      options: { layout: 'grid' },
    }),

    /* ───────────── Delivery ───────────── */
    defineField({
      name: 'recipientEmails',
      title: 'Send enquiries to',
      description:
        'Email address(es) that receive contact-form enquiries. Add one or more — ' +
        'every address here gets a copy.',
      group: 'delivery',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.min(1)
          .error('Add at least one recipient email.')
          .custom((emails?: string[]) => {
            if (!emails) return true
            const bad = emails.find((e) => !/\S+@\S+\.\S+/.test(e))
            return bad ? `"${bad}" is not a valid email address.` : true
          }),
    }),
    ...seoFields('seo'),
  ],
  preview: { prepare: () => ({ title: 'Contact Us' }) },
})
