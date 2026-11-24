---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/currents.ts src/main.ts
read: SOURCES.md
ctx: 32k
title: NS 11c: Current arrows or simple particles
---
# NS 11c · Animated currents if feasible, else live arrows

Depends on: 11b. Files you may edit: `src/currents.ts` `src/main.ts` only.

## Goal
When the `currents` layer is on, show current direction in the current camera area. Preferred: a modest set of moving particles or short arrows from Open-Meteo (and/or the ESTIMATE demo arrows if the fetch fails). This does not need a full global HYCOM playback in v0.1.

## Steps
1. Sample a few points in the current view (or a fixed small grid around the camera) and reuse `fetchMarine` / `CurrentSample` from 11b. Cap the number of requests (e.g. a handful per move, debounce camera) so we do not hammer the API.
2. Cesium: arrows via polyline / billboard / `CallbackProperty`, or a very small custom particle list. If particle animation is too heavy or unstable, static arrows with heading are acceptable — say so in a short comment.
3. Targeted `main.ts` edits only. Keep `requestRenderMode` in mind (request a render when samples update). Do not add Bing / ion / Google data.
4. OSCAR / HYCOM / WaveWatch III may stay as documented stubs in `currentSources()`.

## Acceptance
- Demo ESTIMATE arrows remain available as fallback. `npm test` and `npm run build` pass.

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
