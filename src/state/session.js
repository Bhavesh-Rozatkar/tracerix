let current = { state: null, passphrase: '', locked: true, view: 'day', uiDate: null };
let saveTimer = null;
let lockTimer = null;
let handlers = {};

export function configureSession({ save, render }) { handlers = { save, render }; }
export function getSession() { return current; }
export function isLocked() { return current.locked; }
export function setUnlocked(state, passphrase) {
  current.state = state;
  current.passphrase = passphrase;
  current.locked = false;
}
export function setView(view) { current.view = view; }
export function setDate(date) { current.uiDate = date; }
export function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => handlers.save?.().catch(() => {}), 250);
}
export function touch() {
  clearTimeout(lockTimer);
  if (!current.state || current.locked) return;
  lockTimer = setTimeout(() => lock(), current.state.config.lockMinutes * 60000);
}
export function cancelTimers() { clearTimeout(saveTimer); clearTimeout(lockTimer); saveTimer = null; lockTimer = null; }
export function lock() {
  if (current.locked) return;
  cancelTimers();
  current = { state: null, passphrase: '', locked: true, view: 'day', uiDate: null };
  handlers.render?.();
}
