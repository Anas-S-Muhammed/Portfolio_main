import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Theme — accent, presets, dark mode default, radius, animation intensity,
 * cursor and grain toggles. Every component follows the CSS variables
 * this global emits, so changing the accent here recolors the whole site.
 */
export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'accentPreset',
      type: 'select',
      defaultValue: 'ember',
      label: 'Accent preset',
      options: [
        { label: 'Ember (orange-red, default)', value: 'ember' },
        { label: 'Signal (warm red)', value: 'signal' },
        { label: 'Kermit (green)', value: 'kermit' },
        { label: 'Ultra (violet)', value: 'ultra' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'customAccent',
      type: 'text',
      label: 'Custom accent hex (used when preset = Custom)',
      validate: (value: string | null | undefined) =>
        !value || /^#[0-9a-fA-F]{6}$/.test(value) || 'Enter a hex color like #FF5A1F',
    },
    {
      name: 'defaultMode',
      type: 'select',
      defaultValue: 'system',
      label: 'Default color mode',
      options: [
        { label: 'Follow system', value: 'system' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'radiusStyle',
      type: 'select',
      defaultValue: 'editorial',
      label: 'Corner radius rule',
      options: [
        { label: 'Editorial (sharp 2-4px blocks)', value: 'editorial' },
        { label: 'Friendly (16px cards)', value: 'friendly' },
        { label: 'Mixed (sharp blocks, soft cards)', value: 'mixed' },
      ],
    },
    {
      name: 'animationIntensity',
      type: 'select',
      defaultValue: 'full',
      label: 'Animation intensity',
      options: [
        { label: 'Full', value: 'full' },
        { label: 'Reduced', value: 'reduced' },
        { label: 'Off', value: 'off' },
      ],
      admin: {
        description:
          'Also defaults to Reduced automatically for visitors with save-data or slow connections.',
      },
    },
    {
      name: 'customCursor',
      type: 'checkbox',
      defaultValue: true,
      label: 'Custom cursor (desktop only)',
    },
    {
      name: 'grain',
      type: 'checkbox',
      defaultValue: true,
      label: 'Film grain overlay',
    },
  ],
}
