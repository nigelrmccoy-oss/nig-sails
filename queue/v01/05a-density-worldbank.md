---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: scripts/bake-density.mjs data/density-meta.json
read: SOURCES.md
ctx: 32k
title: NS 05a: World Bank / IMF shipping density metadata bake
---
# NS 05a · Global Shipping Traffic Density (World Bank / IMF)

Depends on: 04b. Files you may edit: `scripts/bake-density.mjs` `data/density-meta.json` only.

## Goal
Fill the dry-run stub so `--go` records how to obtain the IMF / World Bank Global Shipping Traffic Density product and, if a **redistributable** open raster or vector extract is clearly licensed for this hobby sim, writes a small metadata JSON (source URL, year, licence, recommended layer, local path convention). Do **not** commit a multi-hundred-MB raster if the licence even slightly disagrees or the file is huge.

Catalog: https://datacatalog.worldbank.org/search/dataset/0037580/Global-Shipping-Traffic-Density
IMF page: https://www.imf.org/en/Topics/climate-change/ocean-and-climate

## Current behaviour
- `data/density-meta.json` is a stub `{ status, source }`. `data/shipping-lanes.json` already holds **ESTIMATE** corridor centerlines used by the globe; do not delete those (you may not edit that file here).

## Steps
1. Read the catalog / licence. Put the exact licence name and dataset URL in `density-meta.json`.
2. If tiles or a COG/GeoTIFF may be cached locally under the 16 GB LRU later, document the tile URL template in metadata. Do not paste binary data into the JSON.
3. If redistribution is not allowed, set `status` to `"link-only"` and explain in a `notes` field. The app can then link out. Never scrape a site that forbids it.
4. Dry run remains the default. Failed `--go` must not truncate `density-meta.json` to 0 bytes.

## Acceptance
- `npm test` and `npm run build` pass. `densitySources()` in `src/shipping.ts` already points at the catalog URL — do not edit that file here.

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
