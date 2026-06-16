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
                      .child(
                        S.documentTypeList('leader')
                          .title('Leadership Team')
                          .defaultOrdering([{ field: 'order', direction: 'asc' }]),
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
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
