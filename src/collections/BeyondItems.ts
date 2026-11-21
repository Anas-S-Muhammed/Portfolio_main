import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * "Beyond the code" — MUN, volunteering, design teaching, books, hobbies.
 * Rendered as a draggable card stack / carousel.
 */
export const BeyondItems: CollectionConfig = {
  slug: 'beyond-items',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'date'],
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
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'MUN & debating', value: 'mun' },
        { label: 'Volunteering', value: 'volunteering' },
        { label: 'Teaching & design', value: 'teaching' },
        { label: 'Book (currently reading)', value: 'book' },
        { label: 'Hobby', value: 'hobby' },
        { label: 'Other moment', value: 'other' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short story',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'date',
      type: 'text',
      label: 'When (e.g. "Aug 2025")',
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
