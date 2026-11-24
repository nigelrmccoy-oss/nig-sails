---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: tests/run.ts src/style.css
read: src/weather.ts src/ais.ts src/ships.ts
ctx: 32k
title: NS 13: Tests polish and UI typography tweaks
---
# NS 13 · Tests polish and light CSS cleanup

Depends on: 12c. Files you may edit: `tests/run.ts` `src/style.css` only.

## Goal
Extend `tests/run.ts` for behaviour added in earlier prompts, without testing implementation details that will churn. Light CSS polish for the layer rail, cards, and Options so text does not collide with Cesium widgets.

## Current behaviour
- Tests already cover cache/`mayPersist`, Ontario Overpass exclusion, ship mapping, DEMO labels, wreck sources, TeleGeography forbidden URLs, ports/sites/webcams source URLs, AIS parser, layer registry, and `.gitignore` / no committed `.env`.

## Steps
1. Add checks only when the symbols already exist: e.g. NDBC parser if 11a exported one, Open-Meteo fetch URL, Digitraffic helper returns an array or throws cleanly when mocked, wreck merge does not drop Titanic, `isForbiddenSource` still blocks telegeography and street view / Apple Maps if you add those substrings.
2. Do not require a live network. Do not assert against a real AISStream key. Do not import `src/main.ts` (it needs a browser + Cesium).
3. CSS: small readability tweaks only (contrast, card close button, layer rail scroll). No new UI framework.
4. `npm test` and `npm run build` must pass. Do not empty any file.

## Acceptance
- All existing tests still run. Failed count exits 1. “all tests passed” on success.

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
