# kura-architecture-example

Example [Eleventy](https://www.11ty.dev/) site reading from a [kura](https://kuracms.com)
content backend. A small Copenhagen architecture practice demo at
[hagen.kuracms.com](https://hagen.kuracms.com).

## How it works

1. `fetch-content.sh` pulls published `project`, `partner` and `page` entries
   from the kura API and writes them to `_data/*.json`.
2. Eleventy reads those JSON files as global data and renders Nunjucks
   templates in `src/` into `_site/`.
3. `_site/` is shipped to Cloudflare Workers Assets via Wrangler.

## Build locally

```bash
npm install
export KURA_TOKEN=<your token>
./fetch-content.sh
npx @11ty/eleventy
```

Output lands in `_site/`.

## Deploy

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
npx wrangler deploy
```
