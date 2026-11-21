'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Project } from '@/payload-types'

type Slide = NonNullable<Project['slides']>[number]
function textOf(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  const row = value as { text?: unknown; children?: unknown[]; root?: unknown }
  if (typeof row.text === 'string') return row.text
  if (Array.isArray(row.children)) return row.children.map(textOf).filter(Boolean).join(' ')
  return row.root ? textOf(row.root) : ''
}

export function ProjectStory({ project, slides, initialSlide = 0 }: { project: Project; slides: Slide[]; initialSlide?: number }) {
  const router = useRouter()
  const [index, setIndex] = useState(initialSlide)
  const [pageMode, setPageMode] = useState(false)
  const go = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(slides.length - 1, next))
    setIndex(bounded)
    const url = new URL(window.location.href)
    const block = slides[bounded]?.blockType.replace('slide-', '')
    url.searchParams.set('slide', block || String(bounded + 1))
    window.history.replaceState({}, '', url)
  }, [slides])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') router.push('/#work')
      if (pageMode || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); go(index + 1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index, pageMode, router])

  function renderSlide(slide: Slide, i: number) {
    const heading = slide.heading || project.title
    return <article className={`story-slide ${slide.blockType === 'slide-cover' ? 'story-cover' : ''}`} key={`${slide.id || slide.blockType}-${i}`} aria-current={i === index ? 'step' : undefined}>
      <span className="mono-label">{String(i + 1).padStart(2, '0')} / {slide.blockType.replace('slide-', '').replaceAll('-', ' ')}</span><h2>{heading}</h2>
      {slide.blockType === 'slide-cover' && <p className="story-lede">{slide.pitch}</p>}
      {slide.blockType === 'slide-problem' && <><p className="story-statement">{slide.boldStatement}</p><p className="story-body">{textOf(slide.supportingText)}</p></>}
      {slide.blockType === 'slide-built' && <><p className="story-lede">{slide.intro}</p>{slide.callouts?.length ? <div className="story-callouts">{slide.callouts.map((c, j) => <div className="story-callout" key={`${c.title}-${j}`}><span className="mono-label">FEATURE / 0{j + 1}</span><h3>{c.title}</h3><p>{c.description}</p></div>)}</div> : null}</>}
      {slide.blockType === 'slide-architecture' && slide.diagram?.nodes?.length ? <div className="architecture-view"><div className="architecture-nodes">{slide.diagram.nodes.map((node, j) => <div className="architecture-node" key={`${node.id}-${j}`}><span className="mono-label">{node.tier}</span><strong>{node.label}</strong></div>)}</div><ol className="architecture-edges">{slide.diagram.edges?.map((edge, j) => <li key={`${edge.from}-${edge.to}-${j}`}>{edge.from} <span aria-hidden="true">→</span> {edge.to}{edge.label ? ` · ${edge.label}` : ''}</li>)}</ol></div> : null}
      {slide.blockType === 'slide-stack-role' && <div className="story-facts">{project.role && <p><span className="mono-label">ROLE</span>{project.role}</p>}{project.teamSize && <p><span className="mono-label">TEAM</span>{project.teamSize}</p>}{project.dateRange && <p><span className="mono-label">TIMELINE</span>{project.dateRange}</p>}{slide.notes && <p>{slide.notes}</p>}</div>}
      {slide.blockType === 'slide-results' && <>{project.metrics?.length ? <div className="story-metrics">{project.metrics.map((m, j) => <div className="story-metric" key={`${m.label}-${j}`}><strong>{m.value}{m.suffix}</strong><span>{m.label}</span>{m.caption && <small>{m.caption}</small>}</div>)}</div> : <p className="story-body">No outcome metrics have been published for this project.</p>}{slide.note && <p className="story-body">{slide.note}</p>}</>}
      {slide.blockType === 'slide-decisions' && <div className="story-callouts">{slide.decisions?.map((d, j) => <div className="story-callout" key={`${d.chose}-${j}`}><span className="mono-label">DECISION / 0{j + 1}</span><h3>{d.chose}</h3><p className="text-muted">Instead of {d.over}</p><p>{d.because}</p></div>)}</div>}
      {slide.blockType === 'slide-lessons' && <div className="story-callouts">{slide.lessons?.map((lesson, j) => <div className="story-callout" key={`${lesson.whatWentWrong}-${j}`}><h3>{lesson.whatWentWrong}</h3><p>{lesson.whatIdChange}</p></div>)}</div>}
      {slide.blockType === 'slide-links' && <div className="story-links">{([['Live demo', project.links?.live], ['Source code', project.links?.repo], ['Paper', project.links?.paper], ['Video', project.links?.video]] as const).filter(([, url]) => typeof url === 'string' && /^https?:\/\//.test(url)).map(([label, url]) => <a className="button button-outline" href={url!} target="_blank" rel="noreferrer" key={label}>{label} ↗</a>)}</div>}
    </article>
  }

  if (pageMode) return <div className="container-page section-space project-page-mode"><Link className="mono-label" href="/#work">← All work</Link><header className="project-page-header"><p className="eyebrow">{project.category}</p><h1 className="display-section">{project.title}</h1><p className="section-lede">{project.tagline}</p></header>{slides.map(renderSlide)}<button type="button" className="button button-outline" onClick={() => setPageMode(false)}>Return to slideshow</button></div>
  return <section className="story-shell" aria-label={`${project.title} project slideshow`}><header className="story-topbar"><Link href="/#work" className="mono-label">← All work</Link><span className="mono-label">{project.category}</span><button className="story-mode-toggle" type="button" onClick={() => setPageMode(true)}>Read as a page</button></header><div className="story-progress" aria-hidden="true"><span style={{ width: `${((index + 1) / Math.max(slides.length, 1)) * 100}%` }} /></div><main className="story-canvas" aria-live="polite" aria-atomic="true"><div key={index} className="story-content">{slides[index] ? renderSlide(slides[index]!, index) : <h1>{project.title}</h1>}</div></main><footer className="story-controls"><span className="mono-label story-project-name">{project.title}</span><div className="story-dots" role="group" aria-label="Choose slide">{slides.map((slide, i) => <button type="button" key={`${slide.id || slide.blockType}-${i}`} aria-label={`Go to slide ${i + 1}: ${slide.heading || slide.blockType}`} aria-current={i === index ? 'step' : undefined} className={i === index ? 'is-active' : ''} onClick={() => go(i)} />)}</div><div className="story-next"><span className="mono-label">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><button className="button button-outline" type="button" onClick={() => go(index - 1)} disabled={index === 0}>← Prev</button><button className="button button-primary" type="button" onClick={() => go(index + 1)} disabled={index >= slides.length - 1}>Next →</button></div></footer></section>
}

