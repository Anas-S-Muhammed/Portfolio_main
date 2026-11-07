import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * Writing — rich-text posts. Reading time is computed on save.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', '_status'],
  },
  access: {
    read: publishedOrAuthenticated,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  indexes: [{ fields: ['slug'], unique: true }],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Compute reading time (~200 wpm) from a rough text extraction.
        const text =
          typeof data?.body === 'object' && data.body
            ? JSON.stringify(data.body)
            : (originalDoc?.body as unknown as object | undefined)
              ? JSON.stringify(originalDoc.body)
              : ''
        const words = text.replace(/<[^\>]*>/g, ' ').split(/\s+/).filter(Boolean).length
        if (data) {
          data.readingTime = Math.max(1, Math.round(words / 200))
        }
        return data
      },
    ],
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-computed on save (~200 wpm).',
      },
    },
  ],
}
