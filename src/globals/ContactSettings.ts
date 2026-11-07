import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Contact form behavior and spam protection.
 */
export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Contact',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'recipientEmail',
      type: 'email',
      label: 'Recipient email',
      admin: { description: 'TODO until the owner supplies it. Messages still land in the inbox.' },
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thanks — your message is in. I usually reply within 48 hours.',
    },
    {
      name: 'typicalResponseTime',
      type: 'text',
      defaultValue: 'Usually replies within 48 hours',
    },
    {
      name: 'calendarLink',
      type: 'text',
      label: 'Calendar link (optional)',
      admin: { description: 'TODO until the owner supplies it. Hidden while empty.' },
    },
    {
      name: 'turnstileEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Require Cloudflare Turnstile',
      admin: { description: 'Enable after adding Turnstile keys. Honeypot is always on.' },
    },
  ],
}
