---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-research.mjs data/research-sites.json
read: SOURCES.md
ctx: 32k
title: NS 09b: Schmidt Ocean Institute and MBARI sites
---
# NS 09b · Schmidt Ocean Institute and MBARI research sites

Depends on: 09a. Files you may edit: `scripts/bake-research.mjs` `data/research-sites.json` only.

## Goal
Add `--source=soi` and `--source=mbari` (or one `--source=soi-mbari`) to the bake script so `--go` appends publicly listed expedition or observatory sites from those organisations. Do not delete NOAA or fixture rows.

SOI: https://schmidtocean.org/
MBARI: https://www.mbari.org/

## Steps
1. Use official public lists (expedition maps, data catalogues, observatory pages). Each card `sourceUrl` should open the organisation's imagery or expedition page. **Link out; do not scrape video or members-only galleries.**
2. Same record shape as 09a. Short factual notes. **ESTIMATE** only for a clearly labelled regional pin (the fixture already has a placeholder eastern Pacific SOI pin — replace it with real expeditions when you have coordinates, otherwise leave it).
3. Respect site terms: if a dataset is not clearly reusable, store only name, public URL, and a coordinate the organisation itself publishes.
4. Dry run writes nothing. Never empty `data/research-sites.json`.

## Acceptance
- `npm test` and `npm run build` pass. `allSites().length` must not fall below 6.

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
