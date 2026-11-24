---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-wrecks-awois.mjs data/wrecks-awois.json
read: SOURCES.md
ctx: 32k
title: NS 07b: NOAA AWOIS / ENC wrecks bake
---
# NS 07b · NOAA AWOIS / ENC wrecks

Depends on: 07a. Files you may edit: `scripts/bake-wrecks-awois.mjs` `data/wrecks-awois.json` only.

## Goal
Implement `--go` to pull a **public** NOAA wrecks / obstructions product (AWOIS or ENC wrecks) and write `data/wrecks-awois.json` as a JSON array (the file already exists as `[]\n` — keep it valid JSON always).

Page: https://nauticalcharts.noaa.gov/data/wrecks-and-obstructions.html

## Steps
1. Find the official download (shapefile, CSV, or ArcGIS/OGC endpoint documented on that page or a NOAA successor). US public domain. Record the exact dataset URL in each `sourceUrl` or in a `_meta` object plus records.
2. Use a stable record shape close to the main wrecks fixture (`id`, `name`, `lat`, `lon`, `depthM`, `date`, `notes`, `sourceName`, `sourceUrl`, `licence`). Cap volume if the national set is huge (e.g. documented quality filter, or a regional subset plus a script flag to do all of it later).
3. Positions are survey data — do not “correct” them. If a record has no coordinate, skip it. Mark **ESTIMATE** only when NOAA itself flags the position as approximate/doubtful, and keep that flag in `notes`.
4. Dry run writes nothing. A failed `--go` must not truncate the file to 0 bytes (write `[]\n` at worst, but prefer leaving the previous content).

## Acceptance
- `npm test` and `npm run build` pass (they do not yet read this file; do not break JSON syntax).

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
