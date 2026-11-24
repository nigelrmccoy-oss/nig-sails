/** Resolve an entity id/kind to an info card. */
import type { InfoCard } from './cards.ts';
import { wreckCardById } from './wrecks.ts';
import { cableCardById } from './cables.ts';
import { portCardById } from './ports.ts';
import { laneCardById } from './shipping.ts';
import { siteCardById } from './research.ts';
import { webcamCardById } from './webcams.ts';
import { buoyCardById } from './weather.ts';

export function cardFor(kind: string, id: string): InfoCard | undefined {
  switch (kind) {
    case 'wreck': return wreckCardById(id);
    case 'cable': return cableCardById(id);
    case 'port': return portCardById(id);
    case 'lane': return laneCardById(id);
    case 'site': return siteCardById(id);
    case 'webcam': return webcamCardById(id);
    case 'buoy': return buoyCardById(id);
    default: return undefined;
  }
}
