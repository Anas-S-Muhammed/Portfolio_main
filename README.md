# Anas Muhammed — Portfolio

A CMS-driven portfolio for data engineering and analytics internships. It brings project case studies, learning notes, a print-ready CV, and an optional grounded assistant into one owner-editable site.

## What is here

- `/` — editorial home page populated from Payload collections and globals.
- `/projects` and `/projects/[slug]` — project index and keyboard accessible, deep-linkable story slides with a readable page mode.
- `/writing` and `/writing/[slug]` — published notes.
- `/cv` — content-backed CV, formatted for print and “Save as PDF”.
- `/contact` — validated contact form; messages are saved to the admin inbox before optional email delivery.
- `/admin` — Payload CMS for projects, skills, experience, credentials, settings, messages and assistant controls.
- Floating portfolio assistant — hidden until enabled in Admin → AI Assistant; grounded in published content and links its sources.
- Sitemap, robots, web manifest and dynamic Open Graph image route.

## Architecture

```mermaid
flowchart LR
  Visitor[Visitor] --> Next[Next.js App Router]
  Next --> Public[Public pages and case studies]
  Public --> Payload[Payload CMS]
  Admin[Owner at /admin] --> Payload
  Payload --> DB[(SQLite locally / PostgreSQL in production)]
  Contact[Contact API] --> Payload
  Contact --> Resend[Optional Resend email]
  Chat[Chat API] --> Payload
  Chat --> Gemini[Optional Gemini Interactions API]
  Chat --> Redis[Optional Upstash rate limits]
```

Public documents are read through Payload access rules. Drafts remain in Admin. Contact/chat APIs validate their payloads server-side and never return provider secrets. Chat transcripts store a salted hash in place of raw IP data.

## Local setup

Requirements: Node.js 22.12+ and pnpm 10.

```bash
pnpm install
Copy-Item .env.example .env
# Set PAYLOAD_SECRET to a random value, then:
pnpm dev
```

The local adapter uses SQLite in `.data/portfolio.db`, so a database server is not required. Visit `http://localhost:3000/admin` and create the first owner account, then use the Admin settings to populate or review the site content. To seed the included owner-supplied portfolio content:

```bash
pnpm seed
```

The seed command is idempotent when projects already exist. It deliberately marks missing owner values with `TODO_FOR_OWNER`; review [TODO_FOR_OWNER.md](TODO_FOR_OWNER.md) before launch.

For local PostgreSQL with pgvector available:

```bash
docker compose up -d
# Set DATABASE_URL=postgres://portfolio:portfolio@localhost:5432/portfolio in .env
pnpm dev
```

## Environment

Only `NEXT_PUBLIC_SERVER_URL` and a strong `PAYLOAD_SECRET` are required for a deployment. Other integrations are optional and fail closed or degrade gracefully.

| Variable | Used for |
| --- | --- |
| `PAYLOAD_SECRET` | Payload session signing. Generate a unique secret. |
| `NEXT_PUBLIC_SERVER_URL` | Canonical URL, sitemap, metadata. |
| `DATABASE_URL` | PostgreSQL connection; unset selects SQLite locally. |
| `GEMINI_API_KEY`, `GEMINI_CHAT_MODEL` | Optional grounded streaming assistant. |
| `GEMINI_EMBEDDING_MODEL` | Reserved for vector indexing as the embedding pipeline is completed. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared chat rate limits; without them, a process-local limiter is used. |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | Optional contact notification email. Inbox storage works without these. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional contact challenge configuration. |
| `BLOB_READ_WRITE_TOKEN` | Reserved for remote Payload media storage. |
| `GITHUB_TOKEN` | Reserved for the optional GitHub activity section. |
| `ANALYTICS_SALT` | Salt for non-reversible visitor/session hashes. |

## Commands

```bash
pnpm dev             # local development
pnpm typecheck        # strict TypeScript check
pnpm lint            # ESLint
pnpm build           # optimized production build
pnpm seed             # populate the SQLite/Postgres database
pnpm generate:types   # regenerate Payload types after schema changes
pnpm format:check     # Prettier verification
```

GitHub Actions runs install, typecheck, lint, and production build on pushes to `main` and pull requests.

## Deploy to Vercel

1. Push the repository to GitHub and import it into Vercel as a Next.js app.
2. Provision PostgreSQL, enable `pgvector`, and set `DATABASE_URL` and `PAYLOAD_SECRET` in Vercel.
3. Add `NEXT_PUBLIC_SERVER_URL` for the production origin. Add optional provider keys only when enabling those features.
4. Deploy, open `/admin`, create the owner account, and run the seed against the production database using a trusted local environment.
5. Review every item in `TODO_FOR_OWNER.md`, test the contact inbox, verify published project links, and confirm sitemap/OG output on the deployed domain.

## Current boundaries

The database and CMS schema support richer publishing, but query-time vector embeddings/re-indexing, full admin analytics, GitHub activity, image blob adapter wiring, TOTP, and a full metrics dashboard still need production configuration or implementation. Those are intentionally not represented as completed features. The feature checklist in `TODO_FOR_OWNER.md` separates owner supplied values from remaining engineering work.
