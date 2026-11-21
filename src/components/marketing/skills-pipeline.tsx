'use client'

import { useState } from 'react'

import type { Project, Skill, SkillCategory } from '@/payload-types'

type Group = { category: SkillCategory; skills: Skill[] }

export function SkillsPipeline({ groups }: { groups: Group[] }) {
  const lanes = groups.filter((group) => group.skills.length)
  const [activeId, setActiveId] = useState<number | null>(lanes[0]?.skills[0]?.id ?? null)
  const active = lanes.flatMap((group) => group.skills).find((skill) => skill.id === activeId) || null
  const proofs = (active?.proofProjects || []).filter((project): project is Project => typeof project === 'object')

  return (
    <div className="pipeline">
      <ol className="pipeline-lanes">
        {lanes.map((group, index) => (
          <li key={group.category.id}>
            <span className="mono-label">0{index + 1}</span>
            <h3>{group.category.title}</h3>
            <div className="pipeline-nodes">
              {group.skills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className={`${skill.exploring ? 'is-exploring' : ''} ${skill.id === activeId ? 'is-active' : ''}`}
                  aria-pressed={skill.id === activeId}
                  onClick={() => setActiveId(skill.id)}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {active ? (
        <aside className="pipeline-detail" aria-live="polite">
          <span className="mono-label">{active.exploring ? 'Exploring' : 'In the toolkit'}</span>
          <h3>{active.name}</h3>
          <p>{active.proficiencyNote || (active.exploring ? 'Still learning this. It is not a tool I would claim in an interview yet.' : 'Used on published project work.')}</p>
          {proofs.length ? (
            <ul>
              {proofs.map((project) => (
                <li key={project.id}>
                  <a href={`/projects/${project.slug}`}>{project.title} ↗</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">Link a proof project in the admin to show where this tool was used.</p>
          )}
        </aside>
      ) : null}
    </div>
  )
}
