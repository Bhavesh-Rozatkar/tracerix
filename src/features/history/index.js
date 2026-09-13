import { esc, dateFromKey, dateKey } from '../../core/utils.js';
import { activeItems, getRecord } from '../../state/model.js';

export function view(state) {
  const habits = activeItems(state, 'habit');
  return `<section class="section"><div class="history-head"><strong>Habit history</strong>${habits.length ? `<select id="histItem">${habits.map(i => `<option value="${i.id}">${esc(i.name)}</option>`).join('')}</select><select id="histMode"><option value="week">Week</option><option value="month">Month</option></select>` : '<span class="muted">Add a habit in Manage to view history.</span>'}</div><div class="section-body" id="histBody"></div></section>`;
}

export function renderBody(state) {
  const body = document.getElementById('histBody');
  if (!body) return;
  const id = document.getElementById('histItem')?.value;
  if (!id) { body.innerHTML = ''; return; }
  const mode = document.getElementById('histMode')?.value || 'week';
  const anchor = dateFromKey(state.uiDate);
  const dates = [];
  if (mode === 'week') {
    const d = new Date(anchor); d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    for (let i = 0; i < 7; i++) { dates.push(new Date(d)); d.setDate(d.getDate() + 1); }
  } else {
    const y = anchor.getFullYear(), m = anchor.getMonth(), count = new Date(y, m + 1, 0).getDate();
    for (let i = 1; i <= count; i++) dates.push(new Date(y, m, i));
  }
  const rows = dates.map(d => {
    const key = dateKey(d), record = getRecord(state, key, id);
    let value = '—';
    if (record?.done) value = '✓';
    else if (record?.value !== undefined && record.value !== '') value = esc(record.value);
    return `<tr><td>${key}</td><td>${value}</td></tr>`;
  }).join('');
  body.innerHTML = `<table class="history-table"><thead><tr><th>Date</th><th>Record</th></tr></thead><tbody>${rows}</tbody></table>`;
}
