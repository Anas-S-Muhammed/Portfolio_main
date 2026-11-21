import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const [projects, posts] = await Promise.all([getProjects(), getPosts()])
  return [
    ...['', '/projects', '/writing', '/contact', '/cv', '/colophon'].map((path) => ({ url: `${origin}${path}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: path ? 0.7 : 1 })),
    ...projects.map((project) => ({ url: `${origin}/projects/${project.slug}`, lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(), changeFrequency: 'monthly' as const, priority: project.featured ? 0.9 : 0.7 })),
    ...posts.map((post) => ({ url: `${origin}/writing/${post.slug}`, lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(), changeFrequency: 'yearly' as const, priority: 0.6 })),
  ]
}
