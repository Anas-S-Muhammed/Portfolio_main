'use client'

import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/components/providers/theme-provider'

/** Light/dark toggle — icon swap with a soft rotate. */
export function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-border-strong hover:bg-surface"
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun
          aria-hidden
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          size={18}
          strokeWidth={1.75}
        />
        <Moon
          aria-hidden
          className={`absolute inset-0 transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
          size={18}
          strokeWidth={1.75}
        />
      </span>
    </button>
  )
}
