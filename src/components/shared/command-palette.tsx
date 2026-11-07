'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useTheme } from '@/components/providers/theme-provider'

type Item = { label: string; href: string; type: string }
const sections: Item[] = [
  { label: 'Home', href: '/#top', type: 'Page' },
  { label: 'About', href: '/#about', type: 'Section' },
  { label: 'Projects', href: '/projects', type: 'Page' },
  { label: 'Skills', href: '/#skills', type: 'Section' },
  { label: 'Experience', href: '/#experience', type: 'Section' },
  { label: 'Writing', href: '/writing', type: 'Page' },
  { label: 'Contact', href: '/contact', type: 'Page' },
  { label: 'Print CV', href: '/cv', type: 'Action' },
  { label: 'Ask the assistant', href: '/chat', type: 'Action' },
]

export function CommandPalette({ items = [] }: { items?: Item[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toggle } = useTheme()
  const allItems = useMemo(() => [...sections, ...items, { label: 'Toggle color theme', href: 'theme:toggle', type: 'Action' }], [items])
  const matches = allItems.filter((item) => `${item.label} ${item.type}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12)

  useEffect(() => {
    const openPalette = () => { setQuery(''); setActive(0); setOpen(true) }
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable)
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette() }
      else if (event.key === '/' && !editing) { event.preventDefault(); openPalette() }
      else if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('portfolio:open-palette', openPalette)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('portfolio:open-palette', openPalette) }
  }, [])

  useEffect(() => { if (open) input.current?.focus() }, [open])
  function select(item: Item) {
    setOpen(false)
    if (item.href === 'theme:toggle') { toggle(); return }
    router.push(item.href)
  }

  if (!open) return null
  return <div className="palette-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
    <section className="palette-dialog" role="dialog" aria-modal="true" aria-labelledby="palette-title" onKeyDown={(event) => {
      if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(matches.length - 1, value + 1)) }
      if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(0, value - 1)) }
      if (event.key === 'Enter' && matches[active]) { event.preventDefault(); select(matches[active]!) }
      if (event.key === 'Tab') { event.preventDefault(); input.current?.focus() }
    }}>
      <h2 id="palette-title" className="sr-only">Command palette</h2>
      <label className="palette-search"><span aria-hidden="true">⌕</span><input ref={input} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0) }} placeholder="Search pages, projects, writing…" aria-label="Search the portfolio" /></label>
      <p className="mono-label palette-hint">Navigate with ↑ ↓ · Enter to open · Esc to close</p>
      <div className="palette-results" role="listbox" aria-label="Search results">
        {matches.map((item, index) => <button type="button" role="option" aria-selected={index === active} className={index === active ? 'is-active' : ''} key={`${item.href}-${item.label}`} onMouseEnter={() => setActive(index)} onClick={() => select(item)}><span>{item.label}</span><small>{item.type}</small></button>)}
        {!matches.length && <p className="empty-note">No matching pages or content.</p>}
      </div>
      <p className="palette-footer mono-label">PORTFOLIO INDEX · CTRL K</p>
    </section>
  </div>
}
