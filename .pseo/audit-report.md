# pSEO Audit Report

Date: 2026-07-29
Audited against `.pseo/discovery-report.md` (2026-02-06).
Codebase state: commit `fb5db43` (post Astro 7 upgrade + code-review fixes).

## Framework & Rendering

- **Astro 7.1.5**, `output: 'static'` (`astro.config.mjs:12`) — pure SSG. This is
  the right architecture for pSEO; no rendering-strategy work needed.
- `site: 'https://measureover.com'` is set (`astro.config.mjs:8`), so canonical
  and sitemap URL generation are already correct.
- File-based routing. **One page total**: `src/pages/index.astro` (8 lines).
- **Zero dynamic route segments.** No `getStaticPaths` anywhere in the repo.
- No `src/pages/404.astro` — invalid slugs fall through to the Cloudflare Pages
  default 404. Needs to exist before any dynamic route ships.

## Data Architecture

- `content/` sits at the **repo root**, not `src/content/`, and holds 4 sample
  MDX files: `guides/sample-guide.mdx`, `paper-sizes/a4.mdx`,
  `use-cases/stencil-from-photo.mdx`, `glossary/scale.mdx`.
- **No content collection is configured.** There is no `src/content.config.ts`
  (the Astro 5+/7 content-layer entry point) and no `src/content/` directory.
- **`@astrojs/mdx` is not installed.** Nothing in `package.json` can parse
  `.mdx` at all. The `content/` tree is inert — not imported, not globbed, not
  referenced by a single line of code. It is a scaffold, not a data layer.
- Frontmatter is per-type by design (base fields + extension fields) and is
  internally consistent across the 4 files, but **nothing enforces it** — no Zod
  schema, no validation.
- **The strongest data asset is in code, not in `content/`:**
  - `PAPER_SIZES` — 10 sizes with exact mm dimensions (`src/utils/paperSizes.ts:3-14`)
  - 6 UI languages (`src/utils/i18n.ts:1`)
  - 3 measurement units (`src/types/index.ts:47`)
  - `convertPixelsToMM` / `convertMMToUnit` — real conversion logic
  This is genuine, accurate, first-party structured data and it is entirely
  unexploited.

**Readiness: Missing** (scaffold only; no working data layer)

## Routing & Templates

- None of the five URL patterns the discovery report proposed exist:
  `/guides/{topic}`, `/paper-sizes/{size}`, `/units/{unit}`,
  `/use-cases/{use-case}`, `/glossary/{term}`.
- No template pages, so the "unique content vs. variable-swapped boilerplate"
  question cannot yet be assessed — but see Content Quality below, because the
  4 sample files are already thin.
- No catch-all routes, so no orphan-page risk today.

**Readiness: Missing**

## SEO Foundations

Substantially repaired earlier this session, but with one severe gap.

- Canonical, Open Graph and Twitter tags: **present** (`src/layouts/Layout.astro:29-42`).
- `@astrojs/sitemap` wired; emits `dist/sitemap-index.xml` + `sitemap-0.xml`.
  **Currently contains exactly 1 URL.**
- `public/robots.txt` allows search and LLM crawlers and points at the sitemap —
  but is **overridden upstream** by Cloudflare's managed block (company-wide
  quillpond task #107). The AI-crawler Allow rules do not currently take effect.
- Google Search Console: verified via DNS TXT, sitemap submitted.
- **No JSON-LD anywhere.** `grep` for `application/ld+json`, `@context`,
  `schema.org` across `src/` and `public/` returns nothing. For a tool site the
  obvious wins are `SoftwareApplication` on the homepage and `HowTo` / `FAQPage`
  on content pages.
- `Layout.astro` accepts a `description` prop but `index.astro:6` passes only
  `title`, so every page would inherit the default description. The mechanism
  works; it is simply unused.

### ⚠️ The homepage ships 48 words of indexable text

Stripping scripts and styles from `dist/index.html` leaves **288 characters /
48 words**, and the headings are:

- `<h1>` — "MeasureOver"
- `<h2>` — "Upload Image"

The body text is the language picker, "Drag and drop an image here", and a
copyright line. Nothing states what the tool does, who it is for, what paper
sizes or units it supports, or why it is accurate. **This is the page holding
all the domain's authority and it gives Google almost nothing to rank.** It is
the single highest-value fix in this report, and it is worth more than any
number of generated pages.

### i18n is a wasted asset and a mild risk

`MeasurementApp.tsx:77-84` rewrites `document.title` and the meta description
client-side on language change. Six languages all resolve to the **same URL**,
with no `hreflang` and no per-locale routes. The translation work already done
(6 full languages in `src/utils/i18n.ts`) earns zero search visibility.

**Readiness: Needs Work** (foundations good, content and schema absent)

## Internal Linking

- **Zero `<a href>` elements in the entire `src/` tree.** No nav, no footer
  links, no breadcrumbs, no related-pages component, no hub pages.
