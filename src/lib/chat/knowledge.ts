import { getAwards, getBeyondItems, getCertifications, getExperiences, getProjects, getSkillsGrouped } from '@/lib/content'
import { getGlobalSettings } from '@/lib/content/settings'

export type KnowledgeSource = { title: string; url: string; content: string; projectId?: number }

export async function retrieveKnowledge(question: string, projectSlug?: string): Promise<KnowledgeSource[]> {
  const [site, projects, groups, experience, certifications, awards, beyond] = await Promise.all([
    getGlobalSettings(), getProjects(), getSkillsGrouped(), getExperiences(), getCertifications(), getAwards(), getBeyondItems(),
  ])
  const sources: KnowledgeSource[] = []
  const profile = [site.name, site.valueStatement, site.aboutIntro, site.facts?.location, site.facts?.university, site.facts?.degree, site.facts?.expectedGraduation, site.facts?.targetRole, site.availability?.enabled ? site.availability.label : ''].filter(Boolean).join('. ')
  if (profile) sources.push({ title: 'About Anas', url: '/#about', content: profile })
  for (const project of projects) {
    if (projectSlug && project.slug !== projectSlug) continue
    const detail = [project.title, project.tagline, project.category, project.role, ...(project.metrics || []).map((m) => `${m.label}: ${m.value}${m.suffix || ''}`), ...(project.slides || []).flatMap((slide) => Object.values(slide).filter((value) => typeof value === 'string'))].filter(Boolean).join('. ')
    sources.push({ title: project.title, url: `/projects/${project.slug}`, content: detail, projectId: typeof project.id === 'number' ? project.id : undefined })
  }
  if (projectSlug) return sources.filter((source) => source.projectId !== undefined).slice(0, 1)
  for (const group of groups) {
    const names = group.skills.map((skill) => skill.name).join(', ')
    if (names) sources.push({ title: group.category.title, url: '/#skills', content: `${group.category.title}: ${names}` })
  }
  for (const row of experience) sources.push({ title: row.role, url: '/#experience', content: [row.role, row.organization, row.type, row.startDate, row.endDate, row.summary, ...(row.bullets || []).map((item) => item.text)].filter(Boolean).join('. ') })
  for (const row of certifications) sources.push({ title: row.title, url: '/#certifications', content: [row.title, row.issuer, row.description, ...(row.skillsCovered || [])].filter(Boolean).join('. ') })
  for (const row of awards) sources.push({ title: row.title, url: '/#awards', content: [row.title, row.event, row.category, row.year, row.description].filter(Boolean).join('. ') })
  for (const row of beyond) sources.push({ title: row.title, url: '/#beyond', content: [row.title, row.type, row.description].filter(Boolean).join('. ') })

  const terms = new Set(question.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 2))
  const ranked = sources.map((source) => ({ source, score: [...terms].reduce((score, term) => score + (source.content.toLowerCase().includes(term) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score)
  const selected = ranked.filter((entry) => entry.score > 0).slice(0, 6).map((entry) => entry.source)
  if (!selected.length) return projectSlug ? sources.filter((source) => source.projectId).slice(0, 1) : sources.slice(0, 1)
  return selected
}
