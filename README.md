# Tracerix

**Offline-first, private habit and progress tracker.**

Tracerix is a lightweight Progressive Web App (PWA) for recording daily habits, finite goals, infinite skills, personal habits, and notes. It is designed around a simple principle: **record what happened without turning personal data into a productivity score.**

## Features

- Daily tracking for habits, goals, skills, personal habits, and notes
- Checkbox and measured habits with configurable values
- Week and month history for individual habits
- Finite goals with explicit progress toward completion
- Infinite skills for ongoing practice without completion percentages
- Neutral personal-habit tracking with no punishment, streaks, or scoring
- Local-only IndexedDB storage
- Passphrase-protected encrypted vault
- AES-GCM authenticated encryption with PBKDF2 key derivation using Web Crypto
- Automatic inactivity locking
- Encrypted full backups and encrypted records exports
- Validated import with failure-safe restore behavior
- Installable and offline-capable PWA
- Static hosting compatible with GitHub Pages
- No account, backend, cloud database, analytics, subscription, or automatic sync

## Privacy model

Tracerix does not require an online service to operate. Tracker data is stored locally in the browser's IndexedDB database and is protected by the application's encrypted-vault design.

The GitHub Pages deployment contains application code, not your personal tracker records. Exported vault files should be treated as sensitive data and stored somewhere you trust.

**Important:** losing your passphrase can make encrypted data unrecoverable. Keep an encrypted backup and its passphrase safe.

## Quick start

### Use the hosted PWA

1. Deploy the repository to GitHub Pages.
2. Open the HTTPS GitHub Pages URL.
3. Create a vault and choose a strong passphrase.
4. Add tracker items from the management interface.
5. Record your daily activity.
6. Export backups periodically.

### Run locally

Tracerix uses ES modules and a service worker, so it should be served over HTTP(S), not opened directly with `file://`.

A simple local server is sufficient:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## GitHub Pages deployment

1. Create a GitHub repository.
2. Put the contents of this directory in the repository root.
3. Push the `main` branch.
4. Open **Settings → Pages**.
5. Select **Deploy from a branch**.
6. Select `main` and `/ (root)`.
7. Save and open the generated GitHub Pages URL.

HTTPS is required for the service worker and Web Crypto functionality in normal hosted use.

## Documentation

See the `docs/` directory:

- [`docs/USAGE.md`](docs/USAGE.md) — end-user usage guide
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — application architecture and data flow
- [`docs/FILE-STRUCTURE.md`](docs/FILE-STRUCTURE.md) — source tree and module responsibilities
- [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md) — data model and persistence concepts
- [`docs/SECURITY.md`](docs/SECURITY.md) — security and privacy design
- [`docs/BACKUPS.md`](docs/BACKUPS.md) — backup, export, and restore behavior
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — local development and contribution workflow
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deployment and GitHub Pages guidance
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — common operational problems
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — release history
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — planned direction
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guidelines
- [`SECURITY.md`](SECURITY.md) — security reporting policy
- [`LICENSE`](LICENSE) — project license

## Project structure

```text
tracerix/
├── index.html
├── styles.css
├── manifest.webmanifest
├── sw.js
├── icon.svg
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── docs/
└── src/
    ├── app.js
    ├── core/
    ├── data/
    ├── security/
    ├── state/
    ├── ui/
    ├── views/
    └── features/
        ├── daily-habits/
        ├── finite-goals/
        ├── infinite-skills/
        ├── negative-habits/
        ├── daily-notes/
        ├── history/
        ├── management/
        └── backups/
```

## Design principles

1. **Local first** — data belongs to the user and stays on the device unless exported.
2. **Simple recording** — minimize interaction required to record a day.
3. **Feature modularity** — each major tracker capability owns its feature module.
4. **Historical preservation** — removing an active item does not erase its historical records.
5. **No forced productivity model** — no unnecessary scores, achievements, punishment, or gamification.
6. **Recoverability** — encrypted backups are a first-class feature.

## Browser support

Tracerix requires a modern browser with support for:

- IndexedDB
- Web Crypto API
- ES modules
- Service Workers
- Web App Manifest

## License

See [`LICENSE`](LICENSE).
