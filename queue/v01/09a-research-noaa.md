---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-research.mjs data/research-sites.json
read: SOURCES.md
ctx: 32k
title: NS 09a: NOAA Ocean Exploration / Okeanos sites bake
---
# NS 09a · NOAA Ocean Exploration and Okeanos dive sites

Depends on: 08c. Files you may edit: `scripts/bake-research.mjs` `data/research-sites.json` only.

## Goal
Extend the dry-run `scripts/bake-research.mjs` so `--go --source=noaa` (or a clearly documented default) appends publicly listed NOAA Ocean Exploration / Okeanos expedition or dive locations to `data/research-sites.json` without deleting the existing curated rows (Mariana, Titanic-OE, etc.).

Portal: https://oceanexplorer.noaa.gov/

## Steps
1. Prefer an official NOAA index, CSV, or expedition page list that you can cite. Cards must link to the public imagery / expedition page (no scraping of video).
2. Keep the record shape: `id`, `name`, `org`, `lat`, `lon`, `year`, `notes`, `sourceName`, `sourceUrl`, `licence`. US public domain for NOAA text/facts. Short factual notes only — do not paste long cruise reports.
3. Do not invent coordinates. If an expedition is named but has no public point, skip it or pin a clearly labelled **ESTIMATE** region and say so.
4. Merge by `id`. Failed downloads must not truncate the JSON to 0 bytes. Dry run writes nothing.

## Acceptance
- Existing sites remain. `npm test` requires `allSites().length >= 6`. `npm run build` passes.

## Global rules
- Do not push. Do not commit (the queue commits after gates). Do not touch `main`/`master`.
- Do not edit hydro-lines, wwtp-na, cable-globe, grid-globe, ontario-air, or any repo other than this one (`nig-sails`).
- Edit only the files listed in `files:`. If you need a test update, it must already be in `files:`.
- Work on nigian. No Cursor, no cloud, no secrets in the repo. Never print, log, or commit `AISSTREAM_API_KEY` or the contents of `~/.config/nig-sails/aisstream.env`.
- Public sources only. Mark **ESTIMATE** and **CONFLICT**. Do not invent coordinates, depths, or dates. No TeleGeography, Street View, or Apple Maps.
- Never touch the overpass-ontario container. Ontario OSM uses `http://127.0.0.1:12346/api/interpreter` first, then public mirrors. After 3 missed tiles, cool that mirror. The Ontario extract must not be used for a China or global bbox.
- Cache: 16 GB LRU, IndexedDB + `navigator.storage.persist()`, version-prefixed keys, cache-first, size + Clear in Options. Never persist Bing, Cesium ion, or Google 3D Tiles.
- Wrap heavy runs in `flock /tmp/nigian-heavy-tests.lock timeout 900 <cmd>`. Kill any server you start.
- `npm test` and `npm run build` must still pass. Do not empty any file (emptygate). Do not rewrite a whole large file, especially `src/main.ts` — make small targeted edits.
- Large downloads belong in bake scripts (`scripts/bake-*.mjs`), not pasted inline in source or prompts.
- Keep the unofficial / not-affiliated wording.
