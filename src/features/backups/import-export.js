import { APP_VERSION } from '../../core/constants.js';
import { clone, downloadBlob, today, parseNumber } from '../../core/utils.js';
import { seal, unseal } from '../../security/crypto.js';
import { normalizeState } from '../../state/model.js';
import { getSession } from '../../state/session.js';
import { saveState } from '../../state/persistence.js';

export function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid data.');
  if (payload.type === 'full') {
    if (!payload.config || !Array.isArray(payload.config.items) || !payload.records || typeof payload.records !== 'object') throw new Error('Invalid full backup.');
  } else if (payload.type === 'records') {
    if (!payload.records || typeof payload.records !== 'object') throw new Error('Invalid records backup.');
  } else throw new Error('Unsupported backup type.');
}
export function convertTemplate(x) {
  return {
    version: APP_VERSION,
    type: 'full',
    config: {
      lockMinutes: Number(x.settings?.autoLockMinutes) || 15,
      items: [
        ...(x.habits || []).map(h => ({ id: h.id, name: h.name, type: 'habit', method: h.type === 'measurement' ? 'select' : 'check', unit: h.unit || '', options: h.options || [], archived: h.active === false })),
        ...(x.finiteGoals || []).map(g => ({ id: g.id, name: g.name, type: 'goal', total: Number(g.total) || 1, current: Number(g.completed) || 0, unit: g.unit || 'units', archived: g.active === false })),
        ...(x.infiniteSkills || []).map(s => ({ id: s.id, name: s.name, type: 'skill', tracking: s.tracking || {}, archived: s.active === false })),
        ...(x.personalHabits || []).map(p => ({ id: p.id, name: p.name, type: 'personal', method: p.type === 'count' ? 'count' : p.type === 'duration' ? 'duration' : p.type === 'checkbox' ? 'check' : 'select', unit: p.unit || '', options: p.options || [], archived: p.active === false }))
      ]
    },
    records: convertRecords(x.dailyRecords || [])
  };
}
function convertRecords(rows) {
  const out = {};
  for (const row of rows) {
    if (!row?.date) continue;
    const r = {};
    for (const [id, value] of Object.entries(row.habits || {})) r[id] = value;
    for (const [id, value] of Object.entries(row.finiteGoals || {})) r[id] = { value: parseNumber(value?.completed, 0) };
    for (const [id, value] of Object.entries(row.infiniteSkills || {})) r[id] = value;
    for (const [id, value] of Object.entries(row.personalHabits || {})) r[id] = { done: !!value.occurred, value: value.value ?? 0 };
    r.notes = row.notes || '';
    out[row.date] = r;
  }
  return out;
}
export async function exportVault(recordsOnly) {
  const session = getSession();
  const payload = recordsOnly
    ? { version: APP_VERSION, type: 'records', exportedAt: new Date().toISOString(), records: clone(session.state.records) }
    : { version: APP_VERSION, type: 'full', exportedAt: new Date().toISOString(), config: clone(session.state.config), records: clone(session.state.records) };
  const encrypted = await seal(payload, session.passphrase);
  downloadBlob(new Blob([JSON.stringify(encrypted)], { type: 'application/octet-stream' }), `tracerix-${recordsOnly ? 'records' : 'full-backup'}-${today()}.vault`);
}
export async function importFile(file) {
  const session = getSession();
  const raw = JSON.parse(await file.text());
  let imported;
  if (raw.format === 'tracerix-vault') imported = await unseal(raw, session.passphrase);
  else if (raw.format === 'tracerix' && raw.version) imported = convertTemplate(raw);
  else throw new Error('Unsupported file.');
  validatePayload(imported);
  if (imported.type === 'full') {
    const next = normalizeState({ config: imported.config, records: imported.records });
    if (!confirm('Replace current configuration and records with this full backup?')) return false;
    session.state = next;
    await saveState();
  } else {
    if (!confirm('Merge imported records into current records?')) return false;
    for (const [date, records] of Object.entries(imported.records)) session.state.records[date] = { ...(session.state.records[date] || {}), ...records };
    await saveState();
  }
  return true;
}
