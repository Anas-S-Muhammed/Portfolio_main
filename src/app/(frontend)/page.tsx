import { getGlobalSettings, getNowEntries, getSectionConfig } from '@/lib/content/settings'
import { getAwards, getBeyondItems, getCertifications, getExperiences, getPosts, getProjects, getSkillsGrouped } from '@/lib/content'
import { RoleRotator } from '@/components/marketing/role-rotator'
import { SkillsPipeline } from '@/components/marketing/skills-pipeline'
import { getGitHubActivity } from '@/lib/github'

const labels: Record<string, string> = {
  'data-engineering': 'Data engineering',
  'data-analytics': 'Data analytics',
  'ml-research': 'ML & research',
  'full-stack': 'Full-stack',
}

export default async function HomePage() {
  const [site, now, sectionConfig, projects, groups, experience, certifications, awards, beyond, posts] = await Promise.all([
    getGlobalSettings(), getNowEntries(), getSectionConfig(), getProjects(), getSkillsGrouped(),
    getExperiences(), getCertifications(), getAwards(), getBeyondItems(), getPosts(3),
  ])
  const name = site?.name || 'Anas Muhammed'
  const [first, ...rest] = name.split(' ')
  const sections = sectionConfig?.sections?.filter((s) => s.visible !== false).map((s) => s.key) ?? []
  const enabled = (key: string) => sections.length === 0 || sections.includes(key as never)
  const orderFor = (key: string) => {
    const index = sectionConfig?.sections?.findIndex((item) => item.key === key) ?? -1
    return index >= 0 ? index : 100
  }
  const headingFor = (key: string, fallback: string) =>
    sectionConfig?.sections?.find((item) => item.key === key)?.title || fallback
  const eyebrowFor = (key: string, fallback: string) =>
    sectionConfig?.sections?.find((item) => item.key === key)?.eyebrow || fallback
  const featured = projects.filter((p) => p.featured).slice(0, 2)
  const visibleProjects = projects.filter((p) => !featured.some((f) => f.id === p.id))
  const stats = site?.stats?.filter((s) => Number.isFinite(s.value)) ?? []
  const github = site?.githubUsername ? await getGitHubActivity(site.githubUsername) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {enabled('hero') && <section id="top" style={{ order: orderFor('hero') }} className="container-page grid min-h-[82svh] items-center gap-10 py-20 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
        <div>
          <p className="eyebrow"><span className="availability-dot" /> {site?.availability?.enabled ? site.availability.label || 'Open to internships' : 'Computer Science · AIU'}</p>
          <h1 className="display-hero mt-6">{first}<br /><span className="text-accent">{rest.join(' ')}</span></h1>
          <RoleRotator roles={site?.roleWords?.filter((role): role is string => Boolean(role)) || []} />
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-muted">{site?.valueStatement || 'I build data pipelines, SQL models and applied machine learning — and make the results easier to trust.'}</p>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{site?.aboutIntro || 'Computer Science student at Albukhary International University, focused on data engineering and analytics.'}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="button button-primary" href="#work">Explore selected work <span aria-hidden="true">↗</span></a>
            <a className="button button-outline" href="/cv">View CV</a>
            <a className="button button-outline" href="#contact">Get in touch</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">{site?.socials?.filter((s) => s.url && /^https?:|^mailto:/.test(s.url)).map((s) => <a className="social-pill" key={s.platform} href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel={s.url.startsWith('http') ? 'noreferrer' : undefined}>{s.label || s.platform} ↗</a>)}</div>
        </div>
        <div className="hero-visual" aria-label="Illustration of a data workflow" role="img">
          <svg viewBox="0 0 520 420" fill="none" aria-hidden="true"><rect x="30" y="32" width="460" height="356" rx="4" className="illustration-paper"/><path d="M82 320h360M112 280h100v-95h95v60h104" className="illustration-line"/><circle cx="112" cy="280" r="10" className="illustration-node"/><circle cx="212" cy="185" r="10" className="illustration-node"/><circle cx="307" cy="245" r="10" className="illustration-node"/><circle cx="411" cy="245" r="10" className="illustration-node"/><rect x="75" y="78" width="128" height="70" rx="3" className="illustration-card"/><path d="M94 99h89M94 116h60M94 132h72" className="illustration-line"/><rect x="300" y="80" width="137" height="94" rx="3" className="illustration-card"/><path d="M320 151v-22l22-14 20 10 30-25 24 16" className="illustration-line"/><path d="M231 332h107l23 28H207l24-28Z" className="illustration-card"/><path d="M246 332V222h77v110M258 244h53M258 260h53M258 276h33" className="illustration-line"/><path d="M278 222v-27" className="illustration-line"/><circle cx="278" cy="186" r="9" className="illustration-node"/></svg>
          <span className="mono-label hero-caption">QUESTION → MODEL → EXPLAIN</span>
        </div>
      </section>}

      {enabled('marquee') && <div style={{ order: orderFor('marquee') }} className="marquee-band" aria-label="Areas of focus"><div className="marquee-track">PYTHON <span>✳</span> SQL <span>✳</span> DATA PIPELINES <span>✳</span> ANALYTICS <span>✳</span> APPLIED ML <span>✳</span> EXPLAINABLE AI <span>✳</span> PYTHON <span>✳</span> SQL <span>✳</span> DATA PIPELINES <span>✳</span> ANALYTICS <span>✳</span> APPLIED ML <span>✳</span></div></div>}

      {enabled('proof') && featured.length > 0 && <section id="proof" style={{ order: orderFor('proof') }} className="container-page section-space section-ink"><p className="eyebrow">{eyebrowFor('proof', 'Proof')}</p><h2 className="display-section">{headingFor('proof', 'Results that hold up.')}</h2><div className="proof-strip">{featured.flatMap((project) => (project.metrics || []).map((m) => <a className="proof-chip" href={`/projects/${project.slug}`} key={`${project.id}-${m.label}`}><strong>{m.value}{m.suffix}</strong><span>{m.label}</span>{m.caption && <small>{m.caption}</small>}</a>))}</div></section>}

      {enabled('about') && <section id="about" style={{ order: orderFor('about') }} className="container-page section-space">
        <p className="eyebrow">{eyebrowFor('about', '01 / A little context')}</p><h2 className="display-section">{headingFor('about', 'Data work should be understandable.')}</h2>
        <div className="about-grid"><p className="section-lede">{site?.aboutIntro || 'I am a Computer Science student at Albukhary International University in Alor Setar, Malaysia. I enjoy the careful work behind useful data: cleaning, modeling, testing and communicating what the numbers can support.'}</p>
          <div className="facts-grid">{[['Based in', site?.facts?.location], ['Studying', site?.facts?.degree], ['University', site?.facts?.university], ['Graduating', site?.facts?.expectedGraduation]].filter(([, value]) => value).map(([label, value]) => <div className="fact-card" key={label}><span className="mono-label">{label}</span><strong>{value}</strong></div>)}</div>
        </div>
        {stats.length > 0 && <div className="stats-grid">{stats.map((stat, i) => <article className={`stat-card ${stat.inverted ? 'stat-card-inverted' : ''}`} key={`${stat.label}-${i}`}><strong>{stat.value}{stat.suffix}</strong><span>{stat.label}</span>{stat.caption && <small>{stat.caption}</small>}</article>)}</div>}
        {now?.entries?.length ? <aside className="now-panel"><span className="eyebrow">Now / {new Date().toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span><div className="now-list">{now.entries.map((entry, i) => <p key={`${entry.kind}-${i}`}><span className="mono-label">{entry.kind}</span>{entry.text}</p>)}</div></aside> : null}
      </section>}

      {enabled('featured') && featured.length > 0 && <section id="featured" style={{ order: orderFor('featured') }} className="section-space section-ink"><div className="container-page"><p className="eyebrow">{eyebrowFor('featured', '02 / Selected work')}</p><h2 className="display-section">{headingFor('featured', 'Built with a reason.')}</h2><div className="project-grid">{featured.map((project, i) => <a className="project-card project-card-featured" href={`/projects/${project.slug}`} key={project.id}><div className="project-art"><span className="mono-label">FEATURED / 0{i + 1}</span><span className="project-art-mark">{project.title.slice(0, 1)}</span></div><div className="project-card-copy"><span className="mono-label">{labels[project.category] || project.category}{project.statusBadge ? ` · ${project.statusBadge}` : ''}</span><h3>{project.title}</h3><p>{project.tagline}</p><span className="project-link">Open case study ↗</span></div></a>)}</div></div></section>}

      {enabled('projects') && <section id="work" style={{ order: orderFor('projects') }} className="container-page section-space"><p className="eyebrow">{eyebrowFor('projects', '03 / The rest of the work')}</p><h2 className="display-section">{headingFor('projects', 'Questions turned into systems.')}</h2>{visibleProjects.length ? <div className="project-grid">{visibleProjects.map((project, i) => <a className="project-card" href={`/projects/${project.slug}`} key={project.id}><div className="project-art"><span className="mono-label">{String(i + 1).padStart(2, '0')} / {labels[project.category] || project.category}</span><span className="project-art-mark">{project.title.slice(0, 1)}</span></div><div className="project-card-copy"><h3>{project.title}</h3><p>{project.tagline}</p><div className="chip-row">{project.stack?.slice(0, 4).map((skill, j) => <span className="chip" key={typeof skill === 'object' ? skill.id : j}>{typeof skill === 'object' ? skill.name : ''}</span>)}</div><span className="project-link">Explore project ↗</span></div></a>)}</div> : <p className="empty-note">Project write-ups are being prepared. Check back soon.</p>}</section>}

      {enabled('skills') && groups.length > 0 && <section id="skills" style={{ order: orderFor('skills') }} className="section-space section-paper"><div className="container-page"><p className="eyebrow">{eyebrowFor('skills', '04 / Tools I reach for')}</p><h2 className="display-section">{headingFor('skills', 'A practical toolkit.')}</h2><SkillsPipeline groups={groups} /></div></section>}

      {enabled('experience') && experience.length > 0 && <section id="experience" style={{ order: orderFor('experience') }} className="container-page section-space"><p className="eyebrow">{eyebrowFor('experience', '05 / Experience & leadership')}</p><h2 className="display-section">{headingFor('experience', 'Learning by showing up.')}</h2><div className="timeline">{experience.map((item) => <article className="timeline-item" key={item.id}><span className="timeline-dot"/><div><p className="mono-label">{item.type} · {item.startDate}{item.endDate ? ` — ${item.endDate}` : ' — Present'}</p><h3>{item.role}</h3><p className="text-muted">{item.organization}</p>{item.summary && <p>{item.summary}</p>}</div></article>)}</div></section>}

      {enabled('research') && projects.filter((p) => p.category === 'ml-research').length > 0 && <section id="research" style={{ order: orderFor('research') }} className="container-page section-space section-paper"><p className="eyebrow">{eyebrowFor('research', '06 / Research')}</p><h2 className="display-section">{headingFor('research', 'Careful questions, reproducible answers.')}</h2><div className="research-list">{projects.filter((p) => p.category === 'ml-research').map((p) => <a href={`/projects/${p.slug}`} className="research-row" key={p.id}><span className="mono-label">RESEARCH</span><span><strong>{p.title}</strong><small>{p.tagline}</small></span><span aria-hidden="true">↗</span></a>)}</div></section>}

      {enabled('certifications') && certifications.length > 0 && <section id="certifications" style={{ order: orderFor('certifications') }} className="container-page section-space"><p className="eyebrow">{eyebrowFor('certifications', '07 / Learning in public')}</p><h2 className="display-section">{headingFor('certifications', 'Certifications.')}</h2><div className="credential-grid">{certifications.map((c) => <details className="credential-card" key={c.id}><summary><span className="mono-label">{c.issuer}</span><h3>{c.title}</h3></summary>{c.description && <p>{c.description}</p>}{c.credentialUrl ? <a href={c.credentialUrl} target="_blank" rel="noreferrer">Verify credential ↗</a> : null}</details>)}</div></section>}

      {enabled('awards') && awards.length > 0 && <section id="awards" style={{ order: orderFor('awards') }} className="container-page section-space section-ink"><p className="eyebrow">{eyebrowFor('awards', '08 / Recognition')}</p><h2 className="display-section">{headingFor('awards', 'Milestones.')}</h2><div className="award-list">{awards.map((a, i) => <article className="award-row" key={a.id}><span className="award-index">{String(i + 1).padStart(2, '0')}</span><div><h3>{a.title}</h3><p>{[a.event, a.category, a.year].filter(Boolean).join(' · ')}</p></div><span aria-hidden="true">↗</span></article>)}</div></section>}

      {enabled('beyond') && beyond.length > 0 && <section id="beyond" style={{ order: orderFor('beyond') }} className="container-page section-space"><p className="eyebrow">{eyebrowFor('beyond', '09 / Beyond the code')}</p><h2 className="display-section">{headingFor('beyond', 'People are part of the work.')}</h2><div className="beyond-grid">{beyond.map((item) => <article className="beyond-card" key={item.id}><span className="mono-label">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>}

      {enabled('process') && <section id="process" style={{ order: orderFor('process') }} className="container-page section-space section-paper"><p className="eyebrow">{eyebrowFor('process', '10 / How I work')}</p><h2 className="display-section">{headingFor('process', 'Make the answer useful.')}</h2><div className="process-grid">{['Understand the question', 'Model the data', 'Build the pipeline', 'Validate the result', 'Explain and improve'].map((step, i) => <article className="process-step" key={step}><span className="mono-label">0{i + 1}</span><h3>{step}</h3></article>)}</div></section>}

      {enabled('ninety') && site?.internshipPlan && <section id="ninety" style={{ order: orderFor('ninety') }} className="container-page section-space section-ink"><p className="eyebrow">{eyebrowFor('ninety', 'First 90 days')}</p><h2 className="display-section">{headingFor('ninety', 'The first 90 days.')}</h2><div className="ninety-grid"><article className="ninety-card"><span className="mono-label">Week one</span><h3>Learn the warehouse</h3><p>{site.internshipPlan.weekOne}</p></article><article className="ninety-card"><span className="mono-label">By day 30</span><h3>Ship one reviewed change</h3><p>{site.internshipPlan.day30}</p></article><article className="ninety-card"><span className="mono-label">What I want reviewed</span><h3>Show the work</h3><p>{site.internshipPlan.review}</p></article></div></section>}

      {enabled('writing') && <section id="writing" style={{ order: orderFor('writing') }} className="container-page section-space"><p className="eyebrow">{eyebrowFor('writing', '11 / Notes')}</p><h2 className="display-section">{headingFor('writing', 'Writing, as it takes shape.')}</h2>{posts.length ? <div className="writing-list">{posts.map((post) => <a className="writing-row" href={`/writing/${post.slug}`} key={post.id}><span className="mono-label">{post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'NOTE'}</span><span><strong>{post.title}</strong><small>{post.excerpt}</small></span><span>↗</span></a>)}</div> : <p className="empty-note">Articles will appear here when published.</p>}</section>}

      {enabled('github') && site?.githubUsername && github && <section id="github" style={{ order: orderFor('github') }} className="container-page section-space section-paper"><p className="eyebrow">{eyebrowFor('github', 'GitHub activity')}</p><h2 className="display-section">A year of steady work.</h2>{github.days.length ? <div className="github-heatmap" aria-label={`Contribution activity for ${site.githubUsername}`}>{github.days.map((day) => <span key={day.date} title={`${day.date}: ${day.count} contributions`} aria-label={`${day.date}: ${day.count} contributions`} style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(day.color) ? day.color : '#e5e7eb' }} />)}</div> : <p className="empty-note">The contribution grid is available after a GitHub token is configured.</p>}{github.events.length ? <ul className="github-events">{github.events.map((event) => <li key={`${event.repo}-${event.date}`}><a href={event.url} target="_blank" rel="noreferrer">{event.repo} ↗</a><span>{event.type}</span><time dateTime={event.date}>{event.date ? new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : ''}</time></li>)}</ul> : <p className="empty-note">No recent public activity was returned.</p>}<a className="button button-outline mt-5" href={`https://github.com/${encodeURIComponent(site.githubUsername)}`} target="_blank" rel="noreferrer">View GitHub profile ↗</a></section>}

      {enabled('contact') && <section id="contact" style={{ order: orderFor('contact') }} className="container-page section-space contact-section"><p className="eyebrow">{eyebrowFor('contact', '12 / Contact')}</p><h2 className="display-section">{headingFor('contact', 'Have a data question or an opportunity?')}</h2><p className="section-lede">I’m open to conversations about Data Engineering and Data Analyst internships.</p><a className="button button-primary" href="/contact">Start a conversation ↗</a></section>}
    </div>
  )
}

