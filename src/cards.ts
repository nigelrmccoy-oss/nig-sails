/** Info-card model for wrecks, sites, cams, buoys, ships, cables and ports. */

export type CardKind = 'wreck' | 'site' | 'webcam' | 'buoy' | 'ship' | 'cable' | 'port' | 'lane' | 'other';

export type InfoCard = {
  id: string;
  kind: CardKind;
  name: string;
  date?: string;
  depthM?: number | null;
  summary?: string;
  lat?: number;
  lon?: number;
  sourceName: string;
  sourceUrl: string;
  licence: string;
  estimate?: boolean;
  extra?: Record<string, string>;
};

export function cardRows(c: InfoCard): { key: string; value: string; href?: string }[] {
  const rows: { key: string; value: string; href?: string }[] = [];
  rows.push({ key: 'Kind', value: c.kind });
  if (c.date) rows.push({ key: 'Date', value: c.date });
  if (c.depthM != null && Number.isFinite(c.depthM)) rows.push({ key: 'Depth', value: `${c.depthM} m` });
  if (c.lat != null && c.lon != null) rows.push({ key: 'Position', value: `${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}` });
  if (c.summary) rows.push({ key: 'Notes', value: c.summary });
  if (c.estimate) rows.push({ key: 'Flag', value: 'ESTIMATE' });
  if (c.extra) {
    for (const [k, v] of Object.entries(c.extra)) rows.push({ key: k, value: v });
  }
  rows.push({ key: 'Source', value: c.sourceName, href: c.sourceUrl });
  rows.push({ key: 'Licence', value: c.licence });
  return rows;
}

export function bindCard(root: HTMLElement): { show: (c: InfoCard) => void; hide: () => void } {
  const title = root.querySelector('#cardTitle')!;
  const body = root.querySelector('#cardBody')!;
  const close = root.querySelector<HTMLButtonElement>('#cardClose');
  function hide(): void { root.hidden = true; }
  close?.addEventListener('click', hide);
  function show(c: InfoCard): void {
    title.textContent = c.name;
    body.replaceChildren();
    for (const row of cardRows(c)) {
      const dt = document.createElement('dt');
      dt.textContent = row.key;
      const dd = document.createElement('dd');
      if (row.href) {
        const a = document.createElement('a');
        a.href = row.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = row.value;
        dd.append(a);
      } else {
        dd.textContent = row.value;
        if (row.value === 'ESTIMATE') dd.classList.add('est');
      }
      body.append(dt, dd);
    }
    root.hidden = false;
  }
  return { show, hide };
}
