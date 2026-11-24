---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-ports-wpi.mjs data/ports.json
read: SOURCES.md src/ports.ts
ctx: 32k
title: NS 04a: Bake World Port Index sample (script, not inline)
---
# NS 04a · World Port Index bake script

Depends on: 02. Files you may edit: `scripts/bake-ports-wpi.mjs` `data/ports.json` only.

## Goal
Turn the dry-run stub `scripts/bake-ports-wpi.mjs` into a real bake that reads a **public** World Port Index (or successor) download and writes a compact JSON array in the same shape as the existing fixture (`id`, `name`, `country`, `lat`, `lon`, `notes`, `sourceName`, `sourceUrl`, `licence`).

WPI: https://msi.nga.mil/Publications/WPI

## Current behaviour
- `data/ports.json` already has a 12-port fixture so the app and tests work offline. `src/ports.ts` loads that file — do not edit `src/ports.ts` here.
- The script currently prints the URL and exits 0 unless `--go` is passed (then it exits 2).

## Steps
1. Implement `--go` to download or parse an official open WPI product (CSV, shapefile, or documented JSON). Credit the US government public source on every record (`sourceUrl` should be the dataset page, not a random blog).
2. Keep the file size reasonable for the repo: prefer a curated subset (major ports, or a documented cap such as the busiest N ports plus the existing 12) rather than dumping tens of thousands of rows into git. If the full set is huge, write a compact `data/ports.json` plus a note in the script on how to raise the cap.
3. Do not invent coordinates. If a field is missing, omit it or mark **ESTIMATE** only when you must interpolate, and say so in `notes`.
4. Default (no `--go`) must remain a dry run that writes nothing. Do not empty `data/ports.json` if the download fails — leave the fixture in place and exit non-zero.

## Acceptance
- `node scripts/bake-ports-wpi.mjs` is a dry run (exit 0).
- `node scripts/bake-ports-wpi.mjs --go` either updates `data/ports.json` with sourced records or fails without truncating the file to 0 bytes.
- `npm test` and `npm run build` still pass (they require at least 8 ports with source URLs).

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
