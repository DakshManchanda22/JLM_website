import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'

/**
 * Studio sidebar structure mirrors the website's navbar so marketing can find
 * any page exactly where they'd expect it. New sections (Our Brands, Investor
 * Relations, etc.) can be slotted in here as soon as their schemas exist.
 */
export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'JL Morison — Editorial',
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Editorial')
          .items([
            /* ─────── Mains ─────── */
            S.listItem()
              .title('Mains')
              .child(
                S.list()
                  .title('Mains')
                  .items([
                    S.listItem()
                      .title('Homepage')
                      .id('homepage')
                      .child(
                        S.editor()
                          .id('homepage')
                          .schemaType('homepage')
                          .documentId('homepage'),
                      ),
                    S.listItem()
                      .title('Philanthropy')
                      .id('philanthropy')
                      .child(
                        S.editor()
                          .id('philanthropy')
                          .schemaType('philanthropy')
                          .documentId('philanthropy'),
                      ),
                    S.listItem()
                      .title('ESG')
                      .id('esg')
                      .child(
                        S.editor()
                          .id('esg')
                          .schemaType('esg')
                          .documentId('esg'),
                      ),
                    S.listItem()
                      .title('Careers')
                      .id('careers')
                      .child(
                        S.editor()
                          .id('careers')
                          .schemaType('careers')
                          .documentId('careers'),
                      ),
                    S.listItem()
                      .title('Contact Us')
                      .id('contactUs')
                      .child(
                        S.editor()
                          .id('contactUs')
                          .schemaType('contactUs')
                          .documentId('contactUs'),
                      ),
                    S.listItem()
                      .title('Investor Relations')
                      .id('investorRelations')
                      .child(
                        S.editor()
                          .id('investorRelations')
                          .schemaType('investorRelations')
                          .documentId('investorRelations'),
                      ),
                  ]),
              ),

            /* ─────── Our People (mirrors navbar dropdown) ─────── */
            S.listItem()
              .title('Our People')
              .child(
                S.list()
                  .title('Our People')
                  .items([
                    S.listItem()
                      .title('Our Story')
                      .id('ourStory')
                      .child(
                        S.editor()
                          .id('ourStory')
                          .schemaType('ourStory')
                          .documentId('ourStory'),
                      ),
                    S.listItem()
                      .title('Leadership Team')
                      .id('leaderList')
                      .child(
                        S.documentTypeList('leader')
                          .title('Leadership Team')
                          .defaultOrdering([{ field: 'order', direction: 'asc' }]),
                      ),
                    S.listItem()
                      .title('Leadership order')
                      .id('leadershipOrder')
                      .child(
                        S.editor()
                          .id('leadershipTeam')
                          .schemaType('leadershipTeam')
                          .documentId('leadershipTeam'),
                      ),
                    S.listItem()
                      .title('Life at JLM')
                      .id('lifeAtJlm')
                      .child(
                        S.editor()
                          .id('lifeAtJlm')
                          .schemaType('lifeAtJlm')
                          .documentId('lifeAtJlm'),
                      ),
                  ]),
              ),

            /* ─────── Our Brands (mirrors navbar dropdown) ─────── */
            S.listItem()
              .title('Our Brands')
              .child(
                S.list()
                  .title('Our Brands')
                  .items([
                    S.listItem()
                      .title('Morisons Baby Dreams')
                      .id('babyDreams')
                      .child(
                        S.editor()
                          .id('babyDreams')
                          .schemaType('babyDreams')
                          .documentId('babyDreams'),
                      ),
                    S.listItem()
                      .title('Bigen')
                      .id('bigen')
                      .child(
                        S.editor()
                          .id('bigen')
                          .schemaType('bigen')
                          .documentId('bigen'),
                      ),
                    S.listItem()
                      .title('Emoform')
                      .id('emoform')
                      .child(
                        S.editor()
                          .id('emoform')
                          .schemaType('emoform')
                          .documentId('emoform'),
                      ),
                    S.listItem()
                      .title('Morisons')
                      .id('morisons')
                      .child(
                        S.editor()
                          .id('morisons')
                          .schemaType('morisons')
                          .documentId('morisons'),
                      ),
                  ]),
              ),

            S.divider(),

            /* ─────── Blog (kept separate, used heavily) ─────── */
            S.listItem()
              .title('Blog')
              .child(
                S.list()
                  .title('Blog')
                  .items([
                    S.listItem()
                      .title('Blog posts')
                      .child(S.documentTypeList('post').title('Blog posts')),
                    S.listItem()
                      .title('Authors')
                      .child(S.documentTypeList('author').title('Authors')),
                    S.listItem()
                      .title('Tags')
                      .child(S.documentTypeList('tag').title('Tags')),
                  ]),
              ),

            S.divider(),

            /* ─────── Footer & global site settings (singleton) ─────── */
            S.listItem()
              .title('Footer & site settings')
              .id('siteSettings')
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
