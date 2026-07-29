# Deployment Guide

MeasureOver is a static Astro site deployed to **Cloudflare Pages**
(project `measureovercom`, custom domain `measureover.com`).

## How deploys happen

Push to `main` → GitHub Actions builds, typechecks, and deploys.

`.github/workflows/deploy.yml` runs two jobs:

| Job | Runs on | What it does |
|---|---|---|
| `build` | push, PR, manual | `npm ci` → `npm run typecheck` → `npm run build`, uploads `dist` |
| `deploy` | `main` only | downloads `dist`, `wrangler pages deploy` to Cloudflare |

Pull requests stop at the build gate — they typecheck and build but never
deploy. A failing typecheck blocks the deploy; this is deliberate.

### Required GitHub secrets

| Secret | Value | Status |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `011b26b9508cc73bb2aeadb58d8e542c` | set |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token, **Account → Cloudflare Pages → Edit** | **must be created** |

Create the token at https://dash.cloudflare.com/profile/api-tokens
(template: "Edit Cloudflare Workers", or a custom token with just
`Account · Cloudflare Pages · Edit`), then:

```sh
gh secret set CLOUDFLARE_API_TOKEN --body '<token>'
```

The `deploy` job fails without it. The `build` job does not need it.

### ⚠️ Disconnect the Cloudflare Pages git integration

The Pages project was originally connected directly to GitHub, so
Cloudflare **also** builds on every push. With the Actions workflow in
place that means two builds and two deploys racing per commit.

Fix it once, in the dashboard: **Pages → measureovercom → Settings →
Builds & deployments → Git integration → Disconnect**. Actions then owns
deployment.

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

Note: Cloudflare prepends its own "managed content signals" block to the
served `robots.txt`. Ours is appended after it.

### Google Search Console — remaining setup

Verification is **not yet done**. It needs two things this repo can't
supply:

1. The TXT verification string from Search Console
   (Add property → Domain → `measureover.com` → copy the
   `google-site-verification=...` value).
2. A Cloudflare API token with **Zone → DNS → Edit** on `measureover.com`.
   The local wrangler OAuth grant is `zone:read` only and returns
   `Authentication error` on the DNS endpoint.

Then either add the TXT record in the Cloudflare dashboard (DNS → Records
→ Add → TXT, name `@`), or run:

```sh
curl -X POST \
  "https://api.cloudflare.com/client/v4/zones/d9c7c329234ca83155ba9f2997a934a7/dns_records" \
  -H "Authorization: Bearer $CF_DNS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"TXT","name":"@","content":"google-site-verification=<VALUE>","ttl":1}'
```

After it verifies, submit `https://measureover.com/sitemap-index.xml`
under **Sitemaps**.

## Product factory (quillpond.com)

`scripts/post-to-factory.sh` posts status updates to the Skadi product
factory. Property slug is in `.factory-property` (`measureovercom`).

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
