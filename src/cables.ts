/** Open cable layer only. Historic routes are ESTIMATE. No TeleGeography data. */
import type { InfoCard } from './cards.ts';
import cablesJson from '../data/cables.json' with { type: 'json' };
import { fc, type Feature, type FeatureCollection, type LonLat } from './geo.ts';

export type CableRec = {
  id: string;
  name: string;
  year: number;
  endYear?: number | null;
  coords: LonLat[];
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
  estimate: boolean;
};

export function allCables(): CableRec[] {
  return cablesJson as CableRec[];
}

export function cablesCollection(year = 2026): FeatureCollection {
  const feats = allCables()
    .filter((c) => c.year <= year && (c.endYear == null || year <= c.endYear))
    .map((c) => ({
      type: 'Feature' as const,
      id: c.id,
      properties: { ...c, kind: 'cable', coords: undefined },
      geometry: { type: 'LineString' as const, coordinates: c.coords },
    }));
  return fc(feats as Feature[]);
}

export function cableCard(c: CableRec): InfoCard {
  return {
    id: c.id,
    kind: 'cable',
    name: c.name,
    date: String(c.year),
    summary: c.notes,
    sourceName: c.sourceName,
    sourceUrl: c.sourceUrl,
    licence: c.licence,
    estimate: c.estimate,
  };
}

export function cableCardById(id: string): InfoCard | undefined {
  const c = allCables().find((x) => x.id === id);
  return c ? cableCard(c) : undefined;
}
