# File Structure

```text
tracerix/
├── index.html                 # Application entry point
├── styles.css                 # Global application styles
├── manifest.webmanifest       # PWA manifest
├── sw.js                      # Service worker and cache strategy
├── icon.svg                   # Application icon
├── README.md                  # GitHub/project overview
├── LICENSE                    # Project license
├── CONTRIBUTING.md            # Contribution workflow
├── SECURITY.md                # Security reporting policy
│
├── docs/
│   ├── USAGE.md               # End-user guide
│   ├── ARCHITECTURE.md        # Architecture and data flow
│   ├── FILE-STRUCTURE.md      # This document
│   ├── DATA-MODEL.md          # Data model
│   ├── SECURITY.md            # Security design
│   ├── BACKUPS.md             # Backup/import/export behavior
│   ├── DEVELOPMENT.md         # Development guide
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── TROUBLESHOOTING.md     # Troubleshooting
│   ├── CHANGELOG.md           # Release history
│   └── ROADMAP.md             # Planned work
│
└── src/
    ├── app.js                 # Application coordinator
    ├── core/
    │   ├── constants.js       # Shared constants
    │   └── utils.js           # Generic helpers
    ├── data/
    │   └── db.js              # IndexedDB abstraction
    ├── security/
    │   └── crypto.js          # Cryptographic operations
    ├── state/
    │   ├── model.js           # Domain state/model
    │   ├── persistence.js     # State persistence coordination
    │   └── session.js         # Unlock/lock session state
    ├── ui/
    │   └── modal.js           # Reusable modal UI
    ├── views/
    │   └── lock.js            # Lock/unlock view
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

## Naming rules

- Feature directories use kebab-case.
- Feature entry points use `index.js`.
- Shared modules use descriptive filenames rather than generic catch-all files.
- New feature behavior should normally be added under `src/features/<feature-name>/`.
