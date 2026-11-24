---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: data/webcams.json src/webcams.ts
read: SOURCES.md
ctx: 32k
title: NS 10: Public undersea webcam links (no scrape)
---
# NS 10 · Live undersea webcams (link out only)

Depends on: 09c. Files you may edit: `data/webcams.json` `src/webcams.ts` only.

## Goal
Expand the curated webcam list with more **public** underwater or cabled-observatory livestreams. Each card opens the official page in a new tab. **Do not scrape, proxy, or embed a video stream** unless the operator publishes an official embed snippet that their terms clearly allow — when in doubt, link out only.

Already listed: ONC, Nautilus Live, NOAA Okeanos stream page.

## Steps
1. Add only cams you can cite (ONC camera pages, other public observatory cams, official aquarium *undersea* cams if truly underwater and public). Skip land-only harbour webcams unless they are clearly relevant and public.
2. Keep the record shape. Pins may be **ESTIMATE** when the operator publishes a region rather than a lens coordinate — say so in `notes`.
3. Tiny `src/webcams.ts` changes only if you need a `status` field (live / seasonal / unknown). `webcamCard` must still say the stream opens the public page.
4. Do not invent a camera. If you cannot find more than a couple, document that in a comment in `webcams.ts` and leave the three fixtures in place.

## Acceptance
- `npm test` requires every webcam `sourceUrl` to start with `https://`. `npm run build` passes.

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
