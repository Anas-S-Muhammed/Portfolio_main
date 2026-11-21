# ADR 0001: Payload in the Next.js application

- Status: accepted
- Date: 2026-11-08

## Decision

Run Payload 3 in the same Next.js application and use its Local API for server-rendered public content.

## Why

The owner needs to change portfolio content without code edits. Keeping the CMS, access rules, and public renderer together avoids a second service and lets public pages read only published documents through Payload access control.

## Trade-offs

Payload and its admin routes increase build complexity. The admin requires a strong secret and a deliberately created owner account. We do not enable visitor registration.
