---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/cables.ts src/main.ts
read: SOURCES.md data/cables.json
ctx: 32k
title: NS 08c: Merge open cable datasets into the cables layer
---
# NS 08c · One cables layer: historic ESTIMATE + OSM + EMODnet

Depends on: 08b. Files you may edit: `src/cables.ts` `src/main.ts` only.

## Goal
The existing `cables` checkbox should show (1) the landmark historic cables in `data/cables.json` (routes stay **ESTIMATE**), plus (2) `data/cables-osm.json` and (3) `data/cables-emodnet.json` when those collections have features. Still **no TeleGeography**.

## Current behaviour
- `cablesCollection(year)` already filters historic cables by year and marks them ESTIMATE. `main.ts` loads that collection as a GeoJSON data source. OSM/EMODnet files may still have zero features.

## Steps
1. In `src/cables.ts`, add loaders that read the two baked GeoJSON files and merge their features into a collection (or return several collections). Do not drop `estimate: true` on historic routes. Baked OSM/EMODnet features should carry their own licence/source properties, not an ESTIMATE flag unless the geometry is actually inferred.
2. Targeted `main.ts` edit to add the extra data sources under the same `cables` toggle (or sub-sources that hide together). Do not rewrite `main.ts`. Do not add a year slider unless it already exists — historic features may always show in v0.1 if that is simpler.
3. Info cards: `cableCard` / `cableCardById` should still work for historic ids. For baked features, a generic card from properties (name, source, licence) is enough — hook through `lookup.ts` only if you can do it without editing a third file; otherwise handle baked cards via properties already on the entity (main.ts already reads `kind` + `id`).

## Acceptance
- `npm test` still requires historic cables to be ESTIMATE and not TeleGeography. `npm run build` passes.

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
