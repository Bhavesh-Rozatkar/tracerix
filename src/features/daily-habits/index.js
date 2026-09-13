import { esc } from '../../core/utils.js';
import { activeItems, getRecord, ensureDate } from '../../state/model.js';

const options = (list, value) => (list || []).map(o => `<option value="${esc(o)}" ${String(value ?? '') === String(o) ? 'selected' : ''}>${esc(o)}</option>`).join('');

export function view(date, state) {
  const items = activeItems(state, 'habit');
  const rows = items.map(item => {
    const r = getRecord(state, date, item.id);
    if (item.method === 'select') return `<div class="row"><div><div class="item-name">${esc(item.name)}</div><div class="muted">${esc(item.unit || 'Value')}</div></div><select data-feature="daily-habits" data-field="value" data-id="${esc(item.id)}"><option value="">—</option>${options(item.options, r?.value)}</select></div>`;
    return `<div class="row"><div class="item-name">${esc(item.name)}</div><input class="check" type="checkbox" data-feature="daily-habits" data-field="done" data-id="${esc(item.id)}" ${r?.done ? 'checked' : ''}></div>`;
  }).join('');
  return `<section class="section"><h2>Habits</h2><div class="section-body">${rows || '<div class="empty">Nothing here yet.</div>'}</div></section>`;
}

export function update(element, state, date) {
  const id = element.dataset.id;
  ensureDate(state, date);
  const record = { ...(state.records[date][id] || {}) };
  if (element.dataset.field === 'done') record.done = element.checked;
  else record.value = element.value;
  state.records[date][id] = record;
}
