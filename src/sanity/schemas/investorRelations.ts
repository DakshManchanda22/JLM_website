import { defineArrayMember, defineField, defineType } from 'sanity'
import { seoFields } from './seoFields'

/* A single PDF link: marketing can either upload a PDF file OR paste a URL.
   Whichever is filled is used (the uploaded file wins when both are set). */
const docLink = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    ...(group ? { group } : {}),
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'docLink',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string' }),
          defineField({
            name: 'file',
            title: 'PDF file (upload)',
            type: 'file',
            options: { accept: 'application/pdf' },
          }),
          defineField({
            name: 'url',
            title: 'or PDF URL',
            type: 'url',
            description: 'Used only if no file is uploaded above.',
          }),
        ],
        preview: { select: { title: 'label', subtitle: 'url' } },
      }),
    ],
  })

/* A column of links (used by the Notice-of-Meetings matrix and the two IEPF
   tables — each column has a heading and a vertical list of PDF links). */
const linkColumns = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    group,
    description,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'linkColumn',
        fields: [
          defineField({ name: 'heading', title: 'Column heading', type: 'string' }),
          docLink('links', 'Links'),
        ],
        preview: { select: { title: 'heading' } },
      }),
    ],
  })

export default defineType({
  name: 'investorRelations',
  title: 'Investor Relations',
  type: 'document',
  groups: [
    { name: 'terms', title: 'Terms of Appointment' },
    { name: 'csr', title: 'CSR Committee' },
    { name: 'policies', title: 'Policies' },
    { name: 'notice', title: 'Notice of Meetings / Postal Ballot' },
    { name: 'investors', title: 'Investors Information' },
    { name: 'iepf', title: 'IEPF' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    /* ─────────── 1. Terms of Appointment of Independent Directors ─────────── */
    defineField({
      name: 'termsHeading',
      title: 'Section heading',
      group: 'terms',
      type: 'string',
      initialValue: 'TERMS OF APPOINTMENT OF INDEPENDENT DIRECTORS',
    }),
    docLink('termsDocs', 'Documents', 'terms'),

    /* ─────────── 2. Corporate Social Responsibility Committee ─────────── */
    defineField({
      name: 'csrHeading',
      title: 'Section heading',
      group: 'csr',
      type: 'string',
      initialValue: 'CORPORATE SOCIAL RESPONSIBILITY COMMITTEE',
    }),
    defineField({
      name: 'csrMembers',
      title: 'Committee members',
      group: 'csr',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'member',
          fields: [
            defineField({ name: 'name', title: 'Name of the Member', type: 'string' }),
            defineField({ name: 'designation', title: 'Designation', type: 'string' }),
          ],
          preview: { select: { title: 'name', subtitle: 'designation' } },
        }),
      ],
    }),

    /* ─────────── 3. Policies ─────────── */
    defineField({
      name: 'policiesHeading',
      title: 'Section heading',
      group: 'policies',
      type: 'string',
      initialValue: 'POLICIES',
    }),
    docLink('policiesDocs', 'Documents', 'policies'),

    /* ─────────── 4. Notice of General Meetings / Postal Ballot ─────────── */
    defineField({
      name: 'noticeHeading',
      title: 'Section heading',
      group: 'notice',
      type: 'string',
      initialValue: 'Notice of General Meetings/Postal Ballot',
    }),
    defineField({
      name: 'noticeHeadings',
      title: 'Column headings',
      group: 'notice',
      description: 'The financial-year column headers, left to right.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'noticeRows',
      title: 'Rows',
      group: 'notice',
      description:
        'Each row is one document type across the year columns. Add one cell per ' +
        'column, in the same left-to-right order as the headings above; leave a ' +
        "cell's label blank where that year has no such document.",
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'noticeRow',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells (one per column, left to right)',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'cell',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({
                      name: 'file',
                      title: 'PDF file (upload)',
                      type: 'file',
                      options: { accept: 'application/pdf' },
                    }),
                    defineField({
                      name: 'url',
                      title: 'or PDF URL',
                      type: 'url',
                      description: 'Used only if no file is uploaded above.',
                    }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'url' } },
                }),
              ],
            }),
          ],
          preview: {
            select: { c0: 'cells.0.label', c1: 'cells.1.label' },
            prepare: ({ c0, c1 }) => ({ title: c0 || c1 || 'Row' }),
          },
        }),
      ],
    }),

    /* ─────────── 5. Investors Information ─────────── */
    defineField({
      name: 'investorsHeading',
      title: 'Section heading',
      group: 'investors',
      type: 'string',
      initialValue: 'INVESTORS INFORMATION',
    }),
    defineField({
      name: 'investorsIntro',
      title: 'Intro paragraph',
      group: 'investors',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'investorsContacts',
      title: 'Contact blocks',
      group: 'investors',
      description: 'e.g. the company contact, Registrar & Transfer Agents, Registered Office.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactBlock',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading (optional)',
              type: 'string',
              description: 'e.g. "Registrar & Transfer Agents :" — leave blank for no heading.',
            }),
            defineField({
              name: 'body',
              title: 'Address / details (one item per line)',
              type: 'text',
              rows: 8,
            }),
          ],
          preview: { select: { title: 'heading', subtitle: 'body' } },
        }),
      ],
    }),
    docLink('investorsDocs', 'Forms & documents', 'investors'),
    defineField({
      name: 'campaignHeading',
      title: 'Campaign sub-heading',
      group: 'investors',
      type: 'string',
      initialValue: '100 DAYS CAMPAIGN-SAKSHAM NIVESHAK',
    }),
    docLink('campaignDocs', 'Campaign documents', 'investors'),
    defineField({
      name: 'multipleMailingHeading',
      title: 'Multiple Mailing — heading',
      group: 'investors',
      type: 'string',
      initialValue: 'Multiple Mailing',
    }),
    defineField({
      name: 'multipleMailingBody',
      title: 'Multiple Mailing — paragraph',
      group: 'investors',
      type: 'text',
      rows: 5,
    }),

    /* ─────────── 6. IEPF ─────────── */
    defineField({
      name: 'iepfHeading',
      title: 'Section heading',
      group: 'iepf',
      type: 'string',
      initialValue: 'IEPF',
    }),
    defineField({
      name: 'iepfContactHeading',
      title: 'Nodal officer — heading',
      group: 'iepf',
      type: 'string',
      initialValue: 'Nodal Officer for IEPF Authority',
    }),
    defineField({
      name: 'iepfContact',
      title: 'Nodal officer — details (one item per line)',
      group: 'iepf',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'iepfSharesHeading',
      title: 'Shares transferred — sub-heading',
      group: 'iepf',
      type: 'string',
      initialValue: 'Shares transferred to IEPF Authority',
    }),
    linkColumns('iepfSharesColumns', 'Shares transferred — columns', 'iepf'),
    defineField({
      name: 'iepfDividendHeading',
      title: 'Unclaimed dividend — sub-heading',
      group: 'iepf',
      type: 'string',
      initialValue: 'Details of unclaimed/unpaid Dividend to be transferred to IEPF Authority',
    }),
    linkColumns('iepfDividendColumns', 'Unclaimed dividend — columns', 'iepf'),
    defineField({
      name: 'iepfProcedureHeading',
      title: 'Procedure — sub-heading',
      group: 'iepf',
      type: 'string',
      initialValue: 'Procedure for claiming the refund of shares and dividend from IEPF',
    }),
    defineField({
      name: 'iepfProcedureItems',
      title: 'Procedure — paragraphs',
      group: 'iepf',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'procedureItem',
          fields: [
            defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
            defineField({
              name: 'url',
              title: 'Link (optional)',
              type: 'url',
              validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
            }),
          ],
          preview: { select: { title: 'text', subtitle: 'url' } },
        }),
      ],
    }),
    ...seoFields('seo'),
  ],
  preview: { prepare: () => ({ title: 'Investor Relations' }) },
})
