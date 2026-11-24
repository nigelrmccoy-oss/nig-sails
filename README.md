# Nig-Sails

Unofficial Google Earth–style nautical globe. Vite + TypeScript + CesiumJS.

Not affiliated with IMO, IHO, NOAA, Maersk, COSCO, or any carrier. Open and public data only. **No TeleGeography, Street View, or Apple Maps.**

v0.1 shows a Cesium globe with GEBCO/EMODnet WMS hooks, baked fixtures for wrecks, ports, research sites, webcams, buoys, a few historic cables (routes are **ESTIMATE**), **ESTIMATE** shipping-corridor centerlines, cute low-poly ship models, and live AIS when a local proxy has a key.

## Why CesiumJS

Nigel asked for a Google Earth–style globe with many imagery and vector layers, 3D ship models, and clickable info cards. Cesium is built for that (same stack as [grid-globe](https://github.com/nigelrmccoy-oss/grid-globe), including the `baseLayer` fix for Cesium 1.147). [cable-globe](https://github.com/nigelrmccoy-oss/cable-globe) research and open cable fixtures are reused as **one layer**. We did not copy TeleGeography data.

## Run

```bash
cd /home/nig/nig-sails
npm install
npm test
npm run dev          # http://127.0.0.1:5190/
```

Optional live AIS (AISStream.io free key):

```bash
# Preferred, outside the repo:
#   /home/nig/.config/nig-sails/aisstream.env  (chmod 600)
#   one line: AISSTREAM_API_KEY=…
npm run ais-proxy    # 127.0.0.1:5191 only
```

The key is never committed. `.env` is gitignored. Options also lets you paste a key into `localStorage` on this machine only.

Fallbacks if the proxy is down: Finland [Digitraffic AIS](https://www.digitraffic.fi/en/marine-traffic/), Norway Kystverket (docs linked in SOURCES.md), then clearly labelled **DEMO** ships.

Ship models (headless Blender): `npm run ships` writes `public/models/*.glb`.

## Layers

See `SOURCES.md` and `src/layers.ts`. Every info card has a name, date, depth when known, source link, and licence. Historic cable and corridor geometries are marked **ESTIMATE**.

## Licence

MIT. Map and science data keep their own licences (ODbL, CC BY, public domain, etc.).
