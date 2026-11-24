# Nig-Sails Game Coder prompts (v01)

Extra-detailed prompts for the local Game Coder queue (Aider + Devstral). Branch: `gamecoder/nig-sails-v01`.

Each prompt is 2–8 KB, lists 1–3 existing non-empty files, and uses `ctx: 32k`. Big work is split into a/b/c parts. Bake scripts do large downloads; prompts do not inline datasets. `99-v010-final-gate.md` is a manual checklist and is **not** enqueued.

| # | File | Depends | Topic |
| --- | --- | --- | --- |
| 01 | `01-cesium-gebco-wms.md` | none | GEBCO WMS |
| 02 | `02-cache-options-ui.md` | 01 | 16 GB cache Options + AIS field |
| 03a | `03a-emodnet-bathy.md` | 01 | EMODnet bathymetry WMS |
| 03b | `03b-noaa-bathy.md` | 03a | NOAA NCEI hook |
| 04a | `04a-ports-wpi.md` | 02 | World Port Index bake |
| 04b | `04b-lights-buoys.md` | 04a | OpenSeaMap lights |
| 05a | `05a-density-worldbank.md` | 04b | World Bank / IMF density metadata |
| 05b | `05b-emodnet-vessel-density.md` | 05a | EMODnet vessel density WMS |
| 06a | `06a-borders-natural-earth.md` | 05b | Natural Earth borders |
| 06b | `06b-eez-marine-regions.md` | 06a | Marine Regions EEZ |
| 07a | `07a-wrecks-wikidata.md` | 06b | Wikidata wrecks SPARQL |
| 07b | `07b-wrecks-awois.md` | 07a | NOAA AWOIS bake |
| 07c | `07c-wrecks-cards.md` | 07b | Merge wrecks into cards |
| 08a | `08a-cables-osm.md` | 07c | OSM submarine bake |
| 08b | `08b-cables-emodnet.md` | 08a | EMODnet cables bake |
| 08c | `08c-cables-layer.md` | 08b | Merge cable layer |
| 09a | `09a-research-noaa.md` | 08c | NOAA OE sites |
| 09b | `09b-research-soi-mbari.md` | 09a | SOI + MBARI |
| 09c | `09c-research-onc-oet.md` | 09b | ONC + Nautilus |
| 10 | `10-webcams.md` | 09c | Public webcam links |
| 11a | `11a-ndbc-live.md` | 10 | NDBC live cards |
| 11b | `11b-open-meteo.md` | 11a | Open-Meteo Marine |
| 11c | `11c-currents-particles.md` | 11b | Current arrows/particles |
| 12a | `12a-ais-digitraffic.md` | 11c | Digitraffic AIS |
| 12b | `12b-ais-kystverket.md` | 12a | Kystverket AIS |
| 12c | `12c-ais-status-models.md` | 12b | Mapping + Options copy |
| 13 | `13-tests-polish.md` | 12c | Tests + CSS |
| 99 | `99-v010-final-gate.md` | 13 | Manual gate, not queued |
