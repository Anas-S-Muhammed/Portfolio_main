# Owner checklist

Fill these through `/admin` before treating the site as production ready. Unknown facts stay hidden from public pages.

- [ ] Add the owner approved portrait or confirm the original line illustration as the permanent hero.
- [ ] Add GitHub and LinkedIn profile URLs and a public contact email.
- [ ] Supply the current CV PDF if it should override the generated CV.
- [ ] Add verified credential URLs, issue dates, and IDs for certifications.
- [ ] Add project screenshots, demo URLs, repository URLs, and paper links where available.
- [ ] Confirm project roles, timelines, team sizes, architecture details, and any outcome metrics with collaborators.
- [ ] Confirm that every displayed statistic and project claim is accurate and may be published.
- [ ] Add the owner’s domain and set `NEXT_PUBLIC_SERVER_URL` to the production origin.
- [ ] Configure `PAYLOAD_SECRET`, production `DATABASE_URL` (Postgres with pgvector), Gemini, Upstash, Resend, Turnstile, and Blob credentials as needed.
- [ ] Set a strong owner password and disable public account creation.
- [ ] Confirm the location, languages, education details, CGPA display preference, and internship dates.

Until these values are supplied, the site omits broken links and unverified assets. The seed script marks incomplete project content with `TODO_FOR_OWNER` notes.

## Engineering work before calling the full prompt complete

- [ ] Implement Gemini embeddings, chunk-on-publish indexing, similarity retrieval, and a re-index command; current retrieval is keyword based.
- [ ] Build the owner analytics dashboard, date filters, SQL aggregates, and chart empty states over `AnalyticsEvents`.
- [ ] Wire production Payload media storage to Vercel Blob and finish Postgres/pgvector migrations and indexes.
- [ ] Add custom admin audit history, content export/restore, TOTP, and safe scheduled publishing/rollback UX.
- [ ] Complete project cover/gallery media renderers, richer SVG architecture animation, swipe controls, focus restoration, and shared-element transitions.
- [ ] Add GitHub contribution data and activity caching after the owner supplies a GitHub username/token.
- [ ] Add critical-flow unit, browser, and accessibility tests; run Lighthouse and axe against the deployed site.
- [ ] Verify deployment secrets, database policies, backups, and provider callbacks in the production environment.
