import { getVault, putVault } from '../data/db.js';
import { seal, unseal, base64ToBytes } from '../security/crypto.js';
import { normalizeState } from './model.js';
import { getSession } from './session.js';

export async function saveState() {
  const session = getSession();
  if (session.locked || !session.passphrase || !session.state) return;
  const existing = await getVault();
  if (!existing) throw new Error('Vault not found.');
  const sealed = await seal(session.state, session.passphrase, base64ToBytes(existing.salt));
  await putVault(sealed);
}
export async function createOrUnlock(passphrase) {
  const existing = await getVault();
  if (!existing) return { state: normalizeState(null), existing: false };
  return { state: normalizeState(await unseal(existing, passphrase)), existing: true };
}
