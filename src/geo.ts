/** Tiny GeoJSON helpers shared by baked layers. */

export type LonLat = [number, number];

export type Feature = {
  type: 'Feature';
  id?: string;
  properties: Record<string, unknown>;
  geometry: { type: 'Point'; coordinates: LonLat } | { type: 'LineString'; coordinates: LonLat[] } | { type: 'Polygon'; coordinates: LonLat[][] };
};

export type FeatureCollection = { type: 'FeatureCollection'; features: Feature[] };

export function fc(features: Feature[]): FeatureCollection {
  return { type: 'FeatureCollection', features };
}

export function point(id: string, lon: number, lat: number, properties: Record<string, unknown>): Feature {
  return { type: 'Feature', id, properties: { id, ...properties }, geometry: { type: 'Point', coordinates: [lon, lat] } };
}

export function line(id: string, coords: LonLat[], properties: Record<string, unknown>): Feature {
  return { type: 'Feature', id, properties: { id, ...properties }, geometry: { type: 'LineString', coordinates: coords } };
}
