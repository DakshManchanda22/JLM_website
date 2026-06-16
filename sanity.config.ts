import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemas'

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
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
