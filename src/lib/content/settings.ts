import type {
  AiSetting,
  ContactSetting,
  NowEntry,
  ResumeSetting,
  SectionConfig,
  SiteSetting,
  ThemeSetting,
} from '@/payload-types'

import { getPayloadClient } from '@/lib/payload'

/**
 * Global settings access. Globals are owner-controlled singletons;
 * reads are public, writes happen only through /admin.
 * Defaults cover first-run before the owner has saved anything.
 */

export async function getThemeSettings(): Promise<ThemeSetting> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'theme-settings',
    depth: 0,
  })) as unknown as ThemeSetting
}

export async function getGlobalSettings(): Promise<SiteSetting> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'site-settings',
    depth: 1, // populate the hero photo (if any)
  })) as unknown as SiteSetting
}

export async function getSectionConfig(): Promise<SectionConfig> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'section-config',
    depth: 0,
  })) as unknown as SectionConfig
}

export async function getNowEntries(): Promise<NowEntry> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'now-entries',
    depth: 0,
  })) as unknown as NowEntry
}

export async function getAISettings(): Promise<AiSetting> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'ai-settings',
    depth: 0,
  })) as unknown as AiSetting
}

export async function getContactSettings(): Promise<ContactSetting> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'contact-settings',
    depth: 0,
  })) as unknown as ContactSetting
}

export async function getResumeSettings(): Promise<ResumeSetting> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({
    slug: 'resume-settings',
    depth: 0,
  })) as unknown as ResumeSetting
}
