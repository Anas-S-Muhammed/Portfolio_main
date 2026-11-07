import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProjectStory } from '@/components/marketing/project-story'
import { getProjectBySlug } from '@/lib/content'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  return project ? { title: project.seoTitle || project.title, description: project.seoDescription || project.tagline } : {}
}

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ slide?: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()
  const [{ slide }, slides] = await Promise.all([searchParams, Promise.resolve(project.slides || [])])
  const byName = slide ? slides.findIndex((item) => item.blockType === `slide-${slide}` || item.heading?.toLowerCase().replaceAll(' ', '-') === slide) : -1
  const numericSlide = Number(slide || 1) - 1
  const initialSlide = byName >= 0 ? byName : Math.max(0, Math.min(slides.length - 1, Number.isFinite(numericSlide) ? numericSlide : 0))
  return slides.length ? <ProjectStory project={project} slides={slides} initialSlide={initialSlide} /> : <div className="container-page section-space"><Link className="mono-label" href="/#work">← All work</Link><h1 className="display-section mt-8">{project.title}</h1><p className="section-lede">{project.tagline}</p></div>
}

