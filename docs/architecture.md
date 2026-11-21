# Data model and request paths

Payload is the editing boundary. Public reads use published content, while owner changes go through the authenticated `/admin` panel.

```mermaid
erDiagram
  USERS ||--o{ PROJECTS : authors
  PROJECTS }o--o{ SKILLS : demonstrates
  SKILL_CATEGORIES ||--o{ SKILLS : groups
  PROJECTS ||--o{ MEDIA : illustrates
  POSTS ||--o{ MEDIA : illustrates
  CONTACT_MESSAGES }o--o| USERS : reviewed_by
  CHAT_LOGS }o--o| PROJECTS : scoped_to
  EMBEDDING_CHUNKS }o--o| PROJECTS : references
  SITE_SETTINGS ||--|| THEME_SETTINGS : configures
  ANALYTICS_EVENTS }o--o| PROJECTS : measures
```

`Projects` store portfolio identity and a sequence of typed slide blocks. Other public collections store skills, experience, certifications, awards, writing and beyond-the-code entries. Globals store identity, section visibility/order, theme, contact behavior, resume mode and AI configuration. Contact messages, chat logs and analytics events are write-only from public routes and readable only by the owner.

## Request flow

```mermaid
sequenceDiagram
  participant V as Visitor
  participant N as Next.js
  participant P as Payload
  participant G as Gemini (optional)
  V->>N: Request page
  N->>P: Read published content
  P-->>N: CMS documents
  N-->>V: Rendered page
  V->>N: Ask assistant / send contact
  N->>P: Read context / persist message
  N->>G: Grounded generation (chat only, optional)
  G-->>N: Stream response
  N-->>V: Text and source links
```
