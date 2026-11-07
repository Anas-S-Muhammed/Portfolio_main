# ADR 0002: SQLite locally, PostgreSQL in production

- Status: accepted
- Date: 2026-11-08

## Decision

Use SQLite for zero-setup local development and the Payload Postgres adapter for production. Production is expected to enable pgvector before a vector index is switched on.

## Why

A fresh clone can start without provisioning a database, while hosted deployments retain PostgreSQL compatibility for future retrieval and analytics workloads.

## Trade-offs

SQLite does not validate production concurrency or pgvector behavior. The current chat uses published-content keyword retrieval; vector embedding, migrations, and the production vector index remain unfinished and are listed in the README.
