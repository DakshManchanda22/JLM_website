import type { SchemaTypeDefinition } from 'sanity'

import author from './author'
import babyDreams from './babyDreams'
import bigen from './bigen'
import blockContent from './blockContent'
import careers from './careers'
import contactUs from './contactUs'
import emoform from './emoform'
import esg from './esg'
import homepage from './homepage'
import leader from './leader'
import lifeAtJlm from './lifeAtJlm'
import ourStory from './ourStory'
import philanthropy from './philanthropy'
import post from './post'
import siteSettings from './siteSettings'
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
  babyDreams,
  bigen,
  emoform,
  philanthropy,
  esg,
  careers,
  contactUs,
  siteSettings,
]
