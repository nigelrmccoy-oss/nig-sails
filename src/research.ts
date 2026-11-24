import type { InfoCard } from './cards.ts';
import sitesJson from '../data/research-sites.json' with { type: 'json' };
import { fc, type Feature, type FeatureCollection } from './geo.ts';

export type SiteRec = {
  id: string;
  name: string;
  org: string;
  lat: number;
  lon: number;
  year?: string;
  notes: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
};

export function allSites(): SiteRec[] {
  return sitesJson as SiteRec[];
}

export function sitesCollection(): FeatureCollection {
  return fc(allSites().map((s) => ({
    type: 'Feature',
    id: s.id,
    properties: { ...s, kind: 'site' },
    geometry: { type: 'Point', coordinates: [s.lon, s.lat] },
  } as Feature)));
}

export function siteCard(s: SiteRec): InfoCard {
  return {
    id: s.id, kind: 'site', name: s.name, date: s.year, summary: s.notes, lat: s.lat, lon: s.lon,
    sourceName: s.sourceName, sourceUrl: s.sourceUrl, licence: s.licence, extra: { Org: s.org },
  };
}

export function siteCardById(id: string): InfoCard | undefined {
  const s = allSites().find((x) => x.id === id);
  return s ? siteCard(s) : undefined;
}
