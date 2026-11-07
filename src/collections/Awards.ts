import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * Awards & achievements — rendered as numbered rows with boxed indexes.
 * Includes academic and non-IT achievements.
 */
export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'event', 'year'],
  },
  access: {
    read: publishedOrAuthenticated,
  },
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'event',
      type: 'text',
      label: 'Event / context',
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category (e.g. Entrepreneurship, Diplomacy)',
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
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
