'use client'

import { useEffect, useState } from 'react'

export function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (roles.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), 2800)
    return () => window.clearInterval(timer)
  }, [roles.length])
  if (!roles.length) return null
  return <p className="role-rotator mono-label" aria-live="polite"><span>FOCUSED ON</span> <strong key={index}>{roles[index]}</strong></p>
}
