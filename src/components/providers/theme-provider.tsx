'use client'

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from 'react'

type Mode = 'light' | 'dark' | 'system'
type ThemeContextValue = {
  mode: Mode
  resolved: 'light' | 'dark'
  setMode: (mode: Mode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'system', resolved: 'light', setMode: () => {}, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)
const EVENT = 'portfolio-theme-change'

function getStoredMode(): Mode {
  const value = localStorage.getItem('theme')
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system'
}
function subscribeMode(callback: () => void) {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback)
  return () => { window.removeEventListener(EVENT, callback); window.removeEventListener('storage', callback) }
}
function subscribePreference(callback: () => void) {
  const preference = window.matchMedia('(prefers-color-scheme: dark)')
  preference.addEventListener('change', callback)
  return () => preference.removeEventListener('change', callback)
}
function getSystemDark() { return window.matchMedia('(prefers-color-scheme: dark)').matches }
function apply(mode: Mode, systemDark: boolean): 'light' | 'dark' {
  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
  return resolved
}

export function ThemeProvider({ children, defaultMode = 'system' }: { children: React.ReactNode; defaultMode?: Mode }) {
  const getServerMode = useCallback(() => defaultMode, [defaultMode])
  const mode = useSyncExternalStore(subscribeMode, getStoredMode, getServerMode)
  const systemDark = useSyncExternalStore(subscribePreference, getSystemDark, () => false)
  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  useEffect(() => { apply(mode, systemDark) }, [mode, systemDark])

  const setMode = useCallback((next: Mode) => {
    localStorage.setItem('theme', next)
    window.dispatchEvent(new Event(EVENT))
  }, [])
  const toggle = useCallback(() => setMode(resolved === 'dark' ? 'light' : 'dark'), [resolved, setMode])

  return <ThemeContext.Provider value={{ mode, resolved, setMode, toggle }}>{children}</ThemeContext.Provider>
}
