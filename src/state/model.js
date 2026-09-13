import { APP_VERSION, DEFAULT_LOCK_MINUTES } from '../core/constants.js';
import { clamp, parseNumber, uid } from '../core/utils.js';

export function createFreshState() {
  return {
    version: APP_VERSION,
    config: { lockMinutes: DEFAULT_LOCK_MINUTES, items: [], createdAt: new Date().toISOString() },
    records: {}
  };
}
export function normalizeItem(item = {}) {
  const x = { ...item };
  x.id = x.id || uid();
  x.name = String(x.name || 'Untitled').trim() || 'Untitled';
  x.archived = !!x.archived;
  x.createdAt = x.createdAt || new Date().toISOString();
  if (x.type === 'habit') {
    x.method = x.method === 'select' ? 'select' : 'check';
    x.unit = String(x.unit || '');
    x.options = Array.isArray(x.options) ? x.options.map(String).filter(Boolean) : [];
  } else if (x.type === 'goal') {
    x.total = Math.max(1, parseNumber(x.total, 1));
    x.current = clamp(parseNumber(x.current, 0), 0, x.total);
    x.unit = String(x.unit || 'units');
  } else if (x.type === 'skill') {
    const t = x.tracking || {};
    x.tracking = {
      completed: t.completed !== false,
      time: !!t.time,
      repetitions: !!t.repetitions,
      rounds: !!t.rounds,
      note: t.note !== false
    };
  } else if (x.type === 'personal') {
    x.method = ['check', 'count', 'duration', 'select'].includes(x.method) ? x.method : 'count';
    x.unit = String(x.unit || '');
    x.options = Array.isArray(x.options) ? x.options.map(String).filter(Boolean) : [];
  }
  return x;
}
export function normalizeState(source) {
  const fresh = createFreshState();
  const config = source?.config || {};
  fresh.config = { ...fresh.config, ...config };
  fresh.config.lockMinutes = Math.max(1, parseNumber(fresh.config.lockMinutes, DEFAULT_LOCK_MINUTES));
  fresh.config.items = Array.isArray(config.items) ? config.items.map(normalizeItem) : [];
  fresh.records = source?.records && typeof source.records === 'object' && !Array.isArray(source.records) ? source.records : {};
  return fresh;
}
export function activeItems(state, type) { return state.config.items.filter(i => i.type === type && !i.archived); }
export function findItem(state, id) { return state.config.items.find(i => i.id === id); }
export function ensureDate(state, date) { if (!state.records[date]) state.records[date] = {}; }
export function getRecord(state, date, id) { return state.records[date]?.[id] || null; }
export function setRecord(state, date, id, record) { ensureDate(state, date); state.records[date][id] = record; }
