'use client'

import { useRef, useState } from 'react'

type Item = { src: string; alt: string; caption?: string | null }

export function MediaGallery({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const current = items[index]
  if (!current) return null

  function go(next: number) {
    setIndex(Math.max(0, Math.min(items.length - 1, next)))
  }

  return (
    <figure
      className="media-gallery"
      onPointerDown={(event) => {
        start.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={(event) => {
        if (!start.current) return
        const dx = event.clientX - start.current.x
        const dy = event.clientY - start.current.y
        start.current = null
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
        go(index + (dx < 0 ? 1 : -1))
      }}
    >
      <img src={current.src} alt={current.alt} />
      <figcaption>
        <span>{current.caption || 'Project visual'}</span>
        {items.length > 1 ? (
          <span className="media-gallery-controls">
            <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous image">
              ←
            </button>
            <span className="mono-label">
              {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => go(index + 1)} disabled={index === items.length - 1} aria-label="Next image">
              →
            </button>
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
