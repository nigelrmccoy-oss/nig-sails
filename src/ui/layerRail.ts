import { LAYERS, type LayerId } from '../layers.ts';

export function bindLayerRail(
  root: HTMLElement,
  enabled: Record<LayerId, boolean>,
  onChange: (id: LayerId, on: boolean) => void,
): void {
  const list = root.querySelector('#layerList') ?? root;
  list.replaceChildren();
  let group = '';
  for (const l of LAYERS) {
    if (l.group !== group) {
      group = l.group;
      const h = document.createElement('h4');
      h.textContent = group;
      list.append(h);
    }
    const lab = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = enabled[l.id];
    cb.dataset.layer = l.id;
    cb.addEventListener('change', () => onChange(l.id, cb.checked));
    const span = document.createElement('span');
    span.textContent = `${l.label} (${l.status})`;
    span.title = l.source;
    lab.append(cb, span);
    list.append(lab);
  }
}
