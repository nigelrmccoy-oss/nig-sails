import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { CACHE_VERSION, CACHE_CAP_BYTES, cacheKey, mayPersist } from '../src/map/MapCache.ts';
import { LOCAL_ONTARIO, MISS_LIMIT, bboxIsOntario, defaultMirrors, pickMirrors, recordMiss } from '../src/map/OverpassClient.ts';
import { LAYERS, defaultEnabled } from '../src/layers.ts';
import { modelForAis, SHIP_MODELS } from '../src/ships.ts';
import { allWrecks, wreckCard, wrecksCollection } from '../src/wrecks.ts';
import { allCables, cableCard } from '../src/cables.ts';
import { allPorts, portCard } from '../src/ports.ts';
import { demoShips, parseAisStreamMessage, pickAisMode, shipCard } from '../src/ais.ts';
import { cardRows } from '../src/cards.ts';
import { isForbiddenSource, ENDPOINTS } from '../src/endpoints.ts';
import { densitySources } from '../src/shipping.ts';
import { openMeteoMarineUrl } from '../src/weather.ts';
import { allWebcams } from '../src/webcams.ts';
import { allSites } from '../src/research.ts';

let failed = 0;
function check(name: string, fn: () => void): void {
  try { fn(); console.log('ok', name); }
  catch (e) { failed++; console.error('FAIL', name, e); }
}

check('cache rules', () => {
  assert.equal(CACHE_VERSION, 'v1');
  assert.equal(CACHE_CAP_BYTES, 16 * 1024 ** 3);
  assert.equal(cacheKey('gebco', 'wms:4/2/3'), 'v1:gebco:wms:4/2/3');
  assert.equal(mayPersist('https://wms.gebco.net/mapserv?layer=GEBCO_LATEST'), true);
  assert.equal(mayPersist('https://api.cesium.com/v1/assets/1/endpoint'), false);
  assert.equal(mayPersist('https://dev.virtualearth.net/REST/v1/Imagery'), false);
  assert.equal(mayPersist('https://tile.googleapis.com/v1/3dtiles/'), false);
});

check('global queries must not use the Ontario Overpass', () => {
  assert.equal(LOCAL_ONTARIO, 'http://127.0.0.1:12346/api/interpreter');
  assert.equal(bboxIsOntario(-180, -90, 180, 90), false);
  assert.equal(bboxIsOntario(-40, 30, 10, 55), false);
  assert.equal(pickMirrors(defaultMirrors(), 0, false).some((m) => m.ontarioOnly), false);
  assert.equal(MISS_LIMIT, 3);
  const m = defaultMirrors()[1];
  recordMiss(m, 0); recordMiss(m, 0); recordMiss(m, 0);
  assert.ok(m.coolUntil > 0);
});

check('ship model mapping', () => {
  assert.equal(modelForAis(30, 'DEMO FISHING VESSEL'), 'fishing');
  assert.equal(modelForAis(84, 'DEMO LPG CARRIER'), 'lpg');
  assert.equal(modelForAis(80, 'DEMO OIL TANKER'), 'tanker');
  assert.equal(modelForAis(70, 'DEMO MAERSK BOX'), 'container-maersk');
  assert.equal(modelForAis(70, 'DEMO COSCO BOX'), 'container-cosco');
  assert.equal(modelForAis(70, 'DEMO CARGO SHIP'), 'cargo');
  assert.equal(Object.keys(SHIP_MODELS).length, 6);
});

check('demo ships are labelled DEMO and mapped', () => {
  const ds = demoShips();
  assert.ok(ds.length >= 6);
  for (const s of ds) {
    assert.equal(s.demo, true);
    assert.match(s.name, /DEMO/);
    const c = shipCard(s);
    assert.equal(c.kind, 'ship');
    assert.match(c.summary || '', /DEMO/);
    assert.ok(cardRows(c).some((r) => r.key === 'Source' && r.href));
  }
});

check('wrecks fixture has source links and Titanic', () => {
  const all = allWrecks();
  assert.ok(all.length >= 15);
  const t = all.find((w) => w.id === 'rms-titanic');
  assert.ok(t);
  assert.ok(t!.sourceUrl.startsWith('https://'));
  const c = wreckCard(t!);
  assert.equal(c.kind, 'wreck');
  assert.ok(c.depthM && c.depthM > 1000);
  assert.ok(cardRows(c).some((r) => r.key === 'Licence'));
  assert.equal(wrecksCollection().features.length, all.length);
});

check('cables are ESTIMATE and not TeleGeography', () => {
  const all = allCables();
  assert.ok(all.length >= 3);
  for (const c of all) {
    assert.equal(c.estimate, true);
    assert.equal(isForbiddenSource(c.sourceUrl), false);
    assert.ok(cableCard(c).estimate);
  }
  assert.equal(isForbiddenSource('https://www.submarinecablemap.com/'), true);
  assert.equal(isForbiddenSource('https://www.telegeography.com/'), true);
});

check('ports, sites, webcams have source URLs', () => {
  assert.ok(allPorts().length >= 8);
  assert.ok(portCard(allPorts()[0]!).sourceUrl.startsWith('https://'));
  assert.ok(allSites().length >= 6);
  assert.ok(allWebcams().every((c) => c.sourceUrl.startsWith('https://')));
});

check('AIS parser and mode', () => {
  const s = parseAisStreamMessage({
    MetaData: { latitude: 1.26, longitude: 103.9, ShipName: 'COSCO DEMO', MMSI: 111, shipType: 70 },
    Message: { PositionReport: { Cog: 10, Sog: 14, TrueHeading: 12 } },
  });
  assert.ok(s);
  assert.equal(s!.model, 'container-cosco');
  assert.equal(s!.demo, false);
  assert.equal(pickAisMode({ proxyUp: true, hasKey: false }), 'aisstream');
  assert.equal(pickAisMode({ proxyUp: false, hasKey: false }), 'demo');
});

check('layer registry and live endpoints listed', () => {
  assert.ok(LAYERS.length >= 15);
  assert.ok(LAYERS.every((l) => l.source.length > 3));
  const en = defaultEnabled();
  assert.equal(en.wrecks, true);
  assert.equal(en.ais, true);
  assert.ok(ENDPOINTS.gebcoWms.includes('gebco'));
  assert.ok(ENDPOINTS.digitrafficAis.startsWith('https://'));
  assert.ok(densitySources().length >= 2);
  assert.ok(openMeteoMarineUrl(0, 0).startsWith('https://marine-api.open-meteo.com/'));
});

check('gitignore and env example do not contain a real key', () => {
  const gi = readFileSync(new URL('../.gitignore', import.meta.url), 'utf8');
  assert.match(gi, /\.env/);
  const ex = readFileSync(new URL('../.env.example', import.meta.url), 'utf8');
  const assigns = ex.split(/\n/).filter((l) => l.startsWith('AISSTREAM_API_KEY='));
  assert.ok(assigns.length >= 1);
  for (const line of assigns) assert.equal(line.trim(), 'AISSTREAM_API_KEY=');
  assert.equal(existsSync(new URL('../.env', import.meta.url)), false);
});

if (failed) { console.error(`${failed} failed`); process.exit(1); }
console.log('all tests passed');
