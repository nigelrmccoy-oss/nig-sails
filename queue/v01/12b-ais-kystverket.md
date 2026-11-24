---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/ais.ts src/endpoints.ts
read: SOURCES.md
ctx: 32k
title: NS 12b: Norway Kystverket / open AIS fallback
---
# NS 12b · Norway open AIS fallback

Depends on: 12a. Files you may edit: `src/ais.ts` `src/endpoints.ts` only.

## Goal
Add a helper for Norway’s publicly documented coastal AIS (Kystverket / BarentsWatch or the official successor named in their docs). Use it as the next fallback after Digitraffic, before DEMO-only mode.

Docs starting point: https://www.kystverket.no/en/navigation-and-monitoring/ais/

## Steps
1. Find the official open API or feed URL from that page or a clearly linked operator doc. Put it in `ENDPOINTS` (you may add keys; do not rename `digitrafficAis` or `aisstreamWs` if tests depend on them). `KYSTVERKET_DOCS` already exists.
2. Map records to `AisShip` (`demo: false`, `modelForAis`). Timeout, no API key in the repo. If the feed requires registration or forbids this use, keep a documented stub helper that returns `null` / empty and explains why in a comment — do not invent a URL and do not scrape a map tile.
3. Do not edit `src/main.ts` here unless absolutely necessary (you may not if it is not in `files:` — so export a `fetchKystverket()` that 12c or a tiny later hook can call). Status: leave a clearly named export so 12c can wire it.
4. Never log tokens. No MarineTraffic.

## Acceptance
- `npm test` and `npm run build` pass.

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
