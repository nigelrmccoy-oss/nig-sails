/** AIS client: local proxy (AISStream), Digitraffic, Kystverket stubs, DEMO ships. */
import type { InfoCard } from './cards.ts';
import { modelForAis, type ShipModelId } from './ships.ts';
import { ENDPOINTS } from './endpoints.ts';

export type AisMode = 'aisstream' | 'digitraffic' | 'kystverket' | 'demo';

export type AisShip = {
  id: string;
  mmsi?: string;
  name: string;
  lat: number;
  lon: number;
  cog?: number;
  sog?: number;
  heading?: number;
  shipType?: number;
  model: ShipModelId;
  demo: boolean;
};

export const AIS_KEY_STORAGE = 'nig-sails:aisstream-key';

export function demoShips(): AisShip[] {
  const seeds: { id: string; name: string; lat: number; lon: number; type: number; cog: number }[] = [
    { id: 'demo-cosco', name: 'DEMO COSCO BOX', lat: 1.26, lon: 103.9, type: 70, cog: 310 },
    { id: 'demo-maersk', name: 'DEMO MAERSK BOX', lat: 51.95, lon: 4.05, type: 70, cog: 250 },
    { id: 'demo-lpg', name: 'DEMO LPG CARRIER', lat: 26.2, lon: 52.7, type: 84, cog: 120 },
    { id: 'demo-tanker', name: 'DEMO OIL TANKER', lat: 29.0, lon: 48.2, type: 80, cog: 140 },
    { id: 'demo-fish', name: 'DEMO FISHING VESSEL', lat: 47.6, lon: -52.7, type: 30, cog: 80 },
    { id: 'demo-cargo', name: 'DEMO CARGO SHIP', lat: 35.1, lon: 129.05, type: 70, cog: 200 },
  ];
  return seeds.map((s) => ({
    id: s.id,
    name: s.name,
    lat: s.lat,
    lon: s.lon,
    cog: s.cog,
    sog: 12,
    heading: s.cog,
    shipType: s.type,
    model: modelForAis(s.type, s.name),
    demo: true,
  }));
}

export function shipCard(s: AisShip): InfoCard {
  return {
    id: s.id,
    kind: 'ship',
    name: s.name,
    lat: s.lat,
    lon: s.lon,
    summary: s.demo ? 'DEMO vessel (not live AIS).' : 'Live AIS position.',
    sourceName: s.demo ? 'Nig-Sails demo fleet' : 'AIS (see mode)',
    sourceUrl: s.demo ? 'https://github.com/nigelrmccoy-oss/nig-sails' : ENDPOINTS.digitrafficDocs,
    licence: s.demo ? 'MIT (demo)' : 'See source operator licence',
    extra: {
      MMSI: s.mmsi || '—',
      Model: s.model,
      SOG: s.sog != null ? `${s.sog} kn` : '—',
      COG: s.cog != null ? `${s.cog}°` : '—',
    },
  };
}

export function parseAisStreamMessage(msg: unknown): AisShip | null {
  if (!msg || typeof msg !== 'object') return null;
  const m = msg as Record<string, unknown>;
  const meta = (m.MetaData || m.metadata || {}) as Record<string, unknown>;
  const body = (m.Message || m.message || m) as Record<string, unknown>;
  const pos = (body.PositionReport || body.positionReport || body) as Record<string, unknown>;
  const lat = Number(meta.latitude ?? pos.Latitude ?? pos.latitude);
  const lon = Number(meta.longitude ?? pos.Longitude ?? pos.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const name = String(meta.ShipName ?? meta.shipName ?? pos.Name ?? 'UNKNOWN').trim() || 'UNKNOWN';
  const mmsi = String(meta.MMSI ?? meta.mmsi ?? pos.UserID ?? '');
  const shipType = Number(meta.shipType ?? pos.ShipType ?? pos.Type) || undefined;
  const cog = Number(pos.Cog ?? pos.COG ?? pos.cog);
  const heading = Number(pos.TrueHeading ?? pos.Heading ?? pos.heading);
  const sog = Number(pos.Sog ?? pos.SOG ?? pos.sog);
  const id = mmsi || `${lon.toFixed(3)},${lat.toFixed(3)}`;
  return {
    id,
    mmsi: mmsi || undefined,
    name,
    lat,
    lon,
    cog: Number.isFinite(cog) ? cog : undefined,
    sog: Number.isFinite(sog) ? sog : undefined,
    heading: Number.isFinite(heading) && heading < 360 ? heading : (Number.isFinite(cog) ? cog : undefined),
    shipType,
    model: modelForAis(shipType, name),
    demo: false,
  };
}

export function pickAisMode(opts: { proxyUp: boolean; hasKey: boolean }): AisMode {
  if (opts.proxyUp || opts.hasKey) return 'aisstream';
  return 'demo';
}

export const DIGITRAFFIC_URL = ENDPOINTS.digitrafficAis;
export const KYSTVERKET_DOCS = ENDPOINTS.kystverketDocs;
export const AISSTREAM_WS = ENDPOINTS.aisstreamWs;
export const AIS_PROXY_WS = ENDPOINTS.aisProxyWs;
