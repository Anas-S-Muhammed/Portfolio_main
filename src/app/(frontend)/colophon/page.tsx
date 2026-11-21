import Link from 'next/link'

export const metadata = { title: 'Colophon', description: 'How this portfolio is designed and built.' }

const layers = [['Experience', 'Next.js App Router · React Server Components'], ['Content', 'Payload CMS 3 · Lexical · drafts and revisions'], ['Data', 'SQLite for local development · Postgres for production'], ['Motion', 'Motion · GSAP · Lenis with reduced-motion support'], ['Principles', 'Accessible by default · no invented metrics · owner-editable content']]

export default function ColophonPage() {
  return <section className="container-page section-space"><Link className="mono-label" href="/#top">← Portfolio</Link><p className="eyebrow mt-10">Under the hood</p><h1 className="display-section">A portfolio that shows its working.</h1><p className="section-lede mt-5">The site is also an engineering project: content has a source of truth, public pages are rendered from it, and the important design decisions are documented here.</p><div className="colophon-stack">{layers.map(([name, detail], i) => <article className="colophon-row" key={name}><span className="mono-label">0{i + 1}</span><h2>{name}</h2><p>{detail}</p></article>)}</div><p className="empty-note">The admin lives at <Link href="/admin">/admin</Link>. Local development uses SQLite; production should use PostgreSQL with pgvector enabled.</p></section>
}

