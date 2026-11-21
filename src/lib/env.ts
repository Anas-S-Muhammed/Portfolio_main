import { z } from 'zod'

/**
 * Environment validation. Everything except Payload's secret is optional —
 * each subsystem degrades gracefully when its key is absent.
 * Validated lazily so the site never crashes at import time in dev.
 */

const envSchema = z.object({
  // Core
  PAYLOAD_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_SERVER_URL: z.string().url().default('http://localhost:3000'),

  // Database — absent = SQLite dev mode
  DATABASE_URL: z
    .string()
    .refine((value) => /^postgres(ql)?:\/\//.test(value), 'Must be a postgres connection string')
    .optional(),

  // Gemini
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_CHAT_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_EMBEDDING_MODEL: z.string().default('text-embedding-004'),

  // Upstash
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Resend
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_FROM_EMAIL: z.string().email().optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),

  // Turnstile
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),

  // Vercel Blob
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

  // GitHub
  GITHUB_TOKEN: z.string().min(1).optional(),

  // Analytics
  ANALYTICS_SALT: z.string().min(16).optional(),
})

export type Env = z.infer<typeof envSchema>

let cached: Env | null = null

export function getEnv(): Env {
  if (cached) return cached
  const parsed = envSchema.safeParse(process.env)
  if (parsed.success) {
    cached = parsed.data
  } else {
    // Log and fall back — a malformed optional URL should not take the site down.
    console.warn(
      '[env] validation warnings:',
      parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    )
    cached = envSchema.parse({
      NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    })
  }
  return cached
}

export const flags = {
  get geminiReady() {
    return Boolean(getEnv().GEMINI_API_KEY)
  },
  get upstashReady() {
    const e = getEnv()
    return Boolean(e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN)
  },
  get resendReady() {
    return Boolean(getEnv().RESEND_API_KEY)
  },
  get turnstileReady() {
    const e = getEnv()
    return Boolean(e.NEXT_PUBLIC_TURNSTILE_SITE_KEY && e.TURNSTILE_SECRET_KEY)
  },
  get blobReady() {
    return Boolean(getEnv().BLOB_READ_WRITE_TOKEN)
  },
}
