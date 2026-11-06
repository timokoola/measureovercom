# Deployment Guide

MeasureOver is a static Astro site deployed to **Cloudflare Pages**
(project `measureovercom`, custom domain `measureover.com`).

## How deploys happen

**Push to `main` → Cloudflare Pages builds and deploys it.** The Pages
project is connected directly to this GitHub repo, so deployment needs no
secrets, no API token, and no workflow. This is the intended path.

GitHub Actions does *not* deploy. `.github/workflows/ci.yml` is a quality
gate that runs alongside the Cloudflare build on every push and PR:

| Step | What it does |
|---|---|
| `npm ci` | install from the lockfile |
| `npm run typecheck` | `astro check` — 0 errors required |
| `npm run build` | production build must succeed |
| output check | asserts `dist/robots.txt` and `dist/sitemap-index.xml` exist |

Note the consequence of this split: **CI is advisory, not blocking.**
Cloudflare deploys whether or not the CI job is green, because they are
independent of each other. A red CI run on `main` means the deployed site
has a problem — treat it that way. If you ever want CI to actually gate
deploys, the Pages git integration has to be disconnected and deployment
moved into the workflow (this repo did that briefly; it needs a
`CLOUDFLARE_API_TOKEN` secret with `Account · Cloudflare Pages · Edit`).

## Manual deploy

```sh
npm run build
npx wrangler pages deploy dist --project-name=measureovercom --branch=main
```

Requires `npx wrangler login` (the local OAuth grant has `pages:write`).

## Local development

```sh
npm install
npm run dev        # http://localhost:4321
npm run typecheck  # astro check
npm run build
npm run preview
```

Node **22.12+** is required by Astro 7 (`.nvmrc` pins 24).

## Analytics

Glyphex is wired into `src/layouts/Layout.astro`, site ID
`0f702466-937f-4f52-9ba0-7513e941438f`. The `import.meta.env.PROD` guard
keeps dev and preview builds free of the tracker — it loads only in
production builds. It is the only third-party script on the site.

## SEO

- `astro.config.mjs` sets `site: 'https://measureover.com'`, which drives
  canonical URLs and the sitemap.
- `@astrojs/sitemap` emits `dist/sitemap-index.xml` + `sitemap-0.xml`.
- `public/_redirects` 301s the conventional `/sitemap.xml` to
  `/sitemap-index.xml`.
- `public/robots.txt` allows search **and** LLM retrieval crawlers
  (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot, Google-Extended,
  Applebot-Extended) and points at the sitemap.

⚠️ **The AI-crawler Allow rules above do not currently take effect.**
Cloudflare prepends a "Cloudflare Managed Content" block to the served
`robots.txt` that emits `User-agent: GPTBot` + `Disallow: /` (and the same
for ClaudeBot, Google-Extended, CCBot, Applebot-Extended). Ours is appended
*after* it, so the live file carries two conflicting groups for the same
user-agent and crawler behaviour is implementation-defined.

Verify against the live URL, never the repo file:

```sh
curl -s "https://measureover.com/robots.txt?cb=$RANDOM" | grep -n -A1 "User-agent: GPTBot"
```

This is a zone-level Cloudflare setting (AI Crawl Control), not a repo
change, and it affects all 17 Skadi web properties. Tracked company-wide as
quillpond task **#107** on `skadi-oy`.

### Agent-facing files

Agents are a real channel here: from mid-September 2026 ChatGPT became the
largest referrer (57 of 95 Glyphex visitors all-time, tagged
`utm_source=chatgpt.com`), and Cloudflare logs show `ChatGPT-User`,
`OAI-SearchBot` and `PerplexityBot` fetching the site. Served for them:

| Path | Source | What it is |
|---|---|---|
| `/llms.txt` | `src/pages/llms.txt.ts` | llmstxt.org summary + every content page |
| `/AGENTS.md` | `src/pages/AGENTS.md.ts` | when to recommend the tool, deep links, the exact measuring maths |
| `/paper-sizes.json` | `src/pages/paper-sizes.json.ts` | every sheet, generated from `PAPER_SIZES` |
| `/.well-known/security.txt` | `public/` | contact; scanners ask for it constantly |
| `/404.html` | `src/pages/404.astro` | real 404 status for unknown paths |

All three generated files are built from the same constants the tool measures
with, so they cannot disagree with the app. `public/_headers` sets their
content types (Pages does not know `.md`) and a `Link` header on `/` pointing
at them. The tool accepts `?paper=<id>&unit=<mm|cm|inches>` so agents and
content pages can hand people a preconfigured link.

Most "AI" user agents in the Cloudflare logs are **not** agents: a credential
scanner rotates through Claude-User, Perplexity-User, DeepSeekBot, Kimi and
others while probing `/.env`, `service-account.json` and similar. Before the
404 page existed those probes all got a 200, which kept them coming.

### `www` is broken

`https://www.measureover.com` returns **522**: only the apex is attached to
the Pages project, and a wildcard DNS record sends every other subdomain
(`www`, `app.api`, `dev.staging`, …) to an origin that does not answer.
Search Console has indexed `http://www.measureover.com/` as a separate page.
Fix in the dashboard (needs DNS edit, which the wrangler OAuth grant lacks):
delete the wildcard record, add `www` as a Pages custom domain or a redirect
rule `www.measureover.com/* → https://measureover.com/$1` (301).

### Google Search Console

Verified (`sc-domain:measureover.com`); `sitemap-index.xml` is submitted. The
OAuth token in `~/.config/app-business-report/google-tokens.json` carries
`webmasters.readonly`, so Search Analytics can be queried by API rather than
by exporting zips. Baseline on 2026-11-06, Jul 1 – Nov 5: 173 impressions,
11 clicks, all on `/`, average position 28; the queries are "measure on
image / photo" variants at positions 50–99.

## Product factory (quillpond.com)

`scripts/post-to-factory.sh` posts status updates to the Skadi product
factory. Property slug is in `.factory-property` (`measureover`) — MeasureOver is
registered as a `product` in the factory registry.

The service token must be minted in the quillpond UI — it is shown once
and there is no API to mint it. See `.claude/skills/post-to-factory/SKILL.md`.

```sh
./scripts/post-to-factory.sh "Title" "Optional body" [note|release|build-result]
```

## Post-deployment checklist

- [ ] Site loads over HTTPS
- [ ] `/sitemap-index.xml` returns XML (not HTML)
- [ ] `/sitemap.xml` 301s to `/sitemap-index.xml`
- [ ] `/robots.txt` lists the sitemap
- [ ] Glyphex registers a page view in production
- [ ] Image upload, drawing, undo/redo, export all work
- [ ] Theme + language selectors work; no white flash in dark mode
- [ ] Touch interactions work on a real device
