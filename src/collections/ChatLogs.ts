import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Anonymized chat transcripts so the owner can see what recruiters ask.
 * Identity is a hashed session id — no raw IP is ever stored.
 */
export const ChatLogs: CollectionConfig = {
  slug: 'chat-logs',
  admin: {
    group: 'AI',
    useAsTitle: 'question',
    defaultColumns: ['question', 'project', 'createdAt'],
    description:
      'Anonymized questions asked through the site chat. Delete anytime — deletion is immediate and permanent.',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  indexes: [{ fields: ['createdAt'] }],
  fields: [
    {
      name: 'sessionHash',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'question',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'answer',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Scoped to project (if per-project chat)',
    },
    {
      name: 'sources',
      type: 'json',
      admin: { readOnly: true },
    },
    {
      name: 'flagged',
      type: 'checkbox',
      label: 'Contains suspicious patterns',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
