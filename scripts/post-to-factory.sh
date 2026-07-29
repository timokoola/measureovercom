#!/bin/bash
# Post an update to the Skadi product factory.
#   post-to-factory.sh "title" ["body"] [kind]
# Token: .factory-token at repo root, or $FACTORY_TOKEN.
# Property slug: $FACTORY_PROPERTY, or the "property" file next to the token.
set -euo pipefail

TITLE="${1:?usage: post-to-factory.sh \"title\" [\"body\"] [kind]}"
BODY="${2:-}"
KIND="${3:-note}"

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TOKEN="${FACTORY_TOKEN:-$(cat "$ROOT/.factory-token")}"
PROPERTY="${FACTORY_PROPERTY:-$(cat "$ROOT/.factory-property")}"

curl -sS -f -X POST https://quillpond.com/api/feed/updates \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c 'import json,sys; print(json.dumps({"property": sys.argv[1], "kind": sys.argv[2], "title": sys.argv[3], "body": sys.argv[4]}))' \
        "$PROPERTY" "$KIND" "$TITLE" "$BODY")" \
    > /dev/null
echo "posted to factory: $TITLE"
