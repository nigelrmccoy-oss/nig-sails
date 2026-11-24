import { askPersist, cacheNotice, storagePersisted } from '../map/MapCache.ts';
import { AIS_KEY_STORAGE } from '../ais.ts';

export type CacheApi = {
  cacheStats: () => Promise<{ count: number; bytes: number; notice: string; persisted: boolean | null }>;
  clearMapCache: () => Promise<void>;
};

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

export function bindOptions(
  root: HTMLElement,
  api: CacheApi,
  onAisKeyChange?: () => void,
): () => Promise<void> {
  const sizeEl = root.querySelector('#mcSize')!;
  const countEl = root.querySelector('#mcCount')!;
  const persistEl = root.querySelector('#mcPersist')!;
  const noticeEl = root.querySelector('#mcNotice')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('#mcClear')!;
  const keyInput = root.querySelector<HTMLInputElement>('#aisKey');
  const saveBtn = root.querySelector<HTMLButtonElement>('#aisSave');
  const clearKeyBtn = root.querySelector<HTMLButtonElement>('#aisClear');

  async function refresh(): Promise<void> {
    await askPersist();
    const s = await api.cacheStats();
    sizeEl.textContent = `${fmtBytes(s.bytes)} of 16 GB`;
    countEl.textContent = String(s.count);
    const p = s.persisted ?? storagePersisted;
    persistEl.textContent = p === true ? 'granted' : p === false ? 'not granted' : 'unknown';
    noticeEl.textContent = s.notice || cacheNotice || '';
    if (keyInput) keyInput.value = localStorage.getItem(AIS_KEY_STORAGE) ? '********' : '';
  }

  clearBtn.addEventListener('click', async () => {
    await api.clearMapCache();
    await refresh();
  });
  saveBtn?.addEventListener('click', () => {
    const v = keyInput?.value?.trim() || '';
    if (!v || v === '********') return;
    localStorage.setItem(AIS_KEY_STORAGE, v);
    if (keyInput) keyInput.value = '********';
    onAisKeyChange?.();
  });
  clearKeyBtn?.addEventListener('click', () => {
    localStorage.removeItem(AIS_KEY_STORAGE);
    if (keyInput) keyInput.value = '';
    onAisKeyChange?.();
  });
  void refresh();
  return refresh;
}

export function readLocalAisKey(): string | null {
  try {
    const v = localStorage.getItem(AIS_KEY_STORAGE);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}
