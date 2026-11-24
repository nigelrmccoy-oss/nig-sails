#!/usr/bin/env node
/**
 * Short AISStream check: connect through the local proxy if up, else directly
 * using the same key loader as the proxy. Prints message counts only. Never prints the key.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';

const CONFIG_FILE = path.join(os.homedir(), '.config/nig-sails/aisstream.env');
const REPO_ENV = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
const SECONDS = Number(process.env.AIS_VERIFY_SECONDS || 12);
const PROXY = process.env.AIS_VERIFY_PROXY || 'ws://127.0.0.1:5191/stream';
const UPSTREAM = 'wss://stream.aisstream.io/v0/stream';

function parseEnvFile(file) {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf('=');
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (k === 'AISSTREAM_API_KEY' && v) return v;
  }
  return null;
}

function loadKey() {
  const fromEnv = (process.env.AISSTREAM_API_KEY || '').trim();
  if (fromEnv) return { key: fromEnv, source: 'env' };
  const fromConfig = parseEnvFile(CONFIG_FILE);
  if (fromConfig) return { key: fromConfig, source: 'config-file' };
  const fromRepo = parseEnvFile(REPO_ENV);
  if (fromRepo) return { key: fromRepo, source: 'repo-env' };
  return { key: '', source: 'none' };
}

const box = [[[49.5, -1.8], [51.6, 2.2]]]; // English Channel [lat,lon] SW–NE
const counts = { messages: 0, byType: {}, parseOk: 0, errors: 0 };
const loaded = loadKey();
console.log('verify start', { seconds: SECONDS, keyConfigured: !!loaded.key, keySource: loaded.source, keyLen: loaded.key ? loaded.key.length : 0 });

async function proxyUp() {
  try {
    const r = await fetch('http://127.0.0.1:5191/health', { signal: AbortSignal.timeout(800) });
    if (!r.ok) return false;
    const j = await r.json();
    console.log('proxy health', { ok: j.ok, keyConfigured: j.keyConfigured, keySource: j.keySource });
    return !!(j.ok && j.keyConfigured);
  } catch {
    console.log('proxy not reachable');
    return false;
  }
}

const useProxy = await proxyUp();
const url = useProxy ? PROXY : UPSTREAM;
if (!useProxy && !loaded.key) {
  console.log('FAIL no proxy and no key');
  process.exit(2);
}

const ws = new WebSocket(url);
const t0 = Date.now();
ws.on('open', () => {
  const sub = { BoundingBoxes: box, FilterMessageTypes: ['PositionReport'] };
  if (!useProxy) sub.APIKey = loaded.key;
  ws.send(JSON.stringify(sub));
  console.log('subscribed', { via: useProxy ? 'proxy' : 'direct', area: 'english-channel' });
});
ws.on('message', (data) => {
  counts.messages += 1;
  try {
    const j = JSON.parse(String(data));
    const typ = j.MessageType || j.messageType || (j.Message && Object.keys(j.Message)[0]) || j.error || 'unknown';
    counts.byType[typ] = (counts.byType[typ] || 0) + 1;
    if (typ && typ !== 'error' && typ !== 'unknown') counts.parseOk += 1;
    if (j.error || typ === 'error') counts.errors += 1;
  } catch {
    counts.errors += 1;
  }
});
ws.on('error', (err) => {
  console.log('ws error', err.message);
  counts.errors += 1;
});
ws.on('close', (code) => {
  console.log('ws close', code);
});

setTimeout(() => {
  try { ws.close(); } catch {}
  const ms = Date.now() - t0;
  console.log('verify result', { elapsedMs: ms, via: useProxy ? 'proxy' : 'direct', ...counts, connected: counts.messages > 0 || counts.errors === 0 });
  process.exit(counts.messages > 0 ? 0 : 1);
}, SECONDS * 1000);
