---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-cables-emodnet.mjs data/cables-emodnet.json
read: SOURCES.md
ctx: 32k
title: NS 08b: EMODnet open cable routes bake
---
# NS 08b · EMODnet telecom / power / pipeline cables (CC BY 4.0)

Depends on: 08a. Files you may edit: `scripts/bake-cables-emodnet.mjs` `data/cables-emodnet.json` only.

## Goal
The stub script and `data/cables-emodnet.json` (empty FeatureCollection) already exist on the scaffold (create them first only if they are somehow missing; never write a 0-byte file). Implement `--go` to download the **open** EMODnet Human Activities cable route datasets (CC BY 4.0) and write a compact GeoJSON collection.

Records (geonetwork):
- https://ows.emodnet-humanactivities.eu/geonetwork/srv/api/records/39ebe289-410b-4a5d-88a4-51bfcde538de
- sibling power / pipeline records listed in SOURCES.md / cable-globe research

## Hard rules
- No TeleGeography. No subscriber KMLs. If a dataset says Dutch telecom (or any other subset) was withdrawn, do not include the withdrawn part.
- Credit EMODnet (CC BY 4.0) on features.
- If the full geometry is huge, simplify or clip and document that as a v0.1 subset — do not paste coordinates into the prompt or the TypeScript sources.

## Steps
1. Dry run writes nothing. `--go` fills `data/cables-emodnet.json`. On failure, leave the stub collection (non-zero) and exit non-zero.
2. Keep properties that help an info card: name, type (telecom/power/pipeline), source URL, licence.

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
