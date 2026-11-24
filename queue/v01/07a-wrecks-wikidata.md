---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-wrecks-wikidata.mjs data/wrecks.json
read: SOURCES.md src/wrecks.ts
ctx: 32k
title: NS 07a: Wikidata SPARQL wrecks bake
---
# NS 07a · Wikidata shipwrecks (SPARQL bake)

Depends on: 06b. Files you may edit: `scripts/bake-wrecks-wikidata.mjs` `data/wrecks.json` only.

## Goal
Implement `--go` to query Wikidata SPARQL for items that are shipwrecks (or vessels with a wreck / coordinates of the wreck) and merge them into `data/wrecks.json` without dropping the curated fixture (Titanic and the other sourced records must remain).

SPARQL: https://query.wikidata.org/sparql
Example item: https://www.wikidata.org/wiki/Q25173
Facts on Wikidata are CC0. Do **not** copy Wikipedia article prose into `notes` (short factual phrases only).

## Current behaviour
- `data/wrecks.json` already has 21 sourced wrecks so tests pass (`>= 15`, Titanic present, each with `sourceUrl`). The dry-run script prints the SPARQL URL.

## Steps
1. Write a conservative SPARQL query (instance/subclass of shipwreck, or “destroyed” ship with coordinates). Limit the result size (e.g. first N with coordinates, plus well-known ones). Be polite: one query, a User-Agent that names nig-sails / nigelrmccoy-oss, and a timeout.
2. Map to the existing record shape: `id`, `name`, `lat`, `lon`, `depthM` (null if unknown), `date`, `notes`, `sourceName`, `sourceUrl`, `licence`, optional `estimate`. `sourceUrl` should be the Wikidata item. Mark **ESTIMATE** when the coordinate is a country-precision or has a low rank.
3. Merge by `id` or Wikidata QID. Never invent a position. If the query fails, leave the fixture intact (non-zero) and exit non-zero.
4. Dry run writes nothing.

## Acceptance
- `npm test` still finds Titanic and `>= 15` wrecks with source links. `npm run build` passes.

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
