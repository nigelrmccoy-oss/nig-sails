# Nig-Sails sources

Every claim in the sim should be traceable to a URL here or on the feature's info card. Mark **ESTIMATE** when a geometry or figure is inferred. Do not invent coordinates. **Do not use TeleGeography, Street View, or Apple Maps.**

## Bathymetry

- GEBCO compilation (public domain), WMS: https://www.gebco.net/data-products/gebco-web-services/web-map-service and https://wms.gebco.net/mapserv
- EMODnet Bathymetry WMS (CC BY 4.0): https://ows.emodnet-bathymetry.eu/wms and https://emodnet.ec.europa.eu/en/bathymetry
- NOAA NCEI bathymetry (US public domain): https://www.ncei.noaa.gov/maps/bathymetry/

Cache GEBCO tiles under the 16 GB LRU. Never persist Bing, Cesium ion, or Google 3D Tiles.

## Nautical

- World Port Index (NGA / NOAA, US public data): https://msi.nga.mil/Publications/WPI
- OpenSeaMap seamarks and lights (ODbL, © OpenStreetMap contributors): https://www.openseamap.org/ and tiles https://t1.openseamap.org/seamark/
- NOAA ENC / wrecks and obstructions (AWOIS): https://nauticalcharts.noaa.gov/data/wrecks-and-obstructions.html
- OSM via public Overpass (not the Ontario-only extract) for global seamarks. Local Ontario Overpass is http://127.0.0.1:12346/api/interpreter and must not be used for a global bbox.

## Shipping lanes and density

- IMF / World Bank Global Shipping Traffic Density: https://datacatalog.worldbank.org/search/dataset/0037580/Global-Shipping-Traffic-Density and https://www.imf.org/en/Topics/climate-change/ocean-and-climate
- EMODnet Human Activities vessel density (CC BY 4.0): https://ows.emodnet-humanactivities.eu/wms
- v0.1 corridor lines in `data/shipping-lanes.json` are **ESTIMATE** centerlines until those rasters are baked.

## Borders and EEZ

- Natural Earth admin 0 (public domain): https://www.naturalearthdata.com/ and https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip
- Marine Regions EEZ (credit VLIZ / Marine Regions): https://www.marineregions.org/ and WMS https://geo.vliz.be/geoserver/MarineRegions/wms

## Shipwrecks

- Wikidata items (CC0 facts) via SPARQL: https://query.wikidata.org/sparql — example Titanic https://www.wikidata.org/wiki/Q25173
- NOAA AWOIS / ENC wrecks (US public domain): https://nauticalcharts.noaa.gov/data/wrecks-and-obstructions.html
- EMODnet underwater cultural heritage / wrecks where open (CC BY 4.0): https://emodnet.ec.europa.eu/en/human-activities
- v0.1 `data/wrecks.json` is a curated fixture of well-known wrecks with source URLs. Positions marked **ESTIMATE** when the published figure is approximate.

## Cables (one layer; no TeleGeography)

- OSM `submarine=yes` (ODbL): public Overpass only. Ontario extract must not be used for a global bbox.
- EMODnet telecom / power / pipelines (CC BY 4.0): https://ows.emodnet-humanactivities.eu/geonetwork/srv/api/records/39ebe289-410b-4a5d-88a4-51bfcde538de (and sibling records listed in cable-globe research)
- GEM pipelines (CC BY 4.0): https://github.com/GlobalEnergyMonitor/GOIT-GGIT-pipeline-routes
- NOAA Marine Cadastre cables (US waters): https://www.fisheries.noaa.gov/inport/item/66190
- Historic landmark cables in `data/cables.json` use documented landing areas; routes are **ESTIMATE**. Narrative background: https://atlantic-cable.com (do not copy scans or long verbatim text without asking). LoC 1858 chart (public domain): https://www.loc.gov/item/99466769

## Research and ROV sites

- NOAA Ocean Exploration / Okeanos: https://oceanexplorer.noaa.gov/
- Schmidt Ocean Institute: https://schmidtocean.org/
- MBARI: https://www.mbari.org/
- Ocean Networks Canada: https://www.oceannetworks.ca/
- Ocean Exploration Trust / Nautilus: https://nautiluslive.org/

## Live undersea webcams (link out; do not scrape)

- ONC: https://www.oceannetworks.ca/
- Nautilus Live: https://nautiluslive.org/live
- NOAA Okeanos stream page: https://oceanexplorer.noaa.gov/okeanos/media/exstream/exstream.html

## Ocean weather and currents

- NOAA NDBC buoys: https://www.ndbc.noaa.gov/ and realtime text https://www.ndbc.noaa.gov/data/realtime2/
- Open-Meteo Marine API (no key): https://marine-api.open-meteo.com/v1/marine
- OSCAR currents (NASA PO.DAAC): https://podaac.jpl.nasa.gov/dataset/OSCAR_L4_OC_FINAL_V2.0
- HYCOM: https://www.hycom.org/data/glbu0pt08
- NOAA WaveWatch III: https://polar.ncep.noaa.gov/waves/
- Copernicus Marine Service (some products need a free registration; do not commit a key): https://marine.copernicus.eu/

## Live AIS

- AISStream.io websocket (free key, via local proxy): https://aisstream.io/ and `wss://stream.aisstream.io/v0/stream`
- Finland Digitraffic AIS (open): https://www.digitraffic.fi/en/marine-traffic/ and https://meri.digitraffic.fi/api/ais/v1/locations
- Norway Kystverket AIS (open coastal; see operator docs): https://www.kystverket.no/en/navigation-and-monitoring/ais/
- Historic US AIS (not live): NOAA Marine Cadastre

The AISStream key lives outside the repo (`~/.config/nig-sails/aisstream.env` or `AISSTREAM_API_KEY`). Never commit it.

## Base map

- OpenStreetMap raster tiles (ODbL): https://tile.openstreetmap.org/  Credit: © OpenStreetMap contributors

## Ship models

Low-poly GLBs generated in Blender on nigian (`scripts/make-ships.py`). Proportions follow public type descriptions; colours are inspired by public livery palettes. No trademark logos, wordmarks, or third-party 3D models.
