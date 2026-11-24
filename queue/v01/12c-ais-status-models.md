---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/ships.ts src/ui/options.ts
read: src/ais.ts
ctx: 32k
title: NS 12c: AIS status text and ship-model mapping polish
---
# NS 12c · AIS status wording and model mapping polish

Depends on: 12b. Files you may edit: `src/ships.ts` `src/ui/options.ts` only.

## Goal
Polish AIS type → GLB mapping and the Options AIS copy. Models already exist in `public/models/` (`container-cosco`, `container-maersk`, `lpg`, `tanker`, `fishing`, `cargo`). Colours are livery-inspired; **no logos or wordmarks** may be added here (these files are TypeScript/UI only).

## Current behaviour
- `modelForAis` already maps fishing (30–39), LPG (84 / name), tankers (80–89), MAERSK / COSCO names, and a CONTAINER word to the box-ship models; other type 70s go to `cargo`. Tests lock those cases — do not break them.
- Options already saves an optional key in `localStorage` and shows `********`. `#aisStatus` is updated from `main.ts` (you cannot edit `main.ts` here).

## Steps
1. In `ships.ts`, you may add a few more well-known container *name* matches if you are sure they are only used for model choice (still no logos). Keep `DEMO MAERSK BOX` and `DEMO COSCO BOX` mappings. Do not use trademarked emblems in strings shown as decoration.
2. In `options.ts`, tighten the help text: key is optional; preferred source is the local proxy reading `~/.config/nig-sails/aisstream.env`; a pasted key stays in this browser only; never uploaded, never committed. Do not display the key length or any prefix of the secret.
3. `readLocalAisKey` and `AIS_KEY_STORAGE` must remain exported/used as now.

## Acceptance
- `npm test` mapping and DEMO assertions still pass. `npm run build` passes.

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
