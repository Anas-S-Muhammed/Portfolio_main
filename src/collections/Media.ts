import type { CollectionConfig } from 'payload'

/**
 * Media library. Alt text is required at upload time so accessibility
 * never depends on the owner remembering to backfill descriptions.
 * Images are processed with sharp into responsive sizes.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'System',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    // The public site must be able to render images.
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768 },
      { name: 'tablet', width: 1024 },
      { name: 'desktop', width: 1440 },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    // Files live on local disk in dev; Vercel Blob adapter is added in production.
    staticDir: 'media',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text (required — describe the image for screen readers)',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes (optional)',
      admin: {
        description: 'Where this asset is used, or anything future-you should know.',
      },
    },
  ],
}
