---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: src/ui/options.ts index.html src/style.css
read: src/map/MapCache.ts
ctx: 32k
title: NS 02: Options cache size, persist, Clear, AIS note
---
# NS 02 · Options: 16 GB cache and AIS key field

Depends on: 01. Files you may edit: `src/ui/options.ts` `index.html` `src/style.css` only.

## Goal
Options already shows cache size of 16 GB, tile count, persist grant, a notice, and Clear. Polish so that after Clear the size reads `0 B of 16 GB` and the count is `0`. The note must say GEBCO and other open tiles may be cached, and that Bing, Cesium ion and Google 3D Tiles are never written to IndexedDB or an exe disk folder.

The AIS key field already exists (`#aisKey`, `#aisSave`, `#aisClear`, `#aisStatus`). Keep it. Saving must stay in `localStorage` under `nig-sails:aisstream-key` (see `AIS_KEY_STORAGE`). Never copy a real key into source, comments, or HTML. The on-screen hint should mention the preferred file `~/.config/nig-sails/aisstream.env` (chmod 600) and the local proxy — not a committed `.env`.

## Current behaviour
- `bindOptions` in `src/ui/options.ts` already binds `#mcSize`, `#mcCount`, `#mcPersist`, `#mcNotice`, `#mcClear`, and the AIS key controls.
- `index.html` already has those IDs and a short cache/AIS note. `#options` and `#card` share the right side; Options should not need a rewrite of the layout, only small CSS polish if the panel overflows or overlaps the layer rail.

## Steps
1. Confirm Clear resets the labels as above. Fix formatting in `options.ts` if needed (`fmtBytes`).
2. Keep the password input from echoing a stored key (the scaffold shows `********` when a localStorage key exists — keep that behaviour).
3. Tiny CSS only if the Options panel is hard to read on top of Cesium widgets.

## Acceptance
- `npm test` and `npm run build` pass. Do not drop the AIS localStorage helpers (`readLocalAisKey` / `AIS_KEY_STORAGE`).

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
