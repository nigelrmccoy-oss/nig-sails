/** Bathymetry imagery descriptors. Wired to Cesium in main.ts. */
import { ENDPOINTS } from './endpoints.ts';

export type WmsLayer = {
  id: string;
  url: string;
  layers: string;
  credit: string;
  enabled: boolean;
};

/** GEBCO_LATEST is the usual public WMS layer name; confirm if a bake fails. */
export function gebcoWms(): WmsLayer {
  return {
    id: 'gebco',
    url: ENDPOINTS.gebcoWms,
    layers: 'GEBCO_LATEST',
    credit: 'GEBCO Compilation Group (public domain)',
    enabled: true,
  };
}

export function emodnetBathyWms(): WmsLayer {
  return {
    id: 'emodnet-bathy',
    url: ENDPOINTS.emodnetBathyWms,
    layers: 'mean_multicolour',
    credit: 'EMODnet Bathymetry (CC BY 4.0)',
    enabled: false,
  };
}

export function noaaBathyInfo(): { id: string; url: string; credit: string } {
  return {
    id: 'noaa-bathy',
    url: ENDPOINTS.noaaNcei,
    credit: 'NOAA NCEI bathymetry (US public domain)',
  };
}