- With one page this is invisible; at 100+ pages every page would be an orphan
  reachable only via the sitemap, which is the classic pSEO indexing failure.

**Readiness: Missing**

## Performance at Scale

- Build is trivially fast today: 1 page in ~475 ms, `dist/` is 176 KB.
- `MeasurementApp.DSOhcNbp.js` is **78 KB** and hydrates `client:load`
  (`index.astro:7`). It is scoped to the homepage only, so content pages built
  on `Layout.astro` would not ship it — **provided templates do not embed the
  app**. If they do, 78 KB of eager hydration per page will hurt INP/LCP; use
  `client:visible` or a content-only layout.
- CSS is a single 35 KB file, inlined per `inlineStylesheets: 'auto'`.
- No image optimization configured and no images used. Astro 7's `astro:assets`
  is available. Per-page OG images at scale need a generator —
  `nanshe.studio/scripts/build-og.mjs` is working prior art in this org.
- Cloudflare Pages caps a deployment at 20,000 files. At the realistic page
  counts below (see Priority Actions) this is not a constraint even with one OG
  image per page.
- No ISR/revalidation concerns — fully static.

**Readiness: Ready** (architecture is sound; nothing to fix until pages exist)

## Content Quality Safeguards

- **No safeguards of any kind.** No content-length validation, no duplicate or
  near-duplicate detection, no title/description differentiation checks, no
  `noindex` rules for thin or utility pages.
- The existing samples are **already thin**: `content/paper-sizes/a4.mdx` has
  roughly 40 words of body prose beneath its frontmatter.
- The discovery report itself rated content uniqueness "Medium" for all three
  proposed page types — that is a warning, not a green light.
- YMYL: none. Risk level low. Standard pSEO is acceptable from a policy angle;
  the risk here is thin content, not sensitive content.

**Readiness: Missing**

## Priority Actions (ordered)

1. **Rewrite the homepage as a real page.** 48 words is the binding constraint
   on this domain. Explain the tool, the workflow, supported paper sizes and
   units, and add an FAQ. Requires no new infrastructure.
2. **Install `@astrojs/mdx` and define a content collection** in
   `src/content.config.ts`, moving `content/` to `src/content/` (or pointing a
   glob loader at it) with a Zod schema per type. Until this lands, `content/`
   is decoration.
3. **Ship `/paper-sizes/{size}` first** — 10 pages generated from the real
   `PAPER_SIZES` data. Genuinely useful, factually unique per page, zero
   invention required. It proves the whole pipeline end to end at low risk.
4. **Add JSON-LD**: `SoftwareApplication` on the homepage, `FAQPage` and `HowTo`
   on content pages.
5. **Build internal linking and breadcrumbs before scaling past ~20 pages**, not
   after.
6. **Add a quality gate** (min word count, duplicate-title/description
   detection) before generating beyond ~50 pages.
7. **Decide the i18n URL strategy.** Either commit to `/{lang}/...` routes with
   `hreflang`, or drop the client-side title rewriting. The current state gets
   the cost of six languages and the benefit of none.
8. Add `src/pages/404.astro`.

## Feasibility check against the discovery report

The discovery report framed this as a 1000+ page opportunity. **The codebase and
the subject matter do not support that, and pursuing it would produce thin
content.** Honest inventory:

| Proposed type | Discovery estimate | Defensible reality |
|---|---|---|
| Paper sizes | 20–60 | **10** — that is how many exist in `PAPER_SIZES` |
| Units | (implied) | **3**, or ~30 as size×unit combinations, most marginal |
| Glossary | — | ~30–50 real drawing/measurement terms |
| Guides | 50–200 | 20–40 that justify their own page; each needs real writing |
| Use cases | 30–100 | 20–40, same caveat |

Realistic ceiling for pages that genuinely deserve to exist: **roughly 100–150**,
and most of that is written content, not templated permutations. That is a
worthwhile content site. It is not a 1000-page programmatic play, and the
`pseo-scale` skill (10K–100K pages, database-backed, crawl-budget management) is
not applicable here.

## Recommended Skill Sequence

1. **`pseo-data`** — content model, collection config, MDX wiring, slug strategy.
   This is the true blocker; everything else depends on it.
2. **`pseo-templates`** — dynamic routes, starting with `/paper-sizes/{size}`.
3. **`pseo-schema`** — JSON-LD. (`pseo-metadata` is largely satisfied already:
   canonical, OG, Twitter and sitemap all landed this session. Revisit only for
   per-page descriptions once templates exist.)
4. **`pseo-linking`** — hub-and-spoke, breadcrumbs, related pages.
5. **`pseo-quality-guard`** — run before scaling, and again before each batch.
6. **`pseo-llm-visibility`** — high value given the org's stated LLM-citation
   goals, but partially blocked by quillpond task #107 (Cloudflare's managed
   robots.txt overriding the AI-crawler rules). `llms.txt` is absent.

**Not recommended:** `pseo-scale` — built for 10K+ pages; this site's honest
ceiling is ~150.
