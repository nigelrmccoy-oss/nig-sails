import type { InfoCard } from './cards.ts';
import wrecksJson from '../data/wrecks.json' with { type: 'json' };
import { fc, type Feature, type FeatureCollection } from './geo.ts';

export type WreckRec = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  depthM: number | null;
  date: string;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
  estimate?: boolean;
};

export function allWrecks(): WreckRec[] {
  return wrecksJson as WreckRec[];
}

export function wrecksCollection(): FeatureCollection {
  return fc(allWrecks().map((w) => ({
    type: 'Feature',
    id: w.id,
    properties: { ...w, kind: 'wreck' },
    geometry: { type: 'Point', coordinates: [w.lon, w.lat] },
  } as Feature)));
}

export function wreckCard(w: WreckRec): InfoCard {
  return {
    id: w.id,
    kind: 'wreck',
    name: w.name,
    date: w.date,
    depthM: w.depthM,
    summary: w.notes,
    lat: w.lat,
    lon: w.lon,
    sourceName: w.sourceName,
    sourceUrl: w.sourceUrl,
    licence: w.licence,
    estimate: !!w.estimate,
  };
}

export function wreckCardById(id: string): InfoCard | undefined {
  const w = allWrecks().find((x) => x.id === id);
  return w ? wreckCard(w) : undefined;
}
