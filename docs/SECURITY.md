# Security and Privacy

## Threat model

Tracerix is designed primarily to protect locally stored tracker data from casual access through the application interface and from readable database contents.

It is **not** a substitute for operating-system disk encryption, a secure device account, or a hardened security environment.

## Cryptography

The application uses browser-native Web Crypto APIs. The vault design uses password-derived keys and authenticated encryption so modified ciphertext can be detected during decryption.

The implementation should keep cryptographic parameters versioned so future changes can be migrated deliberately.

## Passphrases

The passphrase is not stored as plaintext. It is used to derive cryptographic material for unlocking/decrypting the vault.

Users should choose a strong, unique passphrase and protect it separately from exported backups.

## Auto-lock

After the configured inactivity period, Tracerix locks the session and clears sensitive in-memory session material.

## Backup security

Backups contain sensitive information and should be treated as confidential even when encrypted. Do not publish `.vault` files to a public repository.

## GitHub Pages

GitHub Pages hosts static application files. It does not need access to the user's tracker database. Personal records remain in the browser unless explicitly exported.

## Limitations

Client-side applications cannot protect data from a compromised browser, malicious extensions with sufficient access, malware, or an attacker who already controls the device/session. Physical-device security remains important.

## Reporting a vulnerability

See the repository-level `SECURITY.md` for the preferred reporting process.
