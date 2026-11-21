import type { Block } from 'payload'

/**
 * Slide blocks — the building blocks of a project slideshow.
 * Each block maps 1:1 to an animated renderer in the public site
 * (see section 7 of the build spec). The admin composes a project's
 * story by adding and reordering these blocks.
 */

const headingField = {
  name: 'heading',
  type: 'text',
  label: 'Slide heading',
} as const

export const CoverSlide: Block = {
  slug: 'slide-cover',
  labels: { singular: 'Cover Slide', plural: 'Cover Slides' },
  fields: [
    headingField,
    {
      name: 'pitch',
      type: 'textarea',
      label: 'One-line pitch',
      required: true,
    },
  ],
}

export const ProblemSlide: Block = {
  slug: 'slide-problem',
  labels: { singular: 'Problem Slide', plural: 'Problem Slides' },
  fields: [
    headingField,
    {
      name: 'boldStatement',
      type: 'textarea',
      label: 'One bold sentence',
      required: true,
    },
    {
      name: 'supportingText',
      type: 'richText',
      label: 'Supporting text',
    },
  ],
}

export const BuiltSlide: Block = {
  slug: 'slide-built',
  labels: { singular: 'What I Built Slide', plural: 'What I Built Slides' },
  fields: [
    headingField,
    {
      name: 'intro',
      type: 'textarea',
      label: 'Short intro',
    },
    {
      name: 'visuals',
      type: 'array',
      label: 'Visuals (screenshots / device mockups)',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'callouts',
      type: 'array',
      label: 'Feature callouts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const ArchitectureSlide: Block = {
  slug: 'slide-architecture',
  labels: { singular: 'Architecture Slide', plural: 'Architecture Slides' },
  fields: [
    headingField,
    {
      name: 'diagram',
      type: 'group',
      label: 'Node/edge diagram (draws itself with animated packets)',
      fields: [
        {
          name: 'nodes',
          type: 'array',
          label: 'Nodes',
          fields: [
            {
              name: 'id',
              type: 'text',
              required: true,
              admin: { description: 'Short id used by edges, e.g. "etl"' },
            },
            { name: 'label', type: 'text', required: true },
            {
              name: 'icon',
              type: 'select',
              options: [
                'database',
                'server',
                'pipeline',
                'chart',
                'brain',
                'cloud',
                'shield',
                'user',
                'file',
                'api',
                'gear',
              ],
              defaultValue: 'server',
            },
            {
              name: 'tier',
              type: 'select',
              options: ['source', 'transform', 'store', 'serve', 'client'],
              defaultValue: 'transform',
              admin: {
                description:
                  'Rough left-to-right lane in the diagram. "transform" is the middle lane.',
              },
            },
          ],
        },
        {
          name: 'edges',
          type: 'array',
          label: 'Edges',
          fields: [
            {
              name: 'from',
              type: 'text',
              required: true,
              admin: { description: 'Node id this edge starts from' },
            },
            {
              name: 'to',
              type: 'text',
              required: true,
              admin: { description: 'Node id this edge points to' },
            },
            { name: 'label', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'fallbackImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Fallback image (overrides the diagram)',
      admin: { description: 'Optional — used instead of the generated SVG diagram.' },
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Architecture notes',
    },
  ],
}

export const StackRoleSlide: Block = {
  slug: 'slide-stack-role',
  labels: { singular: 'Stack & Role Slide', plural: 'Stack & Role Slides' },
  fields: [
    headingField,
    {
      name: 'notes',
      type: 'textarea',
      label: 'Role notes',
      admin: {
        description:
          'Role, team size and timeline are edited on the project itself; this is extra context.',
      },
    },
  ],
}

export const ResultsSlide: Block = {
  slug: 'slide-results',
  labels: { singular: 'Results Slide', plural: 'Results Slides' },
  fields: [
    headingField,
    {
      name: 'note',
      type: 'textarea',
      label: 'Framing note',
      admin: {
        description:
          'Metric cards come from the project’s Metrics field — only entered metrics are shown.',
      },
    },
  ],
}

export const DecisionsSlide: Block = {
  slug: 'slide-decisions',
  labels: { singular: 'Decision Log Slide', plural: 'Decision Log Slides' },
  fields: [
    headingField,
    {
      name: 'decisions',
      type: 'array',
      label: 'Decisions',
      labels: { singular: 'Decision', plural: 'Decisions' },
      fields: [
        {
          name: 'chose',
          type: 'text',
          label: 'I chose…',
          required: true,
        },
        {
          name: 'over',
          type: 'text',
          label: '…over…',
          required: true,
        },
        {
          name: 'because',
          type: 'textarea',
          label: '…because',
          required: true,
        },
      ],
    },
  ],
}

export const LessonsSlide: Block = {
  slug: 'slide-lessons',
  labels: { singular: 'What Went Wrong Slide', plural: 'What Went Wrong Slides' },
  fields: [
    headingField,
    {
      name: 'lessons',
      type: 'array',
      label: 'Lessons',
      fields: [
        { name: 'whatWentWrong', type: 'text', required: true },
        { name: 'whatIdChange', type: 'textarea', required: true },
      ],
    },
  ],
}

export const GallerySlide: Block = {
  slug: 'slide-gallery',
  labels: { singular: 'Gallery Slide', plural: 'Gallery Slides' },
  fields: [
    headingField,
    {
      name: 'items',
      type: 'array',
      label: 'Items',
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
  ],
}

export const QuerySlide: Block = {
  slug: 'slide-query',
  labels: { singular: 'Query Slide', plural: 'Query Slides' },
  fields: [
    headingField,
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'sql',
      options: [
        { label: 'SQL', value: 'sql' },
        { label: 'Python', value: 'python' },
        { label: 'Other', value: 'text' },
      ],
    },
    {
      name: 'code',
      type: 'textarea',
      required: true,
      label: 'Snippet',
      admin: { description: 'One real query or script from this project. Keep it short enough to read on a slide.' },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Why it is shaped this way',
    },
  ],
}

export const LinksSlide: Block = {
  slug: 'slide-links',
  labels: { singular: 'Links Slide', plural: 'Links Slides' },
  fields: [
    headingField,
    {
      name: 'note',
      type: 'textarea',
      label: 'Closing note',
    },
  ],
}

export const slideBlocks = [
  CoverSlide,
  ProblemSlide,
  BuiltSlide,
  ArchitectureSlide,
  StackRoleSlide,
  ResultsSlide,
  DecisionsSlide,
  LessonsSlide,
  GallerySlide,
  QuerySlide,
  LinksSlide,
]
