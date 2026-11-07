import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * Identity & hero. Every word a recruiter sees in the first five seconds
 * is edited here.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Identity & Hero',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Anas Muhammed',
    },
    {
      name: 'roleWords',
      type: 'text',
      hasMany: true,
      label: 'Rotating role words',
      required: true,
      defaultValue: ['Data Engineer', 'Data Analyst', 'ML Builder'],
      admin: { description: 'Shown one at a time with a vertical swap animation.' },
    },
    {
      name: 'valueStatement',
      type: 'text',
      required: true,
      label: 'One-line value statement',
      defaultValue: 'Data pipelines, SQL, applied ML — explainable results included.',
    },
    {
      name: 'availability',
      type: 'group',
      label: 'Availability pill',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Open to internships',
        },
        {
          name: 'dates',
          type: 'text',
          label: 'Dates (optional)',
          admin: { description: 'e.g. "Summer 2027" — leave empty to omit.' },
        },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero visual',
      fields: [
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'illustration',
          options: [
            { label: 'Line-art illustration (default)', value: 'illustration' },
            { label: 'Photo', value: 'photo' },
            { label: 'Photo in circle with rotating badge', value: 'circlePhoto' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo (used in photo modes)',
          admin: { description: 'TODO until the owner supplies a photo.' },
        },
        {
          name: 'badgeText',
          type: 'text',
          label: 'Rotating badge text (circle mode)',
          defaultValue: 'DATA · PIPELINES · ML · SQL · ',
        },
      ],
    },
    {
      name: 'heroButtons',
      type: 'array',
      label: 'Hero buttons',
      labels: { singular: 'Button', plural: 'Buttons' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'kind',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (accent pill)', value: 'primary' },
            { label: 'Outline pill', value: 'outline' },
            { label: 'Ink (solid black pill)', value: 'ink' },
          ],
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      label: 'Social pills',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: ['github', 'linkedin', 'email', 'other'],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: { description: 'TODO until the owner supplies URLs.' },
        },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'facts',
      type: 'group',
      label: 'Key facts (About & CV)',
      fields: [
        {
          name: 'location',
          type: 'text',
          defaultValue: 'Alor Setar, Kedah, Malaysia',
        },
        {
          name: 'university',
          type: 'text',
          defaultValue: 'Albukhary International University',
        },
        {
          name: 'degree',
          type: 'text',
          defaultValue: 'BSc Computer Science',
        },
        {
          name: 'expectedGraduation',
          type: 'text',
          defaultValue: '2027',
        },
        {
          name: 'languages',
          type: 'text',
          hasMany: true,
          defaultValue: ['English', 'Arabic'],
        },
        {
          name: 'cgpa',
          type: 'group',
          label: 'CGPA',
          fields: [
            { name: 'value', type: 'text', defaultValue: '3.69' },
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show publicly (untick to hide)',
            },
          ],
        },
        {
          name: 'targetRole',
          type: 'text',
          defaultValue: 'Data Engineering / Data Analyst internships',
        },
      ],
    },
    {
      name: 'aboutIntro',
      type: 'textarea',
      label: 'About — short human intro',
    },
    {
      name: 'traitChips',
      type: 'text',
      hasMany: true,
      label: 'Trait chips (About)',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats bento (only entered stats are shown)',
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'caption', type: 'text' },
        { name: 'inverted', type: 'checkbox', label: 'Inverted cell (the accent cell)' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'Search & social previews',
      fields: [
        { name: 'defaultTitle', type: 'text', defaultValue: 'Anas Muhammed — Data Engineering & Analytics' },
        { name: 'description', type: 'textarea', defaultValue: 'Computer Science student building data pipelines, SQL models and explainable machine learning.' },
        { name: 'keywords', type: 'text', hasMany: true, label: 'Search keywords' },
        { name: 'canonicalUrl', type: 'text', label: 'Canonical site URL', admin: { description: 'Falls back to NEXT_PUBLIC_SERVER_URL.' } },
        { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default social preview image' },
      ],
    },
    {
      name: 'githubUsername',
      type: 'text',
      label: 'GitHub username (activity section)',
      admin: { description: 'TODO until the owner supplies it. Section hides while empty.' },
    },
  ],
}
