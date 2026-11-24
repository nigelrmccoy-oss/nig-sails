---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/bathymetry.ts src/endpoints.ts
read: SOURCES.md
ctx: 32k
title: NS 03b: NOAA NCEI coastal bathymetry hook
---
# NS 03b · NOAA NCEI coastal DEM / bathymetry hook

Depends on: 03a. Files you may edit: `src/bathymetry.ts` `src/endpoints.ts` only.

## Goal
Document and, if a **key-free public WMS or XYZ** exists, add a descriptor for NOAA NCEI coastal bathymetry (US waters, public domain) in `noaaBathyInfo()` / a new `noaaBathyWms()` helper, matching the shape of `gebcoWms()`.

Info page already listed: https://www.ncei.noaa.gov/maps/bathymetry/

## Current behaviour
- `noaaBathyInfo()` returns the info URL only. `src/layers.ts` already has a `noaa-bathy` stub (you may not edit `layers.ts` here). `main.ts` does not yet add this imagery — do not edit `main.ts` in this prompt. A later small hook can use your helper.

## Steps
1. Find an official NOAA/NCEI WMS or WMTS that does not require an API key. Put the URL in `ENDPOINTS` (or update `noaaNcei` if you find a better direct service URL) and return it from a small helper in `bathymetry.ts`.
2. If the only viewers are interactive maps with no redistributable tile endpoint, keep the status as a documented stub: helper returns `{ id, url, credit, status: 'stub' }` and a comment with the page you checked. Do not invent a tile URL.
3. Do not add Cesium ion, Google 3D Tiles, or any paid NOAA endpoint. Do not commit keys.

## Acceptance
- `npm test` and `npm run build` pass (tests import `ENDPOINTS` — do not rename existing keys used by tests, only add or refine).
- No forbidden sources.

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
