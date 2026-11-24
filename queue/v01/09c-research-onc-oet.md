---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-research.mjs data/research-sites.json src/research.ts
read: SOURCES.md
ctx: 32k
title: NS 09c: Ocean Networks Canada and Nautilus / OET sites
---
# NS 09c · ONC and Ocean Exploration Trust / Nautilus sites

Depends on: 09b. Files you may edit: `scripts/bake-research.mjs` `data/research-sites.json` `src/research.ts` only.

## Goal
Add bake sources for Ocean Networks Canada (NEPTUNE, VENUS, and published nodes/cameras) and OET / E/V Nautilus expeditions. Merge into `data/research-sites.json`. Keep existing rows.

ONC: https://www.oceannetworks.ca/
Nautilus: https://nautiluslive.org/

## Steps
1. Official public pages only. Pins for cabled observatories may be **ESTIMATE** if only a region is published — say so. Nautilus dives should link to the expedition page, not a scraped stream.
2. Small `src/research.ts` tweak only if you need an extra field (e.g. `imageryUrl`). Cards must still expose `sourceUrl` and licence via `siteCard()`.
3. Dry run writes nothing. Never empty the JSON.

## Acceptance
- `npm test` and `npm run build` pass.

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
