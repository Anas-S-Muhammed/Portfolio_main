import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Section Manager — order, visibility, titles, eyebrows and layout
 * variants for every home section. Array rows drag-and-drop reorder.
 */
export const SectionConfig: GlobalConfig = {
  slug: 'section-config',
  label: 'Section Manager',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      required: true,
      labels: { singular: 'Section', plural: 'Sections' },
      admin: {
        description: 'Drag to reorder. Untick "Visible" to hide a section entirely.',
      },
      defaultValue: [
        { key: 'hero', visible: true },
        { key: 'marquee', visible: true },
        { key: 'about', visible: true },
        { key: 'featured', visible: true },
        { key: 'projects', visible: true },
        { key: 'skills', visible: true },
        { key: 'experience', visible: true },
        { key: 'research', visible: true },
        { key: 'certifications', visible: true },
        { key: 'awards', visible: true },
        { key: 'beyond', visible: true },
        { key: 'process', visible: true },
        { key: 'writing', visible: true },
        { key: 'github', visible: true },
        { key: 'contact', visible: true },
      ],
      fields: [
        {
          name: 'key',
          type: 'select',
          required: true,
          options: [
            'hero',
            'marquee',
            'about',
            'featured',
            'projects',
            'skills',
            'experience',
            'research',
            'certifications',
            'awards',
            'beyond',
            'process',
            'writing',
            'github',
            'contact',
          ],
        },
        { name: 'visible', type: 'checkbox', defaultValue: true },
        {
          name: 'title',
          type: 'text',
          label: 'Title override',
          admin: { description: 'Leave empty to use the default title.' },
        },
        { name: 'eyebrow', type: 'text', label: 'Eyebrow override' },
        {
          name: 'variant',
          type: 'select',
          label: 'Layout variant',
          options: ['default', 'grid', 'list', 'compact'],
          defaultValue: 'default',
        },
      ],
    },
  ],
}
