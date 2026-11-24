---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/wrecks.ts src/lookup.ts
read: SOURCES.md data/wrecks.json data/wrecks-awois.json
ctx: 32k
title: NS 07c: Merge wreck fixtures into cards
---
# NS 07c · Merge Wikidata + AWOIS wrecks into the card layer

Depends on: 07b. Files you may edit: `src/wrecks.ts` `src/lookup.ts` only.

## Goal
`allWrecks()` / `wrecksCollection()` should include both `data/wrecks.json` and, when it has records, `data/wrecks-awois.json`. Deduplicate only when you can do so safely (same id, or a clearly identical name + near position). Info cards must still have name, date, depth, source link, and licence. Keep Titanic and the other curated cards.

## Current behaviour
- `src/wrecks.ts` loads only `wrecks.json`. `cardFor('wreck', id)` uses `wreckCardById`. Tests require `allWrecks().length >= 15` and Titanic.

## Steps
1. Import the AWOIS JSON (it may still be an empty array). Concatenate after the curated list, skipping empty/invalid coords.
2. If two records look like the same wreck but disagree on position or date, keep both or keep the curated one and mention **CONFLICT** in notes — do not silently average coordinates.
3. Do not edit `src/main.ts`; it already loads `wrecksCollection()`.
4. `lookup.ts` only needs a change if ids collide across files — prefix AWOIS ids if needed (`awois-…`).

## Acceptance
- `npm test` and `npm run build` pass. Every wreck card still has a `sourceUrl` starting with `https://`.

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
