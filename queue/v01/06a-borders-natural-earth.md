---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-borders.mjs src/borders.ts
read: SOURCES.md
ctx: 32k
title: NS 06a: Natural Earth country borders bake
---
# NS 06a · Natural Earth admin 0 borders

Depends on: 05b. Files you may edit: `scripts/bake-borders.mjs` `src/borders.ts` only.

## Goal
Implement `--go` on `scripts/bake-borders.mjs` to download Natural Earth 50m (or 110m if 50m is too heavy) admin 0 countries, public domain, and write `data/borders.geojson` (that file already exists as an empty FeatureCollection — do not delete it; the script may overwrite features). Add a tiny loader helper in `src/borders.ts` (e.g. `bordersCollection()` reading the geojson) without breaking `borderSources()`.

Natural Earth: https://www.naturalearthdata.com/
Zip (50m): https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip

## Steps
1. Dry run writes nothing. `--go` downloads the official zip, extracts the shapefile or geojson, and writes a simplified FeatureCollection (properties can be slim: `name`, `iso_a3`). Use a simplification tolerance if the file would be huge, and say so in a script comment (**ESTIMATE** of the coastline at that scale is inherent to 110m/50m).
2. Licence on the helper: public domain (Natural Earth).
3. If the download fails, leave `data/borders.geojson` non-empty (the stub FeatureCollection) and exit non-zero.
4. Do not edit `src/main.ts` here; the next prompt or 06b can hook the checkbox. You may mention the existing `borders` layer id.

## Acceptance
- `npm test` and `npm run build` pass. No Natural Earth tiles that are actually Google/Apple imagery — this is the cultural vector set only.

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
