import { $, $$, today, shiftDate, parseNumber, uid } from './core/utils.js';
import { putVault, getVault } from './data/db.js';
import { seal } from './security/crypto.js';
import { createFreshState, normalizeItem, normalizeState, findItem } from './state/model.js';
import { configureSession, getSession, setUnlocked, setView, setDate, scheduleSave, touch, lock, isLocked } from './state/session.js';
import { saveState, createOrUnlock } from './state/persistence.js';
import { exportVault, importFile } from './features/backups/index.js';
import { openEditor } from './ui/modal.js';
import { renderLock } from './views/lock.js';
import * as DailyHabits from './features/daily-habits/index.js';
import * as FiniteGoals from './features/finite-goals/index.js';
import * as InfiniteSkills from './features/infinite-skills/index.js';
import * as NegativeHabits from './features/negative-habits/index.js';
import * as DailyNotes from './features/daily-notes/index.js';
import * as History from './features/history/index.js';
import * as Management from './features/management/index.js';

const app = $('#app');
configureSession({ save: saveState, render });

function render() {
  const session = getSession();
  if (session.locked) { renderLock({ onUnlock: unlock }); return; }
  const date = session.uiDate || today();
  const view = session.view || 'day';
  session.state.uiDate = date;
  const content = view === 'day' ? renderDaily(date, session.state) : view === 'history' ? History.view(session.state) : Management.view(session.state);
  app.innerHTML = `<main class="shell"><header class="top"><div><div class="brand">Tracerix</div><div class="muted">${date}</div></div><nav class="nav"><button class="${view === 'day' ? 'active' : ''}" data-view="day">Today</button><button class="${view === 'history' ? 'active' : ''}" data-view="history">History</button><button class="${view === 'manage' ? 'active' : ''}" data-view="manage">Manage</button><button data-action="lock">Lock</button></nav></header>${content}</main>`;
  bind();
  if (view === 'history') History.renderBody(session.state);
  touch();
}

function renderDaily(date, state) {
  return `<div class="actions"><input type="date" id="date" value="${date}"><button class="btn" data-action="prev">←</button><button class="btn" data-action="next">→</button></div>${DailyHabits.view(date, state)}${FiniteGoals.view(date, state)}${InfiniteSkills.view(date, state)}${NegativeHabits.view(date, state)}${DailyNotes.view(date, state)}`;
}

async function unlock(passphrase) {
  const p = String(passphrase || '');
  if (p.length < 8) { const err = $('#err'); if (err) err.textContent = 'Use a passphrase of at least 8 characters.'; return; }
  try {
    const result = await createOrUnlock(p);
    if (!result.existing) {
      const state = result.state;
      await putVault(await seal(state, p));
      setUnlocked(state, p);
    } else setUnlocked(result.state, p);
    setView('day'); setDate(today()); getSession().state.uiDate = today(); render();
  } catch { const err = $('#err'); if (err) err.textContent = 'Incorrect passphrase or corrupted vault.'; }
}

function updateFeature(element) {
  const session = getSession();
  const date = session.uiDate || today();
  const feature = element.dataset.feature;
  if (feature === 'daily-habits') DailyHabits.update(element, session.state, date);
  else if (feature === 'finite-goals') FiniteGoals.update(element, session.state, date);
  else if (feature === 'infinite-skills') InfiniteSkills.update(element, session.state, date);
  else if (feature === 'negative-habits') NegativeHabits.update(element, session.state, date);
  else return;
  scheduleSave(); touch();
}

async function saveEditor(data) {
  const state = getSession().state;
  let item = data.item;
  if (!item) { item = normalizeItem({ id: uid(), type: data.type, name: data.name, archived: false }); state.config.items.push(item); }
  item.name = data.name; item.archived = false;
  if (data.type === 'habit' || data.type === 'personal') { item.method = data.method; item.unit = data.unit; item.options = data.options; }
  else if (data.type === 'goal') { item.total = Math.max(1, parseNumber(data.total, 1)); item.current = Math.min(item.total, Math.max(0, parseNumber(data.current))); item.unit = data.unit; }
  else if (data.type === 'skill') item.tracking = data.tracking;
  await saveState(); render();
}

function bind() {
  $$('[data-view]').forEach(b => b.onclick = () => { setView(b.dataset.view); render(); });
  $('#date')?.addEventListener('change', e => { setDate(e.target.value || today()); render(); });
  $('[data-action="prev"]')?.addEventListener('click', () => { setDate(shiftDate(getSession().uiDate || today(), -1)); render(); });
  $('[data-action="next"]')?.addEventListener('click', () => { setDate(shiftDate(getSession().uiDate || today(), 1)); render(); });
  $$('[data-feature]').forEach(el => { const event = el.matches('input[type="text"], textarea') ? 'input' : 'change'; el.addEventListener(event, () => updateFeature(el)); });
  $('#notes')?.addEventListener('input', e => { const s = getSession(); DailyNotes.update(e.target.value, s.state, s.uiDate || today()); scheduleSave(); touch(); });
  $$('[data-add]').forEach(b => b.onclick = () => openEditor({ type: b.dataset.add, onSave: saveEditor }));
  $$('[data-edit]').forEach(b => b.onclick = () => openEditor({ item: findItem(getSession().state, b.dataset.edit), onSave: saveEditor }));
  $$('[data-archive]').forEach(b => b.onclick = async () => { const item = findItem(getSession().state, b.dataset.archive); if (!item) return; item.archived = true; await saveState(); render(); });
  $('[data-action="lock"]')?.addEventListener('click', lock);
  $('[data-action="fullExport"]')?.addEventListener('click', () => exportVault(false).catch(() => alert('Export failed. Please try again.')));
  $('[data-action="recordsExport"]')?.addEventListener('click', () => exportVault(true).catch(() => alert('Export failed. Please try again.')));
  $('#import')?.addEventListener('change', async e => { const file = e.target.files?.[0]; if (!file) return; try { if (await importFile(file)) render(); } catch { alert('Import failed: invalid, corrupted, incompatible, or incorrectly encrypted file.'); } finally { e.target.value = ''; } });
  $('#lockMin')?.addEventListener('change', async e => { const s = getSession(); s.state.config.lockMinutes = Math.max(1, parseNumber(e.target.value, 15)); await saveState(); touch(); });
  $('#histItem')?.addEventListener('change', () => History.renderBody(getSession().state));
  $('#histMode')?.addEventListener('change', () => History.renderBody(getSession().state));
}

window.addEventListener('pointerdown', () => { if (!isLocked()) touch(); });
window.addEventListener('keydown', () => { if (!isLocked()) touch(); });
window.addEventListener('visibilitychange', () => { if (!document.hidden && !isLocked()) touch(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
render();
