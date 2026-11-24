---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/ais.ts src/main.ts
read: SOURCES.md tools/ais-proxy.mjs
ctx: 32k
title: NS 12a: Finland Digitraffic AIS fallback
---
# NS 12a · Digitraffic open AIS when the proxy is down

Depends on: 11c. Files you may edit: `src/ais.ts` `src/main.ts` only.

## Goal
If the local AISStream proxy (`http://127.0.0.1:5191/health`) is not up or has no key, fetch Finland’s open Digitraffic AIS locations and show those ships (plus DEMO ships if you want a global fallback, still labelled DEMO). Docs: https://www.digitraffic.fi/en/marine-traffic/  Feed: https://meri.digitraffic.fi/api/ais/v1/locations

## Current behaviour
- `startAis()` in `main.ts` already checks proxy health, always places DEMO ships, and sets the KPI/status text. `parseAisStreamMessage` handles AISStream-shaped JSON. `DIGITRAFFIC_URL` is exported.

## Steps
1. Add a `fetchDigitraffic()` helper in `src/ais.ts` that maps the public JSON into `AisShip` (`demo: false`, `modelForAis`, names from the feed). Timeout and treat HTTP errors as “unavailable”.
2. Targeted `main.ts` change in `startAis()`: if `proxyUp` is false, try Digitraffic; set `aisMode` / `#kpiAis` / `#aisStatus` accordingly. Do not log or request an AISStream key from the browser when using this fallback.
3. Respect Digitraffic’s terms and rate limits (documented User-Agent, no tight polling — a periodic refresh of tens of seconds is enough).
4. Never commit a key. Do not talk to MarineTraffic.

## Acceptance
- DEMO names still match `/DEMO/` in tests. `npm test` and `npm run build` pass.

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
