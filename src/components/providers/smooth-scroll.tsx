'use client'

import { useEffect } from 'react'

/**
 * Lenis smooth scroll synced to GSAP ScrollTrigger.
 * Lazy-loaded so neither library touches the initial bundle.
 * Disabled automatically for reduced-motion, data-saver, slow connections
 * and the admin's "Off"/"Reduced" intensity setting.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement
    const motionAttr = root.getAttribute('data-motion') ?? 'full'
    if (motionAttr === 'off' || motionAttr === 'reduced') return

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string }
      }
    ).connection
    const lowEnd =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (conn && (('saveData' in conn && conn.saveData) || /(^|\b)(slow-2g|2g)\b/.test(conn.effectiveType ?? '')))

    if (lowEnd) return

    let destroyed = false
    let cleanup = () => {}

    void (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (destroyed) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        // Touch stays native — momentum already feels right on phones.
        syncTouch: false,
      })

      lenis.on('scroll', ScrollTrigger.update)

      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      // Expose for route transitions & anchor scrolling
      window.__lenis = lenis

      cleanup = () => {
        gsap.ticker.remove(raf)
        lenis.destroy()
        window.__lenis = undefined
      }
    })()

    return () => {
      destroyed = true
      cleanup()
    }
  }, [])

  return null
}
