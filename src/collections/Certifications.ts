import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'

/**
 * Certifications. The public card expands in place; the "Verify" button
 * only renders when a credential URL exists — until the owner supplies
 * URLs, a TODO badge is shown in admin instead.
 */
export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'issuer', 'issueDate', 'credentialUrl'],
    description:
      'TODO badge logic: entries without a credential URL show a badge in this list view but never expose a broken Verify button publicly.',
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
      name: 'issuer',
      type: 'text',
      required: true,
    },
    {
      name: 'issueDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM yyyy' } },
    },
    {
      name: 'expiryDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'MMM yyyy' } },
    },
    {
      name: 'credentialUrl',
      type: 'text',
      label: 'Credential URL (official verification link)',
      admin: {
        description: 'TODO until the owner supplies it — hides the public Verify button.',
      },
      validate: (value: string | null | undefined) =>
        !value || /^https?:\/\//.test(value) || 'Enter a valid http(s) URL',
    },
    {
      name: 'credentialId',
      type: 'text',
    },
    {
      name: 'badgeImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'skillsCovered',
      type: 'text',
      hasMany: true,
      label: 'Skills covered',
      admin: { description: 'One per entry, press Enter to add.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', step: 1 },
    },
  ],
}
