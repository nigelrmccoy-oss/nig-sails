/** OpenSeaMap / OSM lights and buoys. Stub until the bake prompt fills data/lights.json. */
import lightsJson from '../data/lights.json' with { type: 'json' };
import { ENDPOINTS } from './endpoints.ts';
import { fc, type Feature, type FeatureCollection } from './geo.ts';

export type LightRec = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
};

export function allLights(): LightRec[] {
  return lightsJson as LightRec[];
}

export function lightsCollection(): FeatureCollection {
  return fc(allLights().map((l) => ({
    type: 'Feature',
    id: l.id,
    properties: { ...l, kind: 'other' },
    geometry: { type: 'Point', coordinates: [l.lon, l.lat] },
  } as Feature)));
}

export function openSeaMapTiles(): string {
  return ENDPOINTS.openSeaMap;
}
