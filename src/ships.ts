/** Map AIS ship types and names to low-poly GLB models. No trademark logos. */

export type ShipModelId =
  | 'container-cosco'
  | 'container-maersk'
  | 'lpg'
  | 'tanker'
  | 'fishing'
  | 'cargo';

export const SHIP_MODELS: Record<ShipModelId, { file: string; label: string }> = {
  'container-cosco': { file: '/models/container-cosco.glb', label: 'Container (COSCO-style colours, no logo)' },
  'container-maersk': { file: '/models/container-maersk.glb', label: 'Container (Maersk-style colours, no logo)' },
  lpg: { file: '/models/lpg.glb', label: 'LPG carrier' },
  tanker: { file: '/models/tanker.glb', label: 'Oil tanker' },
  fishing: { file: '/models/fishing.glb', label: 'Fishing vessel' },
  cargo: { file: '/models/cargo.glb', label: 'Generic cargo' },
};

const BOX = /\b(CONTAINER|CONTAINERSCHIP|BOXSHIP)\b/;

/** ITU / AIS nav-aid type codes (ship type). */
export function modelForAis(type: number | null | undefined, name?: string): ShipModelId {
  const n = (name || '').toUpperCase();
  if (type != null && type >= 30 && type < 40) return 'fishing';
  if (type === 84 || /\b(LPG|LNG|GAS\s*CARRIER|VLGC)\b/.test(n)) return 'lpg';
  if (type != null && type >= 80 && type < 90) return 'tanker';
  if (/\bMAERSK\b/.test(n)) return 'container-maersk';
  if (/\bCOSCO\b/.test(n)) return 'container-cosco';
  if (BOX.test(n)) return 'container-cosco';
  if (type != null && type >= 70 && type < 80 && BOX.test(n)) return 'container-cosco';
  return 'cargo';
}

export function modelUrl(id: ShipModelId): string {
  return SHIP_MODELS[id].file;
}
