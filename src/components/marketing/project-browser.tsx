'use client'

import { useMemo, useState } from 'react'

import type { Project } from '@/payload-types'

const categories = [
  ['all', 'All'],
  ['data-engineering', 'Data engineering'],
  ['data-analytics', 'Data analytics'],
  ['ml-research', 'ML & research'],
  ['full-stack', 'Full-stack'],
] as const

export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<string>('all')
  const [query, setQuery] = useState('')
  const results = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === 'all' || project.category === category) &&
          `${project.title} ${project.tagline} ${project.category}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [projects, category, query],
  )

  return (
    <div className="project-browser">
      <label className="project-search">
        Search projects
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try ‘pipeline’ or ‘research’"
        />
      </label>
      <div className="project-filters" role="group" aria-label="Filter projects">
        {categories.map(([value, label]) => (
          <button
            className={category === value ? 'is-active' : ''}
            type="button"
            key={value}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mono-label" aria-live="polite">
        {results.length} {results.length === 1 ? 'project' : 'projects'}
      </p>
      {results.length ? (
        <div className="project-grid">
          {results.map((project, i) => (
            <a className="project-card" href={`/projects/${project.slug}`} key={project.id}>
              <div className="project-art">
                <span className="mono-label">
                  {String(i + 1).padStart(2, '0')} / {project.category}
                </span>
                <span className="project-art-mark">{project.title.slice(0, 1)}</span>
              </div>
              <div className="project-card-copy">
                <h2>{project.title}</h2>
                <p>{project.tagline}</p>
                <span className="project-link">Open case study ↗</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="empty-note">No projects match that search. Try another term or clear the filter.</p>
      )}
    </div>
  )
}
