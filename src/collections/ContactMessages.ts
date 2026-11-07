import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Contact-form inbox. The public may only create; the owner reads and
 * manages messages from the admin panel. No raw IPs are stored.
 */
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    group: 'Inbox',
    useAsTitle: 'subject',
    defaultColumns: ['name', 'email', 'read', 'createdAt'],
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  indexes: [{ fields: ['createdAt'] }, { fields: ['read'] }],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      defaultValue: '(no subject)',
      admin: { hidden: true },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'meta',
      type: 'group',
      admin: { readOnly: true },
      fields: [
        {
          name: 'sessionHash',
          type: 'text',
          label: 'Session hash (no raw IP stored)',
        },
        {
          name: 'turnstilePassed',
          type: 'checkbox',
        },
        {
        name: 'referrer',
          type: 'text',
        },
      ],
    },
  ],
}
