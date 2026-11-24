/** Country borders (Natural Earth) and EEZ (Marine Regions) descriptors. */
import { ENDPOINTS } from './endpoints.ts';

export type VectorSource = {
  id: 'borders' | 'eez';
  label: string;
  url: string;
  infoUrl: string;
  licence: string;
  status: 'stub';
};

export function borderSources(): VectorSource[] {
  return [
    {
      id: 'borders',
      label: 'Natural Earth admin 0 countries (50m)',
      url: ENDPOINTS.naturalEarth50,
      infoUrl: 'https://www.naturalearthdata.com/',
      licence: 'public domain (Natural Earth)',
      status: 'stub',
    },
    {
      id: 'eez',
      label: 'Marine Regions EEZ',
      url: ENDPOINTS.marineRegionsWms,
      infoUrl: ENDPOINTS.marineRegions,
      licence: 'Marine Regions / VLIZ — credit required',
      status: 'stub',
    },
  ];
}
