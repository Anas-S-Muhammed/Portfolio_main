# ADR 0003: Grounded assistant over published content

- Status: accepted
- Date: 2026-11-08

## Decision

The assistant retrieves a small set of published portfolio entries, passes them as delimited context to Gemini, returns source links, and records a hashed session identifier with the exchange. The provider key stays server-side.

## Why

The visitor-facing assistant should answer questions about the portfolio without inventing details. A question outside published content should receive a clear contact link.

## Trade-offs

Current retrieval ranks text by keyword overlap. Semantic embeddings, re-index-on-publish hooks, and durable Redis limits require provider configuration and follow-up work. The assistant is disabled by default in Admin.
