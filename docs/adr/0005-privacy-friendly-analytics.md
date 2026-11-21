# ADR 0005: First-party, cookieless events

- Status: accepted
- Date: 2026-11-08

## Decision

Record a bounded set of first-party events in Payload and hash a random session identifier server-side. Do not persist raw IP addresses or third-party analytics cookies.

## Trade-offs

The current implementation records page views and accepts a wider event contract. The dashboard, aggregation views, retention policy, and production volume controls are follow-up work; the event collection is not a substitute for those pieces.
