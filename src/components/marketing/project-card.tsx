import type { Project, Skill } from '@/payload-types'

import { mediaSrc } from '@/lib/media'

const labels: Record<string, string> = {
  'data-engineering': 'Data engineering',
  'data-analytics': 'Data analytics',
  'ml-research': 'ML & research',
  'full-stack': 'Full-stack',
}

export function categoryLabel(category: string) {
  return labels[category] || category
}

export function ProjectCard({
  project,
  kicker,
  featured = false,
}: {
  project: Project
  kicker: string
  featured?: boolean
}) {
  const cover = mediaSrc(project.coverImage, featured ? 'tablet' : 'card')
  const alt = typeof project.coverImage === 'object' && project.coverImage?.alt ? project.coverImage.alt : ''
  const stack = (project.stack || []).filter((skill): skill is Skill => typeof skill === 'object').slice(0, 4)

  return (
    <a className={`project-card ${featured ? 'project-card-featured' : ''}`} href={`/projects/${project.slug}`}>
      <div className="project-art">
        <span className="mono-label">{kicker}</span>
        {cover ? (
          <img
            src={cover}
            alt={alt}
            style={{ viewTransitionName: `project-${project.slug}` }}
          />
        ) : (
          <span className="project-art-mark">{project.title.slice(0, 1)}</span>
        )}
      </div>
      <div className="project-card-copy">
        <span className="mono-label">
          {categoryLabel(project.category)}
          {project.statusBadge ? ` · ${project.statusBadge}` : ''}
        </span>
        <h3>{project.title}</h3>
        <p>{project.tagline}</p>
        {stack.length ? (
          <div className="chip-row">
            {stack.map((skill) => (
              <span className="chip" key={skill.id}>
                {skill.name}
              </span>
            ))}
          </div>
        ) : null}
        <span className="project-link">Open case study ↗</span>
      </div>
    </a>
  )
}
