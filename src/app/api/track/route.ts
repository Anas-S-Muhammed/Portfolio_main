import { createHash } from 'node:crypto'
import { z } from 'zod'

import { getEnv } from '@/lib/env'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'
const schema = z.object({
  type: z.enum(['pageview', 'sectionView', 'projectOpen', 'slideProgress', 'outboundClick', 'resumeDownload', 'contactSubmit', 'chatQuestion']),
  path: z.string().startsWith('/').max(300),
  sessionId: z.string().min(8).max(100),
  referrer: z.string().max(500).optional(),
  meta: z.record(z.string(), z.union([z.string().max(200), z.number(), z.boolean()])).optional(),
})

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch { return Response.json({ error: { code: 'INVALID_JSON', message: 'Invalid event.' } }, { status: 400 }) }
  const result = schema.safeParse(body)
  if (!result.success) return Response.json({ error: { code: 'INVALID_EVENT', message: 'Invalid event.' } }, { status: 400 })
  const salt = getEnv().ANALYTICS_SALT || process.env.PAYLOAD_SECRET || 'local-analytics-salt'
  const sessionHash = createHash('sha256').update(`${salt}:${result.data.sessionId}`).digest('hex')
  try {
    await (await getPayloadClient()).create({
      collection: 'analytics-events',
      data: { type: result.data.type, path: result.data.path, sessionHash, referrer: result.data.referrer, meta: result.data.meta },
    })
  } catch {
    return Response.json({ error: { code: 'STORAGE_UNAVAILABLE', message: 'Event not stored.' } }, { status: 503 })
  }
  return new Response(null, { status: 204 })
}
