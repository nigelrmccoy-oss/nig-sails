import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { bindCache } from './map/MapCache.ts';
import { ODBL_CREDIT } from './map/OverpassClient.ts';
import { bindOptions, readLocalAisKey } from './ui/options.ts';
import { bindLayerRail } from './ui/layerRail.ts';
import { bindCard } from './cards.ts';
import { LAYERS, defaultEnabled, type LayerId } from './layers.ts';
import { gebcoWms, emodnetBathyWms } from './bathymetry.ts';
import { wrecksCollection } from './wrecks.ts';
import { cablesCollection } from './cables.ts';
import { portsCollection } from './ports.ts';
import { lanesCollection } from './shipping.ts';
import { sitesCollection } from './research.ts';
import { webcamsCollection } from './webcams.ts';
import { buoysCollection } from './weather.ts';
import { lightsCollection } from './lights.ts';
import { cardFor } from './lookup.ts';
import { demoShips, pickAisMode, shipCard, type AisShip } from './ais.ts';
import { modelUrl } from './ships.ts';
import { demoCurrentArrows } from './currents.ts';
import { ENDPOINTS } from './endpoints.ts';

const cache = bindCache('nig-sails-map');

// Cesium, not Three.js: Nigel asked for a Google Earth-style globe with many
// imagery/vector layers, 3D ship models, and picking. That matches Cesium
// (same stack as grid-globe, including the baseLayer fix). Cable-globe's
// open cable fixtures and historic ESTIMATE routes are reused as one layer.
Cesium.Ion.defaultAccessToken = '';
const osm = new Cesium.OpenStreetMapImageryProvider({
  url: ENDPOINTS.osmTiles,
  credit: ODBL_CREDIT,
});
const viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,
  timeline: false,
  geocoder: false,
  baseLayerPicker: false,
  baseLayer: new Cesium.ImageryLayer(osm),
  terrainProvider: new Cesium.EllipsoidTerrainProvider(),
  requestRenderMode: true,
});
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-30, 20, 12_000_000),
  duration: 0,
});

const enabled = defaultEnabled();
const imagery: Partial<Record<LayerId, Cesium.ImageryLayer>> = {};
const sources: Partial<Record<LayerId, Cesium.GeoJsonDataSource>> = {};
const shipEntities = new Map<string, Cesium.Entity>();

function wms(desc: { url: string; layers: string; credit: string }): Cesium.ImageryLayer {
  const provider = new Cesium.WebMapServiceImageryProvider({
    url: desc.url,
    layers: desc.layers,
    parameters: { transparent: true, format: 'image/png', service: 'WMS', version: '1.3.0', request: 'GetMap' },
    credit: desc.credit,
    enablePickFeatures: false,
  });
  const layer = viewer.imageryLayers.addImageryProvider(provider);
  return layer;
}

function addGeo(id: LayerId, data: object, color: string, point = true): void {
  void Cesium.GeoJsonDataSource.load(data, {
    stroke: Cesium.Color.fromCssColorString(color),
    fill: Cesium.Color.fromCssColorString(color).withAlpha(0.35),
    strokeWidth: 2,
    clampToGround: false,
  }).then((ds) => {
    ds.name = id;
    for (const e of ds.entities.values) {
      const props = e.properties;
      const kind = props?.kind?.getValue?.() ?? id;
      const fid = String(props?.id?.getValue?.() ?? e.id);
      e.name = String(props?.name?.getValue?.() ?? fid);
      (e as Cesium.Entity & { nsKind?: string; nsId?: string }).nsKind = kind;
      (e as Cesium.Entity & { nsKind?: string; nsId?: string }).nsId = fid;
      if (point && e.position && !e.billboard && !e.point) {
        e.point = new Cesium.PointGraphics({
          color: Cesium.Color.fromCssColorString(color),
          pixelSize: 8,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
        });
      }
    }
    sources[id] = ds;
    if (enabled[id]) void viewer.dataSources.add(ds);
  });
}

const g = gebcoWms();
imagery.gebco = wms(g);
imagery.gebco.show = enabled.gebco;
const e = emodnetBathyWms();
imagery['emodnet-bathy'] = wms(e);
imagery['emodnet-bathy'].show = enabled['emodnet-bathy'];

addGeo('wrecks', wrecksCollection(), '#e3b341');
addGeo('ports', portsCollection(), '#7fd4ff');
addGeo('research', sitesCollection(), '#b07dff');
addGeo('webcams', webcamsCollection(), '#ff7dce');
addGeo('buoys', buoysCollection(), '#7dffb0');
addGeo('lights', lightsCollection(), '#ffe27d');
addGeo('cables', cablesCollection(), '#5ad0e8', false);
addGeo('lanes', lanesCollection(), '#f0a060', false);

const currentDs = new Cesium.CustomDataSource('currents');
for (const a of demoCurrentArrows()) {
  currentDs.entities.add({
    name: a.source,
    position: Cesium.Cartesian3.fromDegrees(a.lon, a.lat),
    point: { pixelSize: 10, color: Cesium.Color.CYAN },
    properties: { kind: 'other', id: `current-${a.lat}-${a.lon}` },
  });
}
sources.currents = currentDs as unknown as Cesium.GeoJsonDataSource;
if (enabled.currents) void viewer.dataSources.add(currentDs);

