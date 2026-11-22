# Grounded assistant flow

```mermaid
flowchart LR
  Q[Visitor question] --> V[Zod validation and limits]
  V --> R[Keyword ranking over published CMS content]
  R --> C[Delimited source context]
  C --> P[Grounding and injection-resistant instructions]
  P --> G[Gemini Interactions stream]
  G --> S[Text deltas]
  R --> L[Source links]
  S --> UI[Chat panel]
  L --> UI
  L --> UI

  UI --> H[Anonymized chat log]
```

The current retrieval path ranks published profile, project, skill, experience, certification, award and beyond entries by keyword overlap. Project routes restrict retrieval to that project. If the Gemini key is absent, a deterministic reply points to the closest published source. The assistant is disabled by default in its Payload global.

Embedding chunk storage exists in the Payload schema, but automatic chunk creation, Gemini embedding calls, similarity retrieval, publish hooks and a re-index command have not been implemented yet. Until that pipeline is added, the keyword retriever is the source of context.
