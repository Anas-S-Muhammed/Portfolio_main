import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { AnalyticsEvents } from '@/collections/AnalyticsEvents'
import { Awards } from '@/collections/Awards'
import { BeyondItems } from '@/collections/BeyondItems'
import { Certifications } from '@/collections/Certifications'
import { ChatLogs } from '@/collections/ChatLogs'
import { ContactMessages } from '@/collections/ContactMessages'
import { EmbeddingChunks } from '@/collections/EmbeddingChunks'
import { Experiences } from '@/collections/Experiences'
import { Media } from '@/collections/Media'
import { Posts } from '@/collections/Posts'
import { Projects } from '@/collections/Projects'
import { SkillCategories } from '@/collections/SkillCategories'
import { Skills } from '@/collections/Skills'
import { Users } from '@/collections/Users'
import { AISettings } from '@/globals/AISettings'
import { ContactSettings } from '@/globals/ContactSettings'
import { NowEntries } from '@/globals/NowEntries'
import { ResumeSettings } from '@/globals/ResumeSettings'
import { SectionConfig } from '@/globals/SectionConfig'
import { SiteSettings } from '@/globals/SiteSettings'
import { ThemeSettings } from '@/globals/ThemeSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProd = process.env.NODE_ENV === 'production'
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Database strategy (see docs/adr/0002-database-strategy.md):
 * - DATABASE_URL=postgres://… → Postgres adapter (production; pgvector for embeddings)
 * - no DATABASE_URL → SQLite file at .data/portfolio.db (zero-setup local dev)
 */
const usePostgres = Boolean(process.env.DATABASE_URL?.startsWith('postgres'))

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || (isProd ? '' : 'dev-only-secret-change-me'),
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· Anas Muhammed',
    },
  },
  collections: [
    Projects,
    Skills,
    SkillCategories,
    Certifications,
    Experiences,
    Awards,
    BeyondItems,
    Posts,
    Media,
    Users,
    ContactMessages,
    ChatLogs,
    AnalyticsEvents,
    EmbeddingChunks,
  ],
  globals: [SiteSettings, SectionConfig, ThemeSettings, NowEntries, AISettings, ResumeSettings, ContactSettings],
  editor: lexicalEditor(),
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL,
        },
        // Dev pushes the schema directly; production uses migrations (see README).
        push: !isProd,
      })
    : sqliteAdapter({
        client: {
          url: 'file:./.data/portfolio.db',
        },
        push: !isProd,
      }),
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  plugins: [],
})
