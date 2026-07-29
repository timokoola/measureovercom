# Content

Source data for the programmatic SEO pages. Writing a page means adding a file
here — no application code is involved.

```
content/
  guides/        step-by-step walkthroughs   → /guides/{slug}/
  use-cases/     real jobs people do         → /use-cases/{slug}/
  glossary/      term definitions            → /glossary/{slug}/
  paper-sizes/   OPTIONAL prose overlays     → /paper-sizes/{slug}/
```

## The slug is the filename

`content/guides/measure-from-photo.mdx` becomes `/guides/measure-from-photo/`.
There is no `slug:` frontmatter field — the filesystem already guarantees
uniqueness, and a second source of truth would only let the two disagree.

Filenames must be lowercase letters, digits and single hyphens.

## Paper sizes are generated, not authored

The ten paper-size pages are built from `PAPER_SIZES` in
`src/utils/paperSizes.ts` — the same constant the measuring tool uses. Every
dimension, aspect ratio, 300 DPI pixel size and the default FAQs come from
there, so a page cannot contradict the app.

An MDX file in `content/paper-sizes/` is an **optional overlay** that adds
prose and may override the summary, title, FAQs and use-case list. Nine of the
ten sheets have no file at all and still get a complete page.

**Never restate dimensions in frontmatter.** That is how the page and the tool
start disagreeing.

## Required frontmatter

Every authored page needs `title`, `metaDescription`, `summary` and
`lastUpdated`. Per-type extras (`difficulty`, `useCase`, `term`, …) are defined
in `src/data/schemas.ts`, which is the single source of truth — Astro validates
against it at build time and `npm run validate:content` applies exactly the same
rules.

Length limits are enforced, not advisory:

| Field | Limits | Why |
|---|---|---|
| `title` | 15–65 chars | longer gets truncated in search results |
| `metaDescription` | 70–165 chars | same |
| `summary` | 60+ chars | it is the lead paragraph and the hub-card text |

## Linking

`related:` accepts `slug` for the same category or `category/slug` across
types. Every reference is checked — a typo fails the build rather than
producing a dead link. A page nothing links to is reported as an orphan
warning.

## Before committing

```sh
npm run validate:content
```

Checks the schema, slug validity, cross-category slug collisions, that every
`related:` reference resolves, orphans, and the length of the *generated*
paper-size titles and descriptions (which no schema covers).

## Drafts

`draft: true` hides a page in production builds while leaving it visible in
`npm run dev`.
