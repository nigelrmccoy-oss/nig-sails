---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/weather.ts src/main.ts
read: SOURCES.md data/buoys.json
ctx: 32k
title: NS 11a: Live NOAA NDBC buoy observations in cards
---
# NS 11a · NDBC live text feed on buoy cards

Depends on: 10. Files you may edit: `src/weather.ts` `src/main.ts` only.

## Goal
When a user opens a buoy info card, fetch the public NOAA NDBC realtime text for that station (e.g. https://www.ndbc.noaa.gov/data/realtime2/41001.txt) and show a few latest fields (wind, WSPD, GST, WVHT, DPD, PRES, ATMP, WTMP as available). US public domain. Cache-first via `cachedFetch` / `cacheGet`+`cachePut` with a short TTL if easy; `mayPersist` must still block ion/Bing/Google.

## Current behaviour
- `data/buoys.json` has five NDBC stations. `buoyCard()` already lists the realtime URL in `extra.Feed`. `main.ts` already shows the card from `cardFor('buoy', id)`.

## Steps
1. Add a small parser in `weather.ts` for the NDBC standard text table (header + rows). Be defensive: missing columns, `#` comments, 999 / MM missing values.
2. Targeted `main.ts` hook: after `card.show(buoyCard(...))`, optionally refresh the card with live extras. If the fetch fails, keep the static card and a “NDBC feed unavailable” note. Do not rewrite `main.ts`.
3. Do not block the UI on a hung request — use a timeout. Kill any test server you start.

## Acceptance
- Parser is unit-testable in principle; if you need a test, you may not add `tests/run.ts` here — keep the parser pure so 13 can test it. `npm test` and `npm run build` pass today.

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
