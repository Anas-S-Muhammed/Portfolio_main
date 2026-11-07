import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * Skills shown in the tile grid. Icons come from Simple Icons by slug
 * (rendered as clean monochrome marks on the site) with an optional
 * uploaded icon as override. "Exploring" skills render with dashed borders.
 */
export const Skills: CollectionConfig = {
  slug: 'skills',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'exploring', 'order'],
  },
  access: {
    read: publishedOrAuthenticated,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  indexes: [{ fields: ['category'] }, { fields: ['order'] }],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'skill-categories',
      required: true,
    },
    {
      name: 'simpleIconSlug',
      type: 'text',
      label: 'Simple Icons slug',
      admin: {
        description:
          'Slug from simpleicons.org, e.g. "python", "postgresql". Leave empty to fall back to an uploaded icon or initials.',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Custom icon (overrides Simple Icons)',
    },
    {
      name: 'exploring',
      type: 'checkbox',
      label: 'Currently exploring (dashed style)',
      defaultValue: false,
    },
    {
      name: 'proficiencyNote',
      type: 'text',
      label: 'Proficiency note (optional)',
      admin: { description: 'e.g. "daily driver", "comfortable", "2 production projects"' },
    },
    {
      name: 'proofProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Proof projects (shown in the tile popover)',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
