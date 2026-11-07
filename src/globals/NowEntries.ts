import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * The "Now" panel — what Anas is building, learning and looking for,
 * with dates so it never silently rots.
 */
export const NowEntries: GlobalConfig = {
  slug: 'now-entries',
  label: 'Now Panel',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'entries',
      type: 'array',
      labels: { singular: 'Entry', plural: 'Entries' },
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          options: [
            { label: 'Currently building', value: 'building' },
            { label: 'Learning', value: 'learning' },
            { label: 'Looking for', value: 'looking' },
          ],
        },
        { name: 'text', type: 'text', required: true },
        { name: 'date', type: 'text', label: 'Since (e.g. "Oct 2026")' },
      ],
    },
  ],
}
