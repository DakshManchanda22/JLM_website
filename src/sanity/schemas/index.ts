import type { SchemaTypeDefinition } from 'sanity'

import author from './author'
import blockContent from './blockContent'
import homepage from './homepage'
import leader from './leader'
import lifeAtJlm from './lifeAtJlm'
import post from './post'
import tag from './tag'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  tag,
  blockContent,
  homepage,
  leader,
  lifeAtJlm,
]
