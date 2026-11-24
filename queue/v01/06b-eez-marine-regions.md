---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-eez.mjs src/borders.ts src/main.ts
read: SOURCES.md
ctx: 32k
title: NS 06b: Marine Regions EEZ layer hook
---
# NS 06b · Maritime EEZ (Marine Regions / VLIZ)

Depends on: 06a. Files you may edit: `scripts/bake-eez.mjs` `src/borders.ts` `src/main.ts` only.

## Goal
Give the existing `eez` and `borders` checkboxes real data. Prefer Marine Regions WMS for EEZ (credit VLIZ / Marine Regions) so you do not have to commit a huge global EEZ polygon file. If a small open extract is clearly licensed, `bake-eez.mjs --go` may write `data/eez.geojson` (already a non-empty empty-collection stub).

WMS: https://geo.vliz.be/geoserver/MarineRegions/wms
Site: https://www.marineregions.org/

## Steps
1. Confirm a public EEZ layer name from GetCapabilities. Add `eezWms()` (or similar) in `src/borders.ts` next to `borderSources()`.
2. Targeted `main.ts` hook: when `enabled.eez` is on, show that WMS (or a GeoJSON data source if you baked a small file). When `enabled.borders` is on, load `data/borders.geojson` if it has features (from 06a); if it is still empty, skip quietly.
3. Always show the Marine Regions credit when the EEZ layer is on. Do not present EEZ lines as a legal advice product.
4. Dry-run bake writes nothing. Do not empty `data/eez.geojson`.

## Acceptance
- `npm test` and `npm run build` pass. Small, targeted `main.ts` edits only.

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
