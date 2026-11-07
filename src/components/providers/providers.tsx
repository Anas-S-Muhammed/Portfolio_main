'use client'

import { MotionConfig } from 'motion/react'

import { ThemeProvider } from '@/components/providers/theme-provider'

export function Providers({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
}) {
  return (
    <ThemeProvider defaultMode={defaultTheme}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  )
}
