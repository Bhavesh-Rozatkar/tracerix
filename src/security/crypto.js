import { APP_VERSION, PBKDF2_ITERATIONS, VAULT_FORMAT } from '../core/constants.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function bytesToBase64(bytes) {
  const data = new Uint8Array(bytes);
  let result = '';
  for (let i = 0; i < data.length; i += 0x8000) result += String.fromCharCode(...data.subarray(i, i + 0x8000));
  return btoa(result);
}
export function base64ToBytes(value) {
  const binary = atob(value);
  const data = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) data[i] = binary.charCodeAt(i);
  return data;
}
async function deriveKey(passphrase, salt) {
  const base = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
export async function seal(payload, passphrase, existingSalt = null) {
  const salt = existingSalt ? new Uint8Array(existingSalt) : crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const plaintext = encoder.encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return {
    format: VAULT_FORMAT,
    version: APP_VERSION,
    kdf: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    cipher: 'AES-256-GCM',
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    data: bytesToBase64(ciphertext)
  };
}
export async function unseal(vault, passphrase) {
  if (!vault || vault.format !== VAULT_FORMAT || !vault.salt || !vault.iv || !vault.data) throw new Error('Invalid encrypted vault.');
  const key = await deriveKey(passphrase, base64ToBytes(vault.salt));
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(vault.iv) }, key, base64ToBytes(vault.data));
  return JSON.parse(decoder.decode(plaintext));
}
