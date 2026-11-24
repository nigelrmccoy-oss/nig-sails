/**
 * Persistent scenery / tile cache. Browser: IndexedDB + navigator.storage.persist().
 * Exe builds may attach window.mapCache (disk folder). 16 GB LRU cap.
 * Version-prefixed keys. Cache is read before the network by callers.
 * Never persist Bing, Cesium ion, or Google 3D Tiles (HTTP cache headers only).
 */
export const CACHE_VERSION = 'v1';
export const CACHE_CAP_BYTES = 16 * 1024 ** 3;
export const STORE = 'tiles';

export let cacheNotice = '';
export let storagePersisted: boolean | null = null;

export type CacheKind = 'overpass' | 'dem' | 'gebco' | 'grib' | 'geojson' | 'other';

interface Row { key: string; t: number; bytes: number; data: unknown }

interface DiskCache {
  get(key: string): Promise<Row | null>;
  put(row: Row): Promise<void>;
  stats(): Promise<{ count: number; bytes: number }>;
  clear(): Promise<void>;
  setCap?(bytes: number): Promise<number>;
}

declare global { interface Window { mapCache?: DiskCache } }

const disk = (): DiskCache | undefined =>
  typeof window !== 'undefined' ? window.mapCache : undefined;

export function cacheKey(kind: CacheKind, id: string): string {
  return `${CACHE_VERSION}:${kind}:${id}`;
}

/** False for Bing / Cesium ion / Google 3D Tiles — do not write these to IDB or disk. */
export function mayPersist(url: string): boolean {
  const u = url.toLowerCase();
  if (u.includes('virtualearth') || u.includes('bing.com') || /[?&]n=vye/i.test(url)) return false;
  if (u.includes('api.cesium.com') || u.includes('cesium.com/api') || u.includes('ion.cesium')) return false;
  if (u.includes('googleapis.com/v1/3dtiles') || u.includes('photorealistic') || u.includes('tile.googleapis.com')) return false;
  if (u.includes('google.com/maps/vt') && u.includes('3d')) return false;
  return true;
}

export async function askPersist(): Promise<boolean | null> {
  try {
    if (typeof navigator === 'undefined' || !navigator.storage?.persist || disk()) return storagePersisted;
    storagePersisted = (await navigator.storage.persisted()) || (await navigator.storage.persist());
    if (!storagePersisted) cacheNotice = 'Browser may clear the map cache (persistent storage not granted)';
    return storagePersisted;
  } catch {
    storagePersisted = false;
    return false;
  }
}

if (typeof window !== 'undefined') {
  void askPersist();
  window.addEventListener('pointerdown', () => { if (!storagePersisted) void askPersist(); }, { once: true });
}

let dbP: Promise<IDBDatabase | null> | null = null;

function openDb(dbName: string): Promise<IDBDatabase | null> {
  if (dbP) return dbP;
  dbP = new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'key' }).createIndex('t', 't');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbP;
}

export function bindCache(dbName: string) {
  async function cacheGet<T>(key: string): Promise<{ data: T; ageMs: number } | null> {
    const native = disk();
    if (native) {
      try {
        const r = await native.get(key);
        return r ? { data: r.data as T, ageMs: Date.now() - r.t } : null;
      } catch {
        cacheNotice = 'Map disk unavailable';
        return null;
      }
    }
    const db = await openDb(dbName);
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
        req.onsuccess = () => {
          const row = req.result as Row | undefined;
          resolve(row ? { data: row.data as T, ageMs: Date.now() - row.t } : null);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  let putCount = 0;

  async function evictIfNeeded(db: IDBDatabase): Promise<void> {
    try {
      const estimate = await navigator.storage?.estimate?.();
      const cap = Math.min(CACHE_CAP_BYTES, estimate?.quota ? 0.8 * estimate.quota : CACHE_CAP_BYTES);
      const usage = estimate?.usage ?? 0;
      if (usage <= cap) return;
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE, 'readwrite');
        const cursor = tx.objectStore(STORE).index('t').openCursor(null, 'next');
        let deleted = 0;
        cursor.onsuccess = () => {
          const c = cursor.result;
          if (!c || deleted >= 500) {
            cacheNotice = 'Map storage trimmed (oldest tiles)';
            resolve();
            return;
          }
          tx.objectStore(STORE).delete(c.primaryKey);
          deleted++;
          c.continue();
        };
        cursor.onerror = () => resolve();
      });
    } catch { /* fail soft */ }
  }

  async function cachePut(key: string, data: unknown): Promise<void> {
    const bytes = new Blob([JSON.stringify(data)]).size;
    const row: Row = { key, t: Date.now(), bytes, data };
    try {
      const native = disk();
      if (native) { await native.put(row); return; }
      const db = await openDb(dbName);
      if (!db) { cacheNotice = 'Map storage unavailable'; return; }
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(row);
        tx.oncomplete = () => {
          putCount++;
          if (putCount >= 50) { putCount = 0; void evictIfNeeded(db); }
          resolve();
        };
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } catch {
      cacheNotice = 'Map storage full or unavailable — existing tiles kept';
    }
  }

  async function cacheStats(): Promise<{ count: number; bytes: number; notice: string; persisted: boolean | null }> {
    const native = disk();
    if (native) return { ...await native.stats(), notice: cacheNotice, persisted: storagePersisted };
    const db = await openDb(dbName);
    let count = 0, bytes = 0;
    if (db) await new Promise<void>((resolve) => {
      const req = db.transaction(STORE).objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (!c) { resolve(); return; }
        const row = c.value as Row;
        count++;
        bytes += row.bytes || new Blob([JSON.stringify(row)]).size;
        c.continue();
      };
      req.onerror = () => resolve();
    });
    const estimate = await navigator.storage?.estimate?.();
    if (estimate?.quota && (estimate.usage ?? 0) / estimate.quota > 0.85) {
      cacheNotice = 'Map storage near browser quota';
    }
    return { count, bytes, notice: cacheNotice, persisted: storagePersisted };
  }

  async function clearMapCache(): Promise<void> {
    const native = disk();
    if (native) await native.clear();
    else {
      const db = await openDb(dbName);
      if (db) await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
    cacheNotice = '';
  }

  /** Cache-first GET for persistable URLs. Non-persistable URLs always hit the network. */
  async function cachedFetch(kind: CacheKind, id: string, url: string, init?: RequestInit): Promise<unknown> {
    if (!mayPersist(url)) {
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return res.json();
    }
    const key = cacheKey(kind, id);
    const hit = await cacheGet<unknown>(key);
    if (hit) return hit.data;
    const res = await fetch(url, init);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const data = await res.json();
    await cachePut(key, data);
    return data;
  }

  function hasDiskCache(): boolean { return !!disk(); }

  return { cacheGet, cachePut, cacheStats, clearMapCache, cachedFetch, hasDiskCache, evictIfNeeded };
}
