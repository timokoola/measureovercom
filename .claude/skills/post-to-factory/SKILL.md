---
name: post-to-factory
description: Post an update from this repo to the Skadi product factory (quillpond.com) — status notes, releases, review outcomes, build results. Use when work worth recording lands in this repo, when the user says "post to factory", or at the end of a session that changed the product.
---

# Post to factory

The product factory at https://quillpond.com is the source of truth for
Skadi's portfolio: registry, per-product task lists, and the updates feed.
This skill posts updates so the status panel stays live.

## Setup (once per repo)

Done for this repo except the token itself:

- Property slug lives in `.factory-property` → `measureover`.
  (Verify against `GET /api/registry/properties`; the API rejects an
  unknown slug, so fix the file if the registry uses a different one.)
- `.factory-token` is already in `.gitignore`.
- `scripts/post-to-factory.sh` is installed and executable.

Remaining step: mint a **service token** at https://quillpond.com/tokens/
with scopes `updates:write` + `registry:read`, named `measureover`.
The plaintext is shown exactly once. Save it as:

```sh
printf '%s' '<token>' > .factory-token && chmod 600 .factory-token
```

Or export `FACTORY_TOKEN` in the environment instead.

## Posting an update

```sh
./scripts/post-to-factory.sh "One-line title of what happened" "Optional longer body"
```

Or directly:

```sh
curl -sS -X POST https://quillpond.com/api/feed/updates \
  -H "Authorization: Bearer $(cat .factory-token 2>/dev/null || echo "$FACTORY_TOKEN")" \
  -H "Content-Type: application/json" \
  -d '{"property": "<slug>", "kind": "note", "title": "...", "body": "..."}'
```

`kind` is one of: `note` (default), `release`, `build-result`.
(`status-change`, `review-run`, and `task-done` are posted by the factory
itself — don't use them from here.)

## What deserves an update

- A release or TestFlight build went out (`release`)
- A meaningful feature landed or a decision was made (`note`)
- CI/tests ran with a result worth recording (`build-result`)

One line is enough. The panel shows the latest update per product —
write the title for that context.
