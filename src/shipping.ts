/** Major corridor centerlines are ESTIMATE until a density raster is baked. */
import type { InfoCard } from './cards.ts';
import lanesJson from '../data/shipping-lanes.json' with { type: 'json' };
import { ENDPOINTS } from './endpoints.ts';
import { fc, type Feature, type FeatureCollection, type LonLat } from './geo.ts';

export type LaneRec = {
  id: string;
  name: string;
  coords: LonLat[];
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
  estimate: boolean;
};

export function allLanes(): LaneRec[] {
  return lanesJson as LaneRec[];
}

export function lanesCollection(): FeatureCollection {
  return fc(allLanes().map((l) => ({
    type: 'Feature' as const,
    id: l.id,
    properties: { ...l, kind: 'lane', coords: undefined },
    geometry: { type: 'LineString' as const, coordinates: l.coords },
  })) as Feature[]);
}

export function laneCard(l: LaneRec): InfoCard {
  return {
    id: l.id, kind: 'lane', name: l.name, summary: l.notes,
    sourceName: l.sourceName, sourceUrl: l.sourceUrl, licence: l.licence, estimate: l.estimate,
  };
}

export function laneCardById(id: string): InfoCard | undefined {
  const l = allLanes().find((x) => x.id === id);
  return l ? laneCard(l) : undefined;
}

/** Stub endpoints for Game Coder bake scripts. */
export function densitySources(): { name: string; url: string }[] {
  return [
    { name: 'World Bank / IMF Global Shipping Traffic Density', url: ENDPOINTS.worldBankDensity },
    { name: 'EMODnet vessel density WMS', url: ENDPOINTS.emodnetVesselDensity },
  ];
}
