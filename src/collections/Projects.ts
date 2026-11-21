import type { CollectionConfig } from 'payload'

import { slideBlocks } from '@/blocks/slides'
import { publishedOrAuthenticated } from '@/access'

/**
 * Projects â€” the heart of the portfolio. Each project is a structured story:
 * identity fields here, narrative slides via blocks, metrics for the
 * count-up results slide, and decisions recorded as "chose X over Y because Z".
 */
export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', '_status'],
    livePreview: {
      url: ({ data }) => `/projects/${data?.slug ?? ''}?preview=true`,
    },
  },
  access: {
    read: publishedOrAuthenticated,
  },
  versions: {
    drafts: {
      validate: false, // allow saving incomplete drafts; TODO badges surface gaps in admin
    },
    maxPerDoc: 20,
  },
  defaultSort: 'featuredOrder',
  indexes: [
    { fields: ['slug'], unique: true },
    { fields: ['category'] },
    { fields: ['featured'] },
    { fields: ['featuredOrder'] },
  ],
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
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
              admin: {
                position: 'sidebar',
                description: 'URL segment â€” /projects/your-slug',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'One-line pitch',
              required: true,
            },
            {
              name: 'statusBadge',
              type: 'text',
              label: 'Status badge',
              admin: {
                description: 'e.g. "MMC Upstart 2026 Finalist" â€” leave empty to hide.',
              },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              hasMany: false,
              options: [
                { label: 'Data Engineering', value: 'data-engineering' },
                { label: 'Data Analytics', value: 'data-analytics' },
                { label: 'ML & Research', value: 'ml-research' },
                { label: 'Full-stack', value: 'full-stack' },
              ],
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'stack',
              type: 'relationship',
              relationTo: 'skills',
              hasMany: true,
              label: 'Stack (links to Skills)',
            },
          ],
        },
        {
          label: 'Story',
          fields: [
            {
              name: 'slides',
              type: 'blocks',
              blocks: slideBlocks,
              admin: {
                description:
                  'Compose the slideshow: cover â†’ problem â†’ what I built â†’ architecture â†’ stack & role â†’ results â†’ decisions â†’ lessons â†’ gallery â†’ links.',
              },
            },
          ],
        },
        {
          label: 'Facts',
          fields: [
            {
              name: 'dateRange',
              type: 'text',
              label: 'Timeline',
              admin: { description: 'e.g. "Sep â€“ Nov 2026"' },
            },
            {
              name: 'role',
              type: 'text',
              label: 'Your role',
            },
            {
              name: 'teamSize',
              type: 'number',
              label: 'Team size',
            },
            {
              name: 'metrics',
              type: 'array',
              label: 'Metrics (results slide â€” only shows what you enter)',
              labels: { singular: 'Metric', plural: 'Metrics' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'number', required: true },
                { name: 'suffix', type: 'text' },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Links & Media',
          fields: [
            {
              name: 'links',
              type: 'group',
              fields: [
                {
                  name: 'live',
                  type: 'text',
                  label: 'Live demo URL',
                  admin: { description: 'Leave empty until the owner supplies it.' },
                },
                { name: 'repo', type: 'text', label: 'GitHub repo URL' },
                { name: 'paper', type: 'text', label: 'Paper PDF URL' },
                { name: 'video', type: 'text', label: 'Video URL' },
              ],
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Gallery',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'internalNote',
              type: 'textarea',
              label: 'Internal note (never shown publicly)',
              admin: {
                description:
                  'e.g. privacy reminders, things to confirm with collaborators before publishing.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              label: 'SEO title override',
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              label: 'SEO description override',
            },
            {
              name: 'seoImage',
              type: 'upload',
              relationTo: 'media',
              label: 'OG image override',
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured (pinned on the home page)',
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredOrder',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', step: 1, description: 'Lower shows first.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', step: 1, description: 'Sort order in the grid.' },
    },
  ],
}

