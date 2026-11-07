import { createHash } from 'node:crypto'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { getContactSettings } from '@/lib/content/settings'
import { getEnv } from '@/lib/env'

export const runtime = 'nodejs'
const inputSchema = z.object({ name: z.string().trim().min(1).max(120), email: z.string().trim().email().max(254), subject: z.string().trim().max(160).optional().default(''), message: z.string().trim().min(10).max(5000), website: z.string().max(0).optional().default('') })
const requests = new Map<string, number[]>()

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const recent = (requests.get(ip) || []).filter((time) => now - time < 60_000)
  if (recent.length >= 5) return Response.json({ error: { code: 'RATE_LIMITED', message: 'Please wait a moment before sending another message.' } }, { status: 429 })
  recent.push(now)
  requests.set(ip, recent)
  let body: unknown
  try { body = await request.json() } catch { return Response.json({ error: { code: 'INVALID_JSON', message: 'Please check the form and try again.' } }, { status: 400 }) }
  const parsed = inputSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: { code: 'INVALID_INPUT', message: 'Please complete all fields with valid details.' } }, { status: 400 })
  if (parsed.data.website) return Response.json({ message: 'Thanks. Your message is in.' })
  const settings = await getContactSettings()
  const env = getEnv()
  const candidate = (body as { turnstileToken?: unknown }).turnstileToken
  const token = typeof candidate === 'string' ? candidate : ''
  if (settings.turnstileEnabled) {
    if (!env.TURNSTILE_SECRET_KEY || !token) return Response.json({ error: { code: 'CHALLENGE_REQUIRED', message: 'Please complete the spam check and try again.' } }, { status: 400 })
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }) })
    if (!verify.ok || !(await verify.json() as { success?: boolean }).success) return Response.json({ error: { code: 'CHALLENGE_FAILED', message: 'The spam check could not be verified.' } }, { status: 400 })
  }
  const secret = env.ANALYTICS_SALT || process.env.PAYLOAD_SECRET || 'local-contact-salt'
  const sessionHash = createHash('sha256').update(`${secret}:${ip}`).digest('hex')
  const payload = await getPayloadClient()
  await payload.create({ collection: 'contact-messages', data: { name: parsed.data.name, email: parsed.data.email, subject: parsed.data.subject || '(no subject)', message: parsed.data.message, meta: { sessionHash, turnstilePassed: Boolean(token), referrer: request.headers.get('referer') || '' } } })
  const recipient = settings.recipientEmail || env.CONTACT_TO_EMAIL
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && recipient) {
    try { await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [recipient], reply_to: parsed.data.email, subject: `Portfolio message: ${parsed.data.subject || parsed.data.name}`, text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}` }) }) } catch { /* Inbox storage already succeeded. */ }
  }
  return Response.json({ message: settings.successMessage || 'Thanks. Your message is in.' }, { status: 201 })
}
