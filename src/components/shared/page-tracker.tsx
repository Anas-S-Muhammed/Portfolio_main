'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PageTracker() {
  const pathname = usePathname()
  useEffect(() => {
    let sessionId = sessionStorage.getItem('portfolio-analytics-session')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      sessionStorage.setItem('portfolio-analytics-session', sessionId)
    }
    const body = JSON.stringify({ type: 'pageview', path: pathname, sessionId, referrer: document.referrer })
    const blob = new Blob([body], { type: 'application/json' })
    if (!navigator.sendBeacon('/api/track', blob)) {
      void fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true })
    }
  }, [pathname])
  return null
}
