/** Real public endpoints. Layers may be stubbed until a bake or live fetch is wired. */

export const ENDPOINTS = {
  gebcoWms: 'https://wms.gebco.net/mapserv',
  gebcoWmsInfo: 'https://www.gebco.net/data-products/gebco-web-services/web-map-service',
  emodnetBathyWms: 'https://ows.emodnet-bathymetry.eu/wms',
  noaaNcei: 'https://www.ncei.noaa.gov/maps/bathymetry/',
  worldPortIndex: 'https://msi.nga.mil/Publications/WPI',
  openSeaMap: 'https://t1.openseamap.org/seamark/',
  osmTiles: 'https://tile.openstreetmap.org/',
  overpassPublic: 'https://overpass-api.de/api/interpreter',
  worldBankDensity: 'https://datacatalog.worldbank.org/search/dataset/0037580/Global-Shipping-Traffic-Density',
  imfOcean: 'https://www.imf.org/en/Topics/climate-change/ocean-and-climate',
  emodnetVesselDensity: 'https://ows.emodnet-humanactivities.eu/wms',
  naturalEarth50: 'https://naciscdn.org/naturalearth/50m/cultural/ne_50m_admin_0_countries.zip',
  marineRegionsWms: 'https://geo.vliz.be/geoserver/MarineRegions/wms',
  marineRegions: 'https://www.marineregions.org/',
  wikidataSparql: 'https://query.wikidata.org/sparql',
  noaaAwois: 'https://nauticalcharts.noaa.gov/data/wrecks-and-obstructions.html',
  emodnetWrecks: 'https://ows.emodnet-humanactivities.eu/wms',
  osmSubmarineOverpass: 'https://overpass-api.de/api/interpreter',
  emodnetTelecom: 'https://ows.emodnet-humanactivities.eu/geonetwork/srv/api/records/39ebe289-410b-4a5d-88a4-51bfcde538de',
  gemPipelines: 'https://github.com/GlobalEnergyMonitor/GOIT-GGIT-pipeline-routes',
  noaaCadastreCables: 'https://www.fisheries.noaa.gov/inport/item/66190',
  noaaOceanExploration: 'https://oceanexplorer.noaa.gov/',
  schmidtOcean: 'https://schmidtocean.org/',
  mbari: 'https://www.mbari.org/',
  onc: 'https://www.oceannetworks.ca/',
  nautilusLive: 'https://nautiluslive.org/',
  ndbcRealtime: 'https://www.ndbc.noaa.gov/data/realtime2/',
  ndbcStations: 'https://www.ndbc.noaa.gov/data/stations/station_table.txt',
  openMeteoMarine: 'https://marine-api.open-meteo.com/v1/marine',
  oscarCurrents: 'https://podaac.jpl.nasa.gov/dataset/OSCAR_L4_OC_FINAL_V2.0',
  hycom: 'https://www.hycom.org/data/glbu0pt08',
  wavewatch: 'https://polar.ncep.noaa.gov/waves/',
  aisstreamWs: 'wss://stream.aisstream.io/v0/stream',
  aisProxyWs: 'ws://127.0.0.1:5191/stream',
  aisProxyHealth: 'http://127.0.0.1:5191/health',
  digitrafficAis: 'https://meri.digitraffic.fi/api/ais/v1/locations',
  digitrafficDocs: 'https://www.digitraffic.fi/en/marine-traffic/',
  kystverketDocs: 'https://www.kystverket.no/en/navigation-and-monitoring/ais/',
} as const;

export const FORBIDDEN = [
  'telegeography.com',
  'submarinecablemap.com',
  'google.com/maps',
  'maps.apple.com',
  'streetview',
] as const;

export function isForbiddenSource(url: string): boolean {
  const u = url.toLowerCase();
  return FORBIDDEN.some((f) => u.includes(f));
}
