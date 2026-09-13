import { $, esc } from '../core/utils.js';
import { getVault } from '../data/db.js';

export async function renderLock({ onUnlock }) {
  const app = $('#app');
  try {
    const vault = await getVault();
    app.innerHTML = `<main class="locked"><div class="lockbox"><h1>Tracerix</h1><p class="muted">${vault ? 'Unlock your local vault.' : 'Create your encrypted local vault.'}</p><input id="pass" type="password" placeholder="Passphrase" autocomplete="current-password"><div class="actions"><button class="btn primary" id="unlock">${vault ? 'Unlock' : 'Create vault'}</button></div><div id="err" class="error"></div></div></main>`;
    const submit = () => onUnlock($('#pass').value);
    $('#unlock').onclick = submit;
    $('#pass').onkeydown = e => { if (e.key === 'Enter') submit(); };
    $('#pass').focus();
  } catch (error) {
    app.innerHTML = `<main class="locked"><div class="lockbox"><h1>Tracerix</h1><div class="error">Local storage is unavailable.</div></div></main>`;
  }
}
export function showUnlockError(message) { const el = $('#err'); if (el) el.textContent = esc(message); }
