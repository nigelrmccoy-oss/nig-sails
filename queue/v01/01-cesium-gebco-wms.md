---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/bathymetry.ts src/main.ts
read: SOURCES.md src/map/MapCache.ts
ctx: 32k
title: NS 01: Confirm GEBCO WMS on the Cesium globe
---
# NS 01 · GEBCO bathymetry WMS

Depends on: none. Files you may edit: `src/bathymetry.ts` `src/main.ts` only.

## Goal
The Cesium globe shows **GEBCO** bathymetry (public domain) as a WMS imagery layer, toggled by the existing `gebco` layer checkbox (default on). Confirm the live layer name against the official capabilities document, and keep OSM as the base layer (ODbL credit already in `main.ts`).

WMS: https://wms.gebco.net/mapserv
Docs: https://www.gebco.net/data-products/gebco-web-services/web-map-service

## Current behaviour
- `gebcoWms()` in `src/bathymetry.ts` already returns `url: ENDPOINTS.gebcoWms` and `layers: 'GEBCO_LATEST'`.
- `src/main.ts` already adds that WMS with `WebMapServiceImageryProvider` and `baseLayer` set to OSM (the Cesium 1.147 `imageryProvider: false` pitfall is already avoided — do not revert to that).
- `mayPersist('https://wms.gebco.net/mapserv?layer=GEBCO_LATEST')` must stay true; Ion / Bing / Google 3D Tiles must stay false. Do not weaken `mayPersist`.

## Steps
1. Fetch GetCapabilities (or read the public docs) enough to confirm the correct layer name. If `GEBCO_LATEST` is wrong, change it in `gebcoWms()` only. If the service is down, leave `GEBCO_LATEST` and a short comment pointing at the docs — do not invent a layer name.
2. If a request fails at runtime, the OSM base map must remain visible. You may set a small HUD/footer note “GEBCO WMS not loaded” with a targeted edit in `main.ts` (do not rewrite the file).
3. Do not add Cesium ion terrain or Bing imagery. Keep `Cesium.Ion.defaultAccessToken = ''` and `EllipsoidTerrainProvider` unless a later prompt says otherwise. GEBCO here is a colour WMS, not a 3D tile persistent cache of ion data.

## Acceptance
- `npm test` and `npm run build` pass. Existing cache tests still pass.
- No new key-gated services. No TeleGeography.

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
