# ADR 0004: Motion must stay optional

- Status: accepted
- Date: 2026-11-08

## Decision

Use CSS transforms and opacity for lightweight transitions. Load Lenis and GSAP only on the public shell, and disable smooth scrolling when reduced motion, save-data, slow network, or the admin motion setting requests a calmer experience.

## Trade-offs

The first portfolio pass uses CSS animation and the Lenis/GSAP foundation; all requested slideshow drawing, route morphing, cursor effects, timeline choreography and device-specific performance tuning are not complete. The fallback remains readable without those effects.
