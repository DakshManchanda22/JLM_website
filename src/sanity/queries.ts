/* eslint-disable @typescript-eslint/no-explicit-any */
import { groq } from 'next-sanity'

import { client } from './client'

export type PostListItem = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage: {
    asset: { _ref: string }
    alt?: string
  }
  publishedAt: string
  readTime?: number
  featured?: boolean
  author: {
    name: string
    avatar?: { asset: { _ref: string }; alt?: string }
  }
  tags?: { title: string; slug: string }[]
}

export type Post = PostListItem & {
  body: any
  author: PostListItem['author'] & {
    bio?: string
    role?: string
    slug?: string
  }
  seoTitle?: string
  seoDescription?: string
  ogImage?: { asset: { _ref: string } }
}

const postProjection = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  readTime,
  featured,
  "author": author->{
    name,
    "slug": slug.current,
    avatar,
    bio,
    role,
  },
  "tags": tags[]->{ title, "slug": slug.current }
`

export const postListQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  ${postProjection}
}`

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  ${postProjection},
  body,
  seoTitle,
  seoDescription,
  ogImage
}`

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`

export async function fetchPosts(): Promise<PostListItem[]> {
  if (!client) return []
  return client.fetch(postListQuery)
}

export async function fetchPost(slug: string): Promise<Post | null> {
  if (!client) return null
  return client.fetch(postBySlugQuery, { slug })
}

export async function fetchPostSlugs(): Promise<string[]> {
  if (!client) return []
  return client.fetch(postSlugsQuery)
}
