import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Resume — auto-generate the CV page from content, or upload a PDF
 * that overrides it.
 */
export const ResumeSettings: GlobalConfig = {
  slug: 'resume-settings',
  label: 'Resume',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto-generate from content', value: 'auto' },
        { label: 'Uploaded PDF overrides', value: 'pdf' },
      ],
    },
    {
      name: 'pdf',
      type: 'upload',
      relationTo: 'media',
      label: 'Resume PDF',
      admin: { description: 'TODO until the owner supplies it.' },
    },
  ],
}
