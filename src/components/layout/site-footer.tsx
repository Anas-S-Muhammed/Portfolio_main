import Link from 'next/link'
import { ArrowUp } from 'lucide-react'

export function SiteFooter() {
  return <footer className="border-t border-border"><div className="container-page flex flex-col gap-8 py-12">
    <div className="flex flex-wrap items-start justify-between gap-8"><div><Link href="/#top" className="font-display text-lg font-bold tracking-tight">AM<span className="text-accent">·</span></Link><p className="mono-label mt-2 text-muted">Alor Setar · Malaysia</p></div>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2"><Link className="mono-label text-muted hover:text-ink" href="/#work">Projects</Link><Link className="mono-label text-muted hover:text-ink" href="/#skills">Skills</Link><Link className="mono-label text-muted hover:text-ink" href="/#experience">Experience</Link><Link className="mono-label text-muted hover:text-ink" href="/writing">Writing</Link><Link className="mono-label text-muted hover:text-ink" href="/cv">CV</Link><Link className="mono-label text-muted hover:text-ink" href="/colophon">Colophon</Link></nav>
      <a href="#top" className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[3px_3px_0_var(--border-strong)]" aria-label="Back to top"><ArrowUp size={18} strokeWidth={1.75} aria-hidden /></a></div>
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"><p className="mono-label text-muted">© 2026 Anas Muhammed</p><p className="mono-label text-muted">Built with Next.js · Payload · GSAP — <Link href="/colophon" className="text-accent hover:underline">how</Link></p></div>
  </div></footer>
}
