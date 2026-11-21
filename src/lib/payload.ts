import config from '@payload-config'
import { getPayload, Payload } from 'payload'

let cached: Payload | null = null

/** Shared Payload client for server-side data access (Local API). */
export async function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = await getPayload({ config })
  }
  return cached
}
