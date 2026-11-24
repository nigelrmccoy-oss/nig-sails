/**
 * Ontario OSM: try the nigian Overpass first, then public mirrors.
 * Never touch the overpass-ontario container. ODbL attribution required.
 * After 3 missed tiles on a mirror, that mirror is cooled down.
 * China / global bboxes must not use the Ontario extract (it only covers Ontario).
 */
export const LOCAL_ONTARIO = 'http://127.0.0.1:12346/api/interpreter';
export const MISS_LIMIT = 3;
export const LOCAL_TIMEOUT_MS = 3_000;
export const PUBLIC_TIMEOUT_MS = 30_000;
export const ODBL_CREDIT = '© OpenStreetMap contributors';

/** Southern Ontario rough AABB (WGS-84). */
export const ONTARIO_SOUTH = { minLon: -83.2, minLat: 41.6, maxLon: -78.8, maxLat: 44.6 };

export type Mirror = {
  name: string;
  url: string;
  misses: number;
  coolUntil: number;
  ontarioOnly: boolean;
};

export function defaultMirrors(): Mirror[] {
  return [
    { name: 'local-ontario', url: LOCAL_ONTARIO, misses: 0, coolUntil: 0, ontarioOnly: true },
    { name: 'kumi', url: 'https://overpass.kumi.systems/api/interpreter', misses: 0, coolUntil: 0, ontarioOnly: false },
    { name: 'mailru', url: 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', misses: 0, coolUntil: 0, ontarioOnly: false },
    { name: 'private.coffee', url: 'https://overpass.private.coffee/api/interpreter', misses: 0, coolUntil: 0, ontarioOnly: false },
    { name: 'overpass-api.de', url: 'https://overpass-api.de/api/interpreter', misses: 0, coolUntil: 0, ontarioOnly: false },
  ];
}

export function bboxIsOntario(minLon: number, minLat: number, maxLon: number, maxLat: number): boolean {
  const o = ONTARIO_SOUTH;
  return minLon >= o.minLon - 0.5 && maxLon <= o.maxLon + 0.5 && minLat >= o.minLat - 0.5 && maxLat <= o.maxLat + 0.5;
}

export function pickMirrors(all: Mirror[], now: number, ontario: boolean): Mirror[] {
  return all.filter((m) => {
    if (m.coolUntil > now) return false;
    if (m.ontarioOnly && !ontario) return false;
    return true;
  });
}

/** Record a missed tile. After MISS_LIMIT misses, cool the mirror (10 min local, 5 min public). */
export function recordMiss(m: Mirror, now: number): void {
  m.misses += 1;
  if (m.misses >= MISS_LIMIT) {
    m.coolUntil = now + (m.ontarioOnly ? 600_000 : 300_000);
    m.misses = 0;
  }
}

export function recordHit(m: Mirror): void {
  m.misses = 0;
  m.coolUntil = 0;
}

export function cooldownMsRemaining(m: Mirror, now: number): number {
  return Math.max(0, m.coolUntil - now);
}
