import { esc } from '../../core/utils.js';
import { activeItems, getRecord, ensureDate } from '../../state/model.js';

export function view(date, state) {
  const items = activeItems(state, 'skill');
  const rows = items.map(item => {
    const r = getRecord(state, date, item.id) || {};
    const t = item.tracking;
    return `<div class="skill-block"><div class="row"><div class="item-name">${esc(item.name)}</div><div class="control">${t.completed ? `<label class="muted">Done <input class="check" type="checkbox" data-feature="infinite-skills" data-field="done" data-id="${item.id}" ${r.done ? 'checked' : ''}></label>` : ''}${t.time ? `<input class="number" type="number" min="0" step="1" placeholder="min" value="${r.minutes ?? ''}" data-feature="infinite-skills" data-field="minutes" data-id="${item.id}">` : ''}${t.repetitions ? `<input class="number" type="number" min="0" step="1" placeholder="reps" value="${r.repetitions ?? ''}" data-feature="infinite-skills" data-field="repetitions" data-id="${item.id}">` : ''}${t.rounds ? `<input class="number" type="number" min="0" step="1" placeholder="rounds" value="${r.rounds ?? ''}" data-feature="infinite-skills" data-field="rounds" data-id="${item.id}">` : ''}</div></div>${t.note ? `<input class="inline-note" data-feature="infinite-skills" data-field="note" data-id="${item.id}" placeholder="Optional note" value="${esc(r.note || '')}">` : ''}</div>`;
  }).join('');
  return `<section class="section"><h2>Infinite Skills</h2><div class="section-body">${rows || '<div class="empty">Nothing here yet.</div>'}</div></section>`;
}

export function update(element, state, date) {
  const id = element.dataset.id;
  ensureDate(state, date);
  const record = { ...(state.records[date][id] || {}) };
  const field = element.dataset.field;
  if (field === 'done') record.done = element.checked;
  else if (field === 'note') record.note = element.value;
  else record[field] = element.value === '' ? null : Math.max(0, Number(element.value) || 0);
  state.records[date][id] = record;
}
