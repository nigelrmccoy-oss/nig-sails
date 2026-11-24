---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/bathymetry.ts src/main.ts
read: SOURCES.md
ctx: 32k
title: NS 03a: EMODnet bathymetry WMS toggle
---
# NS 03a · EMODnet Bathymetry WMS

Depends on: 01. Files you may edit: `src/bathymetry.ts` `src/main.ts` only.

## Goal
The existing `emodnet-bathy` layer checkbox (default off) shows EMODnet Bathymetry as a WMS overlay when enabled. Credit CC BY 4.0.

WMS: https://ows.emodnet-bathymetry.eu/wms
Program: https://emodnet.ec.europa.eu/en/bathymetry

## Current behaviour
- `emodnetBathyWms()` already uses `layers: 'mean_multicolour'` and is added in `main.ts` with `show` bound to `enabled['emodnet-bathy']`.

## Steps
1. Confirm the layer name from GetCapabilities or the public layer list. If `mean_multicolour` is wrong, change it in `emodnetBathyWms()` only. If the service is down, leave the current name and a short comment with the docs URL.
2. Keep this layer off by default (the registry in `src/layers.ts` already says so — do not edit `layers.ts` in this prompt).
3. If both GEBCO and EMODnet are on, stacking is fine; do not hide OSM. Targeted `main.ts` edits only if show/hide is broken.
4. Do not persist EMODnet tiles in a way that bypasses `mayPersist`. EMODnet is allowed if the URL is not Bing / ion / Google 3D Tiles.

## Acceptance
- `npm test` and `npm run build` pass. Footer/SOURCES already mention EMODnet — do not invent a different licence.

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
