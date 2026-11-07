import type {
  Award,
  BeyondItem,
  Certification,
  Experience,
  Post,
  Project,
  Skill,
  SkillCategory,
} from '@/payload-types'
import type { Where } from 'payload'

import { getPayloadClient } from '@/lib/payload'

/**
 * Public content access. All reads run through Payload's Local API with
 * access control enabled, so only published documents ever reach the site.
 * Caching wrappers are added in the performance pass.
 */

export type ProjectsQuery = {
  featuredOnly?: boolean
  category?: Project['category']
  limit?: number
}

export async function getProjects(query: ProjectsQuery = {}): Promise<Project[]> {
  const payload = await getPayloadClient()
  const { featuredOnly, category, limit } = query

  const where: Where = {}
  if (featuredOnly) where.featured = { equals: true }
  if (category) where.category = { equals: category }

  const result = await payload.find({
    collection: 'projects',
    depth: 2, // populate cover images + skill relations
    where: Object.keys(where).length ? where : undefined,
    sort: ['featuredOrder', 'order'],
    limit: limit ?? 0,
  })
  return result.docs as unknown as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    depth: 2,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return (result.docs[0] as unknown as Project) ?? null
}

export async function getSkillsGrouped(): Promise<
  { category: SkillCategory; skills: Skill[] }[]
> {
  const payload = await getPayloadClient()

  const [categories, skills] = await Promise.all([
    payload.find({ collection: 'skill-categories', sort: 'order', depth: 0, limit: 0 }),
    payload.find({ collection: 'skills', sort: 'order', depth: 1, limit: 0 }),
  ])

  return (categories.docs as unknown as SkillCategory[]).map((category) => ({
    category,
    skills: (skills.docs as unknown as Skill[]).filter(
      (s) =>
        (typeof s.category === 'object' ? s.category?.id : s.category) === category.id,
    ),
  }))
}

export async function getCertifications(): Promise<Certification[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'certifications',
    sort: 'order',
    depth: 1,
    limit: 0,
  })
  return result.docs as unknown as Certification[]
}

export async function getExperiences(): Promise<Experience[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'experiences',
    sort: 'order',
    depth: 0,
    limit: 0,
  })
  return result.docs as unknown as Experience[]
}

export async function getAwards(): Promise<Award[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'awards', sort: 'order', depth: 0, limit: 0 })
  return result.docs as unknown as Award[]
}

export async function getBeyondItems(): Promise<BeyondItem[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'beyond-items',
    sort: 'order',
    depth: 1,
    limit: 0,
  })
  return result.docs as unknown as BeyondItem[]
}

export async function getPosts(limit = 10): Promise<Post[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    depth: 1,
    limit,
  })
  return result.docs as unknown as Post[]
}
