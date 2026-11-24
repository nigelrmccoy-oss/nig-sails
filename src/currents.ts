/** Current / weather overlay stubs. Open-Meteo Marine has no key. */
import { openMeteoMarineUrl } from './weather.ts';
import { ENDPOINTS } from './endpoints.ts';

export type CurrentSample = {
  lat: number;
  lon: number;
  speedMs?: number;
  dirDeg?: number;
  source: string;
  estimate?: boolean;
};

export function currentSources(): { name: string; url: string }[] {
  return [
    { name: 'Open-Meteo Marine API', url: ENDPOINTS.openMeteoMarine },
    { name: 'OSCAR currents (NASA PO.DAAC)', url: ENDPOINTS.oscarCurrents },
    { name: 'HYCOM', url: ENDPOINTS.hycom },
    { name: 'WaveWatch III', url: ENDPOINTS.wavewatch },
  ];
}

export function sampleUrl(lat: number, lon: number): string {
  return openMeteoMarineUrl(lat, lon);
}

/** Placeholder arrows at well-known current regions (ESTIMATE until live fetch). */
export function demoCurrentArrows(): CurrentSample[] {
  return [
    { lat: 26, lon: -79.8, speedMs: 1.5, dirDeg: 15, source: 'Gulf Stream (ESTIMATE demo arrow)', estimate: true },
    { lat: 35, lon: 140, speedMs: 1.2, dirDeg: 45, source: 'Kuroshio (ESTIMATE demo arrow)', estimate: true },
    { lat: -35, lon: 22, speedMs: 0.8, dirDeg: 70, source: 'Agulhas (ESTIMATE demo arrow)', estimate: true },
  ];
}
