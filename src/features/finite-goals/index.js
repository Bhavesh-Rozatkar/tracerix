import { esc } from '../../core/utils.js';
import { activeItems, ensureDate } from '../../state/model.js';
import { clamp, parseNumber } from '../../core/utils.js';

export function view(date, state) {
  const items = activeItems(state, 'goal');
  const rows = items.map(item => {
    const current = clamp(parseNumber(item.current, 0), 0, item.total);
    const percent = Math.round(current / item.total * 100);
    const complete = current >= item.total;
    return `<div class="goal-block"><div class="row"><div><div class="item-name">${esc(item.name)}</div><div class="muted">${current} / ${item.total} ${esc(item.unit)}</div></div><div class="control"><input class="number" type="number" min="0" max="${item.total}" step="1" value="${current}" data-feature="finite-goals" data-field="current" data-id="${item.id}"><span class="pct">${percent}%</span></div></div><div class="progress"><i style="width:${percent}%"></i></div>${complete ? '<div class="muted goal-complete">Complete</div>' : ''}</div>`;
  }).join('');
  return `<section class="section"><h2>Finite Goals</h2><div class="section-body">${rows || '<div class="empty">Nothing here yet.</div>'}</div></section>`;
}

export function update(element, state, date) {
  const id = element.dataset.id;
  const item = state.config.items.find(i => i.id === id && i.type === 'goal');
  if (!item) return;
  const value = clamp(parseNumber(element.value), 0, item.total);
  item.current = value;
  ensureDate(state, date);
  state.records[date][id] = { ...(state.records[date][id] || {}), value };
}
