#!/usr/bin/env node
/**
 * Dry-run bake stub for OSM submarine=yes via public Overpass (not Ontario extract).
 * Default: print the public source URL and exit 0 without writing data.
 * Pass --go after a Game Coder prompt wires the real download (open data only).
 * Never fetch TeleGeography, Street View, or Apple Maps.
 */
const SOURCE = 'https://overpass-api.de/api/interpreter';
const OUT = new URL('../data/cables-osm.json', import.meta.url);
const go = process.argv.includes('--go');
console.log(JSON.stringify({ script: 'bake-cables-osm.mjs', source: SOURCE, out: OUT.pathname, go, status: go ? 'not-implemented' : 'dry-run' }, null, 2));
if (go) {
  console.error('Real bake is not implemented in the scaffold; a queue prompt should fill this in.');
  process.exit(2);
}
