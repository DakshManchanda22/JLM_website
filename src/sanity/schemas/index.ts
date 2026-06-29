import type { SchemaTypeDefinition } from 'sanity'

import author from './author'
import bigen from './bigen'
import blockContent from './blockContent'
import emoform from './emoform'
import homepage from './homepage'
import leader from './leader'
import lifeAtJlm from './lifeAtJlm'
import ourStory from './ourStory'
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
  ourStory,
  bigen,
  emoform,
]
