import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access'

/**
 * RAG store for the AI chat. Content is chunked on publish, hashed, and
 * embedded with the Gemini embedding model; only changed chunks re-embed.
 *
 * In production (Postgres + pgvector) the `vector` JSON column is migrated
 * to a native vector(768) column with an HNSW index (see scripts/migrate-pgvector.ts).
 * In SQLite dev the same field holds the vector and similarity is computed in JS.
 */
export const EmbeddingChunks: CollectionConfig = {
  slug: 'embedding-chunks',
  admin: {
    group: 'AI',
    useAsTitle: 'title',
    defaultColumns: ['title', 'sourceType', 'contentHash'],
    description: 'AI knowledge index. Use the "Re-index everything" button in AI Settings.',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  indexes: [{ fields: ['contentHash'], unique: true }, { fields: ['sourceRef'] }],
  fields: [
    {
      name: 'sourceType',
      type: 'select',
      required: true,
      options: ['project', 'skill', 'certification', 'experience', 'award', 'beyond', 'post', 'site'],
    },
    {
      name: 'sourceRef',
      type: 'text',
      required: true,
      label: 'Source reference (collection/id or slug)',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Public URL for source chips',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'contentHash',
      type: 'text',
      required: true,
    },
    {
      name: 'vector',
      type: 'json',
      required: true,
      admin: {
        description: 'Embedding vector. Native pgvector column in production.',
      },
    },
  ],
}
