import { defineType, defineField } from 'sanity'

/**
 * Careers page — singleton document.
 * Holds the intro copy and, importantly, the email address(es) that job
 * applications are delivered to — so marketing/HR can change the recipient
 * without a developer. The form fields themselves stay in code.
 */
export default defineType({
  name: 'careers',
  title: 'Careers',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'form', title: 'Form messages' },
    { name: 'delivery', title: 'Where applications go' },
  ],
  fields: [
    /* ───────────── Hero ───────────── */
    defineField({
      name: 'eyebrow',
      title: 'Small eyebrow (e.g. "Careers")',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'headline',
      title: 'Headline — normal part (e.g. "Join")',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'headlineItalic',
      title: 'Headline — italic part (e.g. "us")',
      group: 'hero',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Italic tagline below the headline',
      group: 'hero',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'body',
      title: 'Intro paragraph',
      group: 'hero',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero background photo (optional)',
      description:
        'Leave empty for the plain warm background. Add a photo to use it as a full-bleed hero.',
      group: 'hero',
      type: 'image',
      options: { hotspot: true },
    }),

    /* ───────────── Form messages ───────────── */
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      group: 'form',
      type: 'string',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message (after applying)',
      group: 'form',
      type: 'text',
      rows: 2,
    }),

    /* ───────────── Delivery ───────────── */
    defineField({
      name: 'recipientEmails',
      title: 'Send applications to',
      description:
        'Email address(es) that receive job applications. Add one or more — every ' +
        'address here gets a copy.',
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
  ],
  preview: { prepare: () => ({ title: 'Careers' }) },
})
