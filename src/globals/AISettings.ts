import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * AI chat behavior, safety and cost control. Disabling the chat here is
 * the kill switch — the floating button disappears site-wide.
 */
export const AISettings: GlobalConfig = {
  slug: 'ai-settings',
  label: 'AI Assistant',
  admin: { group: 'AI' },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Enable chat (kill switch)',
      admin: {
        description:
          'Off by default — turn on after GEMINI_API_KEY is configured. Turning off instantly hides the chat site-wide.',
      },
    },
    {
      name: 'greeting',
      type: 'text',
      defaultValue: 'Hi! Ask me anything about Anas — projects, skills, availability.',
    },
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'third',
      label: 'Voice',
      options: [
        { label: 'Third person ("Anas built…")', value: 'third' },
        { label: 'First person ("I built…")', value: 'first' },
      ],
    },
    {
      name: 'suggestedChips',
      type: 'text',
      hasMany: true,
      label: 'Suggested questions',
      defaultValue: [
        'What is his strongest project?',
        'What does he do outside tech?',
        'Is he available for internships?',
      ],
    },
    {
      name: 'extraInstructions',
      type: 'textarea',
      label: 'Extra system instructions',
      admin: { description: 'Appended to the grounded system prompt. Keep short.' },
    },
    {
      name: 'refusedTopics',
      type: 'text',
      hasMany: true,
      label: 'Topics to refuse politely',
      defaultValue: ['salary expectations', 'other candidates', 'client confidentiality'],
    },
    {
      name: 'limits',
      type: 'group',
      fields: [
        {
          name: 'perIpPerMinute',
          type: 'number',
          defaultValue: 5,
          admin: { description: 'Questions per IP per minute.' },
        },
        {
          name: 'perSessionPerDay',
          type: 'number',
          defaultValue: 20,
          admin: { description: 'Questions per browser session per day.' },
        },
        {
          name: 'dailyGlobalCap',
          type: 'number',
          defaultValue: 500,
          label: 'Global daily cap (cost control)',
        },
        {
          name: 'maxMessageLength',
          type: 'number',
          defaultValue: 500,
        },
      ],
    },
    {
      name: 'models',
      type: 'group',
      label: 'Models (defaults come from env vars)',
      fields: [
        {
          name: 'chatModel',
          type: 'text',
          admin: { description: 'Overrides GEMINI_CHAT_MODEL if set, e.g. gemini-2.5-flash' },
        },
        {
          name: 'embeddingModel',
          type: 'text',
          admin: { description: 'Overrides GEMINI_EMBEDDING_MODEL if set.' },
        },
      ],
    },
  ],
}
