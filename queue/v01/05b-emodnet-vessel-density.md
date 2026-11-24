---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/shipping.ts src/endpoints.ts src/main.ts
read: SOURCES.md data/density-meta.json
ctx: 32k
title: NS 05b: EMODnet vessel-density WMS hook + ESTIMATE lanes
---
# NS 05b · EMODnet vessel density hook

Depends on: 05a. Files you may edit: `src/shipping.ts` `src/endpoints.ts` `src/main.ts` only.

## Goal
Expose EMODnet Human Activities **vessel density** as a documented WMS descriptor and, with a small targeted hook in `main.ts`, let the existing `density` layer checkbox (default off) add that imagery when the service is available. Keep the **ESTIMATE** corridor polylines on the `lanes` layer as they are.

WMS: https://ows.emodnet-humanactivities.eu/wms
Credit CC BY 4.0.

## Current behaviour
- `densitySources()` already lists the World Bank catalog and the EMODnet WMS URL. `ENDPOINTS.emodnetVesselDensity` is set. `main.ts` loads `lanesCollection()` but does not yet add a density WMS.

## Steps
1. Add a small helper in `shipping.ts`, e.g. `vesselDensityWms()`, returning `{ url, layers, credit }` once you confirm a valid layer name from GetCapabilities or the public layer list. If you cannot confirm the name, keep a stub helper with the docs URL and do not invent a layer.
2. In `main.ts`, add the WMS only if the helper has a real `layers` value; bind `show` to `enabled.density`. Do not rewrite `main.ts`.
3. Leave ESTIMATE lane lines in place. Do not present ESTIMATE centerlines as official routing schemes.

## Acceptance
- `npm test` and `npm run build` pass. Tests already require `densitySources().length >= 2`.

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
