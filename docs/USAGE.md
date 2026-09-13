# Tracerix Usage Guide

## 1. First launch

Open Tracerix and create a vault with a strong passphrase. The passphrase protects access to the local vault and is required for encrypted backup operations.

Do not use a passphrase you cannot safely remember or recover. The application is intentionally local-first and does not provide an account-based password reset service.

## 2. Daily tracking

The daily tracker is the primary workspace. Select a date and record the items relevant to that day.

### Habits

Use a checkbox habit for yes/no activities. Use a measured habit when a numeric or selectable measurement is more useful.

### Finite goals

Update the completed amount for work with a known endpoint. The goal is complete when its progress reaches the configured total.

### Infinite skills

Record continued practice without treating the skill as something that reaches 100%.

### Personal habits

Use the neutral personal-habit section for private behavior records. Tracerix does not impose streaks, punishment, elimination targets, or scores.

### Notes

Use the daily notes field for context that does not fit the structured fields.

## 3. History

Open an individual habit's history to switch between week and month views. History is intended for direct observation of previous records rather than complex analytics.

## 4. Managing items

Use the management interface to add, edit, or remove tracker items.

Removing an item means **archive it from active tracking**. Historical records are retained so past entries remain meaningful.

## 5. Backups

Use **Full Backup** when you want a restorable copy of the complete vault configuration and records.

Use **Records Export** when you primarily need a copy of historical records.

Keep exported encrypted files somewhere safe. A backup without the correct passphrase may not be usable.

## 6. Import

Choose an exported Tracerix file and provide the required passphrase. The application validates the file before replacing/restoring vault state. If validation or decryption fails, existing data should remain untouched.

## 7. Offline use

Visit the deployed application at least once while online so the service worker can cache the application shell. After installation and successful caching, normal tracking can continue without an internet connection.

## 8. Auto-lock

Tracerix can automatically lock after a period of inactivity. Unlocking requires the vault passphrase.
