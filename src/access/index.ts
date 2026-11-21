import type { Access } from 'payload'

/**
 * Access rules shared by all collections.
 *
 * Public visitors may only read published documents; the single owner
 * account authenticates into /admin and sees everything including drafts.
 */

/** Authenticated owner only. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Anyone — used by media (public site needs to render images). */
export const anyone: Access = () => true

/**
 * Drafts-enabled collections: public visitors only see published docs.
 * Authenticated users (the owner) see everything, including drafts for
 * live preview.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

/**
 * ContactMessages + ChatLogs + AnalyticsEvents use inline per-operation
 * access: public create, owner-only read/update/delete (see each collection).
 */
