'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ThemeToggle } from '@/components/layout/theme-toggle'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/#work', label: 'Work' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#experience', label: 'Experience' },
  { href: '/writing', label: 'Writing' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'border-b border-border bg-bg/80 backdrop-blur-md [backdrop-filter:saturate(1.2)]' : 'border-b border-transparent bg-transparent')}>
    <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-4">
      <Link href="/#top" className="font-display text-lg font-bold tracking-tight" aria-label="Anas Muhammed — home">AM<span className="text-accent">·</span></Link>
      <ul className="hidden items-center gap-6 md:flex">{LINKS.map((link) => <li key={link.href}><Link href={link.href} className="mono-label text-muted transition-colors hover:text-ink">{link.label}</Link></li>)}</ul>
      <div className="flex items-center gap-3"><button type="button" aria-label="Open search palette" title="Search (Ctrl K)" className="mono-label hidden min-h-11 rounded-full border border-border px-3 text-muted hover:border-border-strong hover:text-ink sm:inline-flex sm:items-center" onClick={() => window.dispatchEvent(new Event('portfolio:open-palette'))}>Search <span className="ml-2 opacity-60">⌘K</span></button><Link href="/cv" className="mono-label hidden text-muted transition-colors hover:text-ink sm:block">CV</Link><ThemeToggle /><Link href="/#contact" className="pill pill-ink hidden !min-h-[40px] text-sm md:inline-flex">Let&apos;s talk</Link></div>
    </nav>
  </header>
}
