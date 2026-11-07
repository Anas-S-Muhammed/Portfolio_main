import Link from 'next/link'
import { ProjectBrowser } from '@/components/marketing/project-browser'
import { getProjects } from '@/lib/content'

export const metadata = { title: 'Projects', description: 'Selected data engineering, analytics and research projects by Anas Muhammed.' }

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <section className="container-page section-space"><Link href="/#top" className="mono-label">← Home</Link><p className="eyebrow mt-10">Selected work</p><h1 className="display-section">Projects built to answer real questions.</h1><p className="section-lede mt-5">Each case study shares the problem, decisions and learning behind the result.</p>{projects.length ? <ProjectBrowser projects={projects} /> : <p className="empty-note">Project write-ups are being prepared.</p>}</section>
}
