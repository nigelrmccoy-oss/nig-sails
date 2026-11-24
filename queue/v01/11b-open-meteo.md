---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/weather.ts src/currents.ts
read: SOURCES.md
ctx: 32k
title: NS 11b: Open-Meteo Marine weather and currents fetch
---
# NS 11b · Open-Meteo Marine (no API key)

Depends on: 11a. Files you may edit: `src/weather.ts` `src/currents.ts` only.

## Goal
Wire a real fetch helper around the already-built `openMeteoMarineUrl(lat, lon)` so the app can request current wave height, period, direction, and ocean current velocity/direction from https://marine-api.open-meteo.com/v1/marine (no key). Parse the JSON into a small typed object.

## Steps
1. Add `fetchMarine(lat, lon)` (or similar) in `weather.ts` with a timeout. Use `mayPersist` + cache-first for this URL (Open-Meteo is persistable). Do not cache failed responses as success.
2. In `currents.ts`, a helper should turn one Open-Meteo response into a `CurrentSample` (no ESTIMATE flag when the value is live). Keep `demoCurrentArrows()` for the fallback; they stay **ESTIMATE**.
3. Do not edit `src/main.ts` here — 11c will hook rendering. Do not add a key-gated Copernicus download in this prompt (Copernicus often needs registration; document only).

## Acceptance
- `npm test` still checks `openMeteoMarineUrl`. `npm run build` passes.

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
