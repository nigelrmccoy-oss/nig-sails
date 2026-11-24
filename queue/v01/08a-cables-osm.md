---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-cables-osm.mjs data/cables-osm.json
read: SOURCES.md src/map/OverpassClient.ts
ctx: 32k
title: NS 08a: OSM submarine cables bake (no TeleGeography)
---
# NS 08a · OSM `submarine=yes` bake (ODbL, public Overpass)

Depends on: 07c. Files you may edit: `scripts/bake-cables-osm.mjs` `data/cables-osm.json` only.

## Goal
Implement `--go` to query **public** Overpass for `way["submarine"="yes"]` (telecom/power/pipelines may be mixed — keep tags in properties) and write a GeoJSON FeatureCollection to `data/cables-osm.json` (already a non-empty empty collection).

Public interpreter: https://overpass-api.de/api/interpreter (and the other public mirrors listed in `OverpassClient.ts`).

## Hard rules
- Do **not** use `http://127.0.0.1:12346/api/interpreter` for this global extract. That instance is Ontario-only.
- Do **not** use TeleGeography, submarinecablemap.com, or any subscriber cable atlas.
- Credit © OpenStreetMap contributors (ODbL).
- Be polite: split by bbox if needed, cooldown after failures, cap runtime with `timeout 900`. A simplified or downsampled set is fine for v0.1; document the bbox or filter.

## Steps
1. Dry run writes nothing. `--go` fills features with `name` when tagged, and a `sourceUrl`/`licence`. If the query fails, leave the stub collection in place (non-zero) and exit non-zero.
2. Do not invent landing points or routes. Missing geometry is skipped, not guessed.

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
