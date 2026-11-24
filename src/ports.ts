import type { InfoCard } from './cards.ts';
import portsJson from '../data/ports.json' with { type: 'json' };
import { fc, type Feature, type FeatureCollection } from './geo.ts';

export type PortRec = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
};

export function allPorts(): PortRec[] {
  return portsJson as PortRec[];
}

export function portsCollection(): FeatureCollection {
  return fc(allPorts().map((p) => ({
    type: 'Feature',
    id: p.id,
    properties: { ...p, kind: 'port' },
    geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
  } as Feature)));
}

export function portCard(p: PortRec): InfoCard {
  return {
    id: p.id, kind: 'port', name: p.name, summary: p.notes, lat: p.lat, lon: p.lon,
    sourceName: p.sourceName, sourceUrl: p.sourceUrl, licence: p.licence,
    extra: { Country: p.country },
  };
}

export function portCardById(id: string): InfoCard | undefined {
  const p = allPorts().find((x) => x.id === id);
  return p ? portCard(p) : undefined;
}
