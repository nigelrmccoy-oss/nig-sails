---
repo: /home/nig/nig-sails
branch: gamecoder/nig-sails-v01
files: tests/run.ts README.md SOURCES.md
read: src/layers.ts src/endpoints.ts
ctx: 32k
title: NS 99: v0.10 final gate (manual, not enqueued)
---
# NS 99 · v0.10 final gate (manual)

This prompt is **not** in the Game Coder pending queue. A human (or a later manual run) uses it as a checklist after v01 prompts finish.

Files you may edit if you run it: `tests/run.ts` `README.md` `SOURCES.md` only.

## Checklist
1. `npm test` and `npm run build` pass on nigian. Kill any server you start. Wrap heavy checks: `flock /tmp/nigian-heavy-tests.lock timeout 900 …`.
2. Every layer in `src/layers.ts` has a real source URL in `SOURCES.md`. Live / baked / stub status is honest. Historic cable and corridor geometries are still labelled **ESTIMATE** where inferred.
3. No TeleGeography, Street View, or Apple Maps. No AISStream key in the repo (`git grep` for `AISSTREAM_API_KEY=` values, not the env name in `.env.example`). `.env` gitignored. Proxy still binds 127.0.0.1 only.
4. Wreck, port, site, webcam, buoy, ship, and cable cards still have name, source link, and licence.
5. Ship GLBs still exist under `public/models/` and DEMO ships stay labelled DEMO.
6. 16 GB LRU cache, persist, Clear, `mayPersist` blocks ion/Bing/Google 3D Tiles.
7. README run instructions and the unofficial / not-affiliated wording are current.
8. Do not push. Do not empty files.

## Acceptance
- Tests and build pass. README and SOURCES match what the app actually does.

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
