---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-lights.mjs data/lights.json src/lights.ts
read: SOURCES.md src/map/OverpassClient.ts
ctx: 32k
title: NS 04b: OpenSeaMap / OSM lights and buoys bake
---
# NS 04b · Lights and buoys (OpenSeaMap / OSM, ODbL)

Depends on: 04a. Files you may edit: `scripts/bake-lights.mjs` `data/lights.json` `src/lights.ts` only.

## Goal
Bake a modest public set of lights / seamarks from OpenSeaMap or OSM into `data/lights.json`, in the existing `LightRec` shape. Credit © OpenStreetMap contributors (ODbL).

Tiles: https://t1.openseamap.org/seamark/
Project: https://www.openseamap.org/

## Current behaviour
- `data/lights.json` has two sample lights (Eddystone, Fastnet) so the file is non-empty. `lightsCollection()` already exposes them. `openSeaMapTiles()` returns the tile URL (for a later raster overlay).

## Steps
1. Implement `scripts/bake-lights.mjs --go` using **public** Overpass (not the Ontario extract) or an official OpenSeaMap export. Query a limited bbox or a documented sample (lighthouses / major seamarks), not the entire planet in one go.
2. Global bboxes must use `pickMirrors(..., ontario=false)` rules: never hit `http://127.0.0.1:12346/api/interpreter` for a worldwide query. If you call Overpass from the script, implement the same cooldown-after-3-misses idea or fail clearly.
3. Keep `data/lights.json` an array of records with `sourceUrl` and `licence: "ODbL (© OpenStreetMap contributors)"`. Do not empty the file on failure.
4. Small updates to `src/lights.ts` only if the record shape needs a field (e.g. `character` or `rangeNm`) — keep backward compatibility with the two sample lights.

## Acceptance
- Dry run (no `--go`) writes nothing and exits 0.
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
