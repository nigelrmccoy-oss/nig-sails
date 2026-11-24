#!/usr/bin/env node
/**
 * Dry-run bake stub for NOAA OE / SOI / MBARI / ONC / OET sites.
 * Default: print the public source URL and exit 0 without writing data.
 * Pass --go after a Game Coder prompt wires the real download (open data only).
 * Never fetch TeleGeography, Street View, or Apple Maps.
 */
const SOURCE = 'https://oceanexplorer.noaa.gov/';
const OUT = new URL('../data/research-sites.json', import.meta.url);
const go = process.argv.includes('--go');
console.log(JSON.stringify({ script: 'bake-research.mjs', source: SOURCE, out: OUT.pathname, go, status: go ? 'not-implemented' : 'dry-run' }, null, 2));
if (go) {
  console.error('Real bake is not implemented in the scaffold; a queue prompt should fill this in.');
  process.exit(2);
}