async function placeShip(s: AisShip): Promise<void> {
  const pos = Cesium.Cartesian3.fromDegrees(s.lon, s.lat, 20);
  const heading = Cesium.Math.toRadians(-(s.heading ?? s.cog ?? 0));
  const hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
  const orient = Cesium.Transforms.headingPitchRollQuaternion(pos, hpr);
  let ent = shipEntities.get(s.id);
  if (!ent) {
    ent = viewer.entities.add({
      id: s.id,
      name: s.name,
      position: pos,
      orientation: orient,
      model: {
        uri: modelUrl(s.model),
        minimumPixelSize: 32,
        maximumScale: 20000,
        scale: 1,
      },
      label: {
        text: s.demo ? `${s.name}` : s.name,
        font: '12px sans-serif',
        fillColor: Cesium.Color.WHITE,
        pixelOffset: new Cesium.Cartesian2(0, -24),
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString('#071018cc'),
        scaleByDistance: new Cesium.NearFarScalar(1e3, 1, 2e6, 0.2),
      },
    });
    (ent as Cesium.Entity & { nsKind?: string; nsId?: string }).nsKind = 'ship';
    (ent as Cesium.Entity & { nsKind?: string; nsId?: string }).nsId = s.id;
    shipEntities.set(s.id, ent);
    (ent as Cesium.Entity & { ship?: AisShip }).ship = s;
  } else {
    ent.position = new Cesium.ConstantPositionProperty(pos);
    ent.orientation = new Cesium.ConstantProperty(orient);
    (ent as Cesium.Entity & { ship?: AisShip }).ship = s;
  }
}

let aisMode = pickAisMode({ proxyUp: false, hasKey: !!readLocalAisKey() });
const ships: AisShip[] = [];

async function startAis(): Promise<void> {
  ships.length = 0;
  for (const s of demoShips()) {
    ships.push(s);
    if (enabled.ais) await placeShip(s);
  }
  let proxyUp = false;
  try {
    const r = await fetch(ENDPOINTS.aisProxyHealth, { signal: AbortSignal.timeout(1500) });
    if (r.ok) {
      const j = await r.json() as { ok?: boolean; keyConfigured?: boolean };
      proxyUp = !!(j.ok && j.keyConfigured);
    }
  } catch { /* proxy optional */ }
  aisMode = pickAisMode({ proxyUp, hasKey: !!readLocalAisKey() });
  const kpi = document.querySelector('#kpiAis');
  if (kpi) kpi.textContent = proxyUp ? 'aisstream (proxy)' : aisMode;
  document.querySelector('#aisStatus')!.textContent = proxyUp
    ? 'AIS: local proxy reports a key is configured (not shown).'
    : 'AIS: proxy not up — showing DEMO ships. Finland Digitraffic / Norway Kystverket are fallbacks (see prompts).';
  refreshKpis();
}

const card = bindCard(document.querySelector<HTMLElement>('#card')!);
const opt = document.querySelector<HTMLElement>('#options')!;
document.querySelector('#optBtn')!.addEventListener('click', () => {
  opt.hidden = !opt.hidden;
  if (!opt.hidden) document.querySelector<HTMLElement>('#card')!.hidden = true;
});
void bindOptions(opt, cache, () => { void startAis(); });

function setLayer(id: LayerId, on: boolean): void {
  enabled[id] = on;
  if (imagery[id]) imagery[id]!.show = on;
  const ds = sources[id];
  if (ds) {
    const has = viewer.dataSources.contains(ds);
    if (on && !has) void viewer.dataSources.add(ds);
    if (!on && has) viewer.dataSources.remove(ds, false);
  }
  if (id === 'ais') {
    if (on) { for (const s of ships) void placeShip(s); }
    else {
      for (const e of shipEntities.values()) viewer.entities.remove(e);
      shipEntities.clear();
    }
  }
  refreshKpis();
  viewer.scene.requestRender();
}

bindLayerRail(document.querySelector<HTMLElement>('#layerRail')!, enabled, setLayer);

viewer.selectedEntityChanged.addEventListener((ent) => {
  if (!ent) return;
  const kind = (ent as Cesium.Entity & { nsKind?: string }).nsKind
    || ent.properties?.kind?.getValue?.();
  const id = (ent as Cesium.Entity & { nsId?: string }).nsId
    || String(ent.properties?.id?.getValue?.() ?? ent.id);
  if (kind === 'ship') {
    const s = (ent as Cesium.Entity & { ship?: AisShip }).ship || ships.find((x) => x.id === id);
    if (s) { opt.hidden = true; card.show(shipCard(s)); }
    return;
  }
  if (kind && id) {
    const c = cardFor(String(kind), String(id));
    if (c) { opt.hidden = true; card.show(c); }
  }
});

function refreshKpis(): void {
  document.querySelector('#kpiShips')!.textContent = String(enabled.ais ? ships.length : 0);
  document.querySelector('#kpiWrecks')!.textContent = String(wrecksCollection().features.length);
  document.querySelector('#kpiLayers')!.textContent = String(LAYERS.filter((l) => enabled[l.id]).length);
}

document.querySelector('#foot')!.textContent =
  `${ODBL_CREDIT} · GEBCO (public domain) · EMODnet (CC BY 4.0) · open wreck, port, research and webcam sources. No TeleGeography. See SOURCES.md.`;

void startAis();
void cache;
