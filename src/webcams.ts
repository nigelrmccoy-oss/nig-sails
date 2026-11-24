/** Public underwater livestreams. Link out only; do not scrape the video. */
import type { InfoCard } from './cards.ts';
import camsJson from '../data/webcams.json' with { type: 'json' };
import { fc, type Feature, type FeatureCollection } from './geo.ts';

export type CamRec = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
};

export function allWebcams(): CamRec[] {
  return camsJson as CamRec[];
}

export function webcamsCollection(): FeatureCollection {
  return fc(allWebcams().map((c) => ({
    type: 'Feature',
    id: c.id,
    properties: { ...c, kind: 'webcam' },
    geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
  } as Feature)));
}

export function webcamCard(c: CamRec): InfoCard {
  return {
    id: c.id, kind: 'webcam', name: c.name, summary: c.notes, lat: c.lat, lon: c.lon,
    sourceName: c.sourceName, sourceUrl: c.sourceUrl, licence: c.licence,
    extra: { Stream: 'Opens the public page (no scrape)' },
  };
}

export function webcamCardById(id: string): InfoCard | undefined {
  const c = allWebcams().find((x) => x.id === id);
  return c ? webcamCard(c) : undefined;
}
