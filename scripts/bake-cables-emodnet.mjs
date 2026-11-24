#!/usr/bin/env node
/**
 * Dry-run bake stub for EMODnet telecom / power / pipeline cables (CC BY 4.0).
 * Default: print the public source URL and exit 0 without writing data.
 * Pass --go after a Game Coder prompt wires the real download (open data only).
 * Never fetch TeleGeography, Street View, or Apple Maps.
 */
const SOURCE = 'https://ows.emodnet-humanactivities.eu/geonetwork/srv/api/records/39ebe289-410b-4a5d-88a4-51bfcde538de';
const OUT = new URL('../data/cables-emodnet.json', import.meta.url);
const go = process.argv.includes('--go');
console.log(JSON.stringify({ script: 'bake-cables-emodnet.mjs', source: SOURCE, out: OUT.pathname, go, status: go ? 'not-implemented' : 'dry-run' }, null, 2));
if (go) {
  console.error('Real bake is not implemented in the scaffold; a queue prompt should fill this in.');
  process.exit(2);
}
