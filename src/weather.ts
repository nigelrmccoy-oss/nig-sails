import type { InfoCard } from './cards.ts';
import buoysJson from '../data/buoys.json' with { type: 'json' };
import { ENDPOINTS } from './endpoints.ts';
import { fc, type Feature, type FeatureCollection } from './geo.ts';

export type BuoyRec = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
};

export function allBuoys(): BuoyRec[] {
  return buoysJson as BuoyRec[];
}

export function buoysCollection(): FeatureCollection {
  return fc(allBuoys().map((b) => ({
    type: 'Feature',
    id: b.id,
    properties: { ...b, kind: 'buoy' },
    geometry: { type: 'Point', coordinates: [b.lon, b.lat] },
  } as Feature)));
}

export function buoyCard(b: BuoyRec): InfoCard {
  return {
    id: b.id, kind: 'buoy', name: b.name, summary: b.notes, lat: b.lat, lon: b.lon,
    sourceName: b.sourceName, sourceUrl: b.sourceUrl, licence: b.licence,
    extra: { Feed: `${ENDPOINTS.ndbcRealtime}${b.id}.txt` },
  };
}

export function buoyCardById(id: string): InfoCard | undefined {
  const b = allBuoys().find((x) => x.id === id);
  return b ? buoyCard(b) : undefined;
}

export function openMeteoMarineUrl(lat: number, lon: number): string {
  const q = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction',
    wind_speed_unit: 'kn',
  });
  return `${ENDPOINTS.openMeteoMarine}?${q.toString()}`;
}
