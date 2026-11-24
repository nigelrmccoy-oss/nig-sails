#!/usr/bin/env node
/**
 * Local AISStream websocket proxy. Binds 127.0.0.1 only.
 * Reads AISSTREAM_API_KEY from the environment, then
 * /home/nig/.config/nig-sails/aisstream.env, then a gitignored .env in this repo.
 * Never logs or returns the key.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env.AIS_PROXY_PORT || 5191);
const HOST = '127.0.0.1';
const UPSTREAM = 'wss://stream.aisstream.io/v0/stream';
const CONFIG_FILE = path.join(os.homedir(), '.config/nig-sails/aisstream.env');
const REPO_ENV = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');

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

function log(...a) {
  console.log(new Date().toISOString(), ...a);
}

const loaded = loadKey();
const keyConfigured = !!loaded.key;
log('ais-proxy listening setup', { host: HOST, port: PORT, keyConfigured, keySource: loaded.source, keyLen: loaded.key ? loaded.key.length : 0 });

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/health/') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ ok: true, keyConfigured, keySource: loaded.source }));
    return;
  }
  res.writeHead(404);
  res.end('not found');
});

const wss = new WebSocketServer({ server, path: '/stream' });
wss.on('connection', (client) => {
  if (!loaded.key) {
    client.close(1011, 'no-key');
    return;
  }
  const up = new WebSocket(UPSTREAM);
  let opened = false;
  up.on('open', () => { opened = true; log('upstream open'); });
  up.on('message', (data) => {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  });
  up.on('close', (code) => { log('upstream close', code); if (client.readyState === WebSocket.OPEN) client.close(); });
  up.on('error', (err) => { log('upstream error', err.message); });
  client.on('message', (data) => {
    let obj;
    try { obj = JSON.parse(String(data)); } catch { return; }
    if (!obj || typeof obj !== 'object') return;
    delete obj.APIKey;
    delete obj.apiKey;
    obj.APIKey = loaded.key;
    if (up.readyState === WebSocket.OPEN) up.send(JSON.stringify(obj));
    else up.once('open', () => up.send(JSON.stringify(obj)));
    log('forwarded subscribe (key stripped/injected, not logged)');
  });
  client.on('close', () => { if (opened || up.readyState !== WebSocket.CLOSED) up.close(); });
  client.on('error', () => { try { up.close(); } catch {} });
});

server.listen(PORT, HOST, () => {
  log('listening', `http://${HOST}:${PORT}/health`);
});
