import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * First-party, cookieless analytics events (batched via sendBeacon).
 * Uniqueness uses a daily-rotating salted hash; no raw IP, no identifiers.
 */
export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  admin: {
    group: 'Insights',
    useAsTitle: 'type',
    defaultColumns: ['type', 'path', 'createdAt'],
    description: 'Raw privacy-friendly events. The dashboard reads SQL views over this table.',
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  indexes: [{ fields: ['type'] }, { fields: ['createdAt'] }, { fields: ['path'] }],
  timestamps: true,
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        'pageview',
        'sectionView',
        'projectOpen',
        'slideProgress',
        'outboundClick',
        'resumeDownload',
        'contactSubmit',
        'chatQuestion',
      ],
    },
    {
      name: 'path',
      type: 'text',
      label: 'Page or section path',
    },
    {
      name: 'meta',
      type: 'json',
      label: 'Event metadata',
      admin: {
        description:
          'e.g. { slideIndex, slideId, projectId } for slide progression / drop-off tracking.',
      },
    },
    {
      name: 'sessionHash',
      type: 'text',
      label: 'Daily-rotating salted hash (unique counting)',
    },
    {
      name: 'referrer',
      type: 'text',
    },
    {
      name: 'utmSource',
      type: 'text',
    },
    {
      name: 'deviceClass',
      type: 'select',
      options: ['mobile', 'tablet', 'desktop'],
    },
    {
      name: 'country',
      type: 'text',
      label: 'Coarse country (from request headers, no geo-IP lookup)',
    },
  ],
}
