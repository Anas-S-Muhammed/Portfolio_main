# First-party analytics model

The `/api/track` route accepts a small allowlist of event names and bounded metadata. It hashes a random, session-scoped browser identifier on the server with `ANALYTICS_SALT` (or the Payload secret fallback) and writes the result to `AnalyticsEvents`. No cookies or raw IP fields are persisted.

Event types currently accepted: `pageview`, `sectionView`, `projectOpen`, `slideProgress`, `outboundClick`, `resumeDownload`, `contactSubmit`, and `chatQuestion`. The home layout currently sends page views. Contact and chat use their own persistence models.

The database collection and indexes are ready for reporting, but the custom date-range dashboard, SQL aggregation views, chart UI, and consent/retention controls remain follow-up work. Do not describe these events as a completed analytics dashboard.
