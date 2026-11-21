import type { CollectionConfig } from 'payload'

/**
 * The single owner account. Public registration does not exist — the first
 * user is created through Payload's first-user screen on /admin, and no
 * other sign-up path is exposed.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  auth: {
    // Brute-force protection: lock the account for 10 minutes after 5 failed logins.
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    // Session cookies expire quickly; Payload refreshes them while active.
    useAPIKey: false,
  },
  access: {
    // Only the owner manages users; there is exactly one.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
