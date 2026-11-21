import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * Skill categories — Languages, Data & Analytics, Data Engineering,
 * ML & AI, Tools, and anything else the owner adds. The order here
 * controls the tab order of the skills grid.
 */
export const SkillCategories: CollectionConfig = {
  slug: 'skill-categories',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
  },
  access: {
    read: publishedOrAuthenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Stable key used by code, e.g. "languages"',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
