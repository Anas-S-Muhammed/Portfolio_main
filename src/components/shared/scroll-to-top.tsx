'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      className="fixed right-4 bottom-4 z-40 min-h-11 min-w-11 rounded-full border border-border bg-bg/80 backdrop-blur-md flex items-center justify-center text-ink hover:bg-accent hover:text-accent-foreground transition-all"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronUp size={18} />
    </button>
  )
}
