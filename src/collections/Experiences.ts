import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * Experience & leadership timeline. Dates are stored as human strings
 * ("Dec 2025") rather than machine dates because CV-style ranges read
 * better and filter only by type.
 */
export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    group: 'Content',
    useAsTitle: 'role',
    defaultColumns: ['role', 'organization', 'type', 'startDate'],
  },
  access: {
    read: publishedOrAuthenticated,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  indexes: [{ fields: ['type'] }],
  fields: [
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Work', value: 'work' },
        { label: 'Teaching', value: 'teaching' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Research', value: 'research' },
        { label: 'Volunteering', value: 'volunteering' },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      label: 'One-line result',
    },
    {
      name: 'startDate',
      type: 'text',
      label: 'Start (e.g. "Dec 2025")',
      required: true,
    },
    {
      name: 'endDate',
      type: 'text',
      label: 'End (e.g. "Apr 2026", or leave empty for present)',
    },
    {
      name: 'bullets',
      type: 'array',
      labels: { singular: 'Bullet', plural: 'Bullets' },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'link',
      type: 'text',
      validate: (value: string | null | undefined) =>
        !value || /^https?:\/\//.test(value) || 'Enter a valid http(s) URL',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
