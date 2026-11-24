/** Layer registry used by the rail and by tests. */

export type LayerId =
  | 'gebco'
  | 'emodnet-bathy'
  | 'noaa-bathy'
  | 'ports'
  | 'lights'
  | 'lanes'
  | 'density'
  | 'borders'
  | 'eez'
  | 'wrecks'
  | 'cables'
  | 'research'
  | 'webcams'
  | 'buoys'
  | 'currents'
  | 'weather'
  | 'ais';

export type LayerDef = {
  id: LayerId;
  label: string;
  group: 'bathymetry' | 'nautical' | 'traffic' | 'boundaries' | 'heritage' | 'science' | 'live';
  defaultOn: boolean;
  status: 'live' | 'baked' | 'stub';
  source: string;
};

export const LAYERS: LayerDef[] = [
  { id: 'gebco', label: 'GEBCO bathymetry', group: 'bathymetry', defaultOn: true, status: 'stub', source: 'GEBCO WMS (public domain)' },
  { id: 'emodnet-bathy', label: 'EMODnet bathymetry', group: 'bathymetry', defaultOn: false, status: 'stub', source: 'EMODnet Bathymetry WMS (CC BY 4.0)' },
  { id: 'noaa-bathy', label: 'NOAA coastal DEM', group: 'bathymetry', defaultOn: false, status: 'stub', source: 'NOAA NCEI (public domain US)' },
  { id: 'ports', label: 'Ports (WPI sample)', group: 'nautical', defaultOn: true, status: 'baked', source: 'World Port Index sample / public coords' },
  { id: 'lights', label: 'Lights & buoys', group: 'nautical', defaultOn: false, status: 'stub', source: 'OpenSeaMap / OSM (ODbL)' },
  { id: 'lanes', label: 'Shipping lanes', group: 'traffic', defaultOn: true, status: 'baked', source: 'Major corridors (ESTIMATE centerlines) pending density raster' },
  { id: 'density', label: 'Traffic density', group: 'traffic', defaultOn: false, status: 'stub', source: 'IMF/World Bank + EMODnet vessel density' },
  { id: 'borders', label: 'Country borders', group: 'boundaries', defaultOn: true, status: 'stub', source: 'Natural Earth (public domain)' },
  { id: 'eez', label: 'Maritime EEZ', group: 'boundaries', defaultOn: false, status: 'stub', source: 'Marine Regions (VLIZ)' },
  { id: 'wrecks', label: 'Shipwrecks', group: 'heritage', defaultOn: true, status: 'baked', source: 'Wikidata / NOAA AWOIS (fixture)' },
  { id: 'cables', label: 'Undersea cables', group: 'heritage', defaultOn: true, status: 'baked', source: 'Open layers only; historic routes ESTIMATE. No TeleGeography.' },
  { id: 'research', label: 'ROV / research sites', group: 'science', defaultOn: true, status: 'baked', source: 'NOAA OE, SOI, MBARI, ONC, OET' },
  { id: 'webcams', label: 'Undersea webcams', group: 'science', defaultOn: true, status: 'baked', source: 'Public livestream pages (link out)' },
  { id: 'buoys', label: 'NDBC buoys', group: 'live', defaultOn: true, status: 'baked', source: 'NOAA NDBC' },
  { id: 'currents', label: 'Currents', group: 'live', defaultOn: false, status: 'stub', source: 'Open-Meteo Marine / OSCAR / HYCOM' },
  { id: 'weather', label: 'Ocean weather', group: 'live', defaultOn: false, status: 'stub', source: 'Open-Meteo Marine / WaveWatch III' },
  { id: 'ais', label: 'Live / demo ships', group: 'live', defaultOn: true, status: 'live', source: 'AISStream (proxy) or Digitraffic / Kystverket / DEMO' },
];

export function defaultEnabled(): Record<LayerId, boolean> {
  const o = {} as Record<LayerId, boolean>;
  for (const l of LAYERS) o[l.id] = l.defaultOn;
  return o;
}

export function layerById(id: string): LayerDef | undefined {
  return LAYERS.find((l) => l.id === id);
}
