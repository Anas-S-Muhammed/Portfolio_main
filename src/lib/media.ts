import type { Media } from '@/payload-types'

export function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

export function mediaSrc(
  value: number | Media | null | undefined,
  size: 'thumbnail' | 'card' | 'tablet' | 'desktop' = 'card',
): string | null {
  const media = asMedia(value)
  if (!media) return null
  return media.sizes?.[size]?.url || media.url || null
}
