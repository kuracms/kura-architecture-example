#!/usr/bin/env bash
# Pulls published content from kura and writes it into _data/*.json so the
# Eleventy build can read it as global data (projects, partners, pages).

set -euo pipefail

KURA_BASE="${KURA_BASE_URL:-https://kuracms.com}"
KURA_PROJECT="${KURA_PROJECT:-architecture}"
KURA_TOKEN="${KURA_TOKEN:?KURA_TOKEN must be set}"

mkdir -p _data

fetch_type() {
	local type="$1"
	local outfile="$2"
	local sort_key="$3"

	curl -fsSL \
		-H "Authorization: Bearer ${KURA_TOKEN}" \
		"${KURA_BASE}/api/v1/${KURA_PROJECT}/${type}?limit=50" \
		>"_data/${type}-raw.json"

	python3 -c "
import json
with open('_data/${type}-raw.json') as f:
    body = json.load(f)
items = [r for r in body['data'] if r.get('published')]
items.sort(key=lambda r: r.get('${sort_key}') or 0)
with open('${outfile}', 'w') as f:
    json.dump(items, f, indent=2)
print(f'Wrote {len(items)} ${type}')
"
	rm -f "_data/${type}-raw.json"
}

fetch_type project _data/projects.json sort_order
fetch_type partner _data/partners.json name
fetch_type page _data/pages.json slug
