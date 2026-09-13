# Tracerix Architecture

## Overview

Tracerix is a static, client-side PWA. There is no application server in the runtime architecture.

```text
Browser
  │
  ├── UI / Views
  │      │
  │      └── Feature modules
  │              │
  │              └── State model
  │                      │
  │                      └── Persistence
  │                              │
  │                              └── IndexedDB
  │
  ├── Security
  │      └── Web Crypto API
  │
  └── Service Worker
         └── Cached application shell
```

## Feature-based modularity

Major user-facing capabilities live under `src/features/`:

- `daily-habits` — recurring daily habit recording
- `finite-goals` — endpoint-based progress tracking
- `infinite-skills` — ongoing practice tracking
- `negative-habits` — neutral private behavior tracking
- `daily-notes` — daily free-text notes
- `history` — historical habit views
- `management` — tracker item configuration
- `backups` — encrypted backup and import/export workflows

## Supporting layers

### Core

`src/core/` contains constants and generic utilities that do not belong to a specific feature.

### Data

`src/data/db.js` owns IndexedDB access and database initialization.

### State

`src/state/` contains the application model, persistence coordination, and session state.

### Security

`src/security/crypto.js` isolates cryptographic operations from UI and feature code.

### UI

`src/ui/` contains reusable interface primitives such as modal handling.

### Views

`src/views/` contains application-level screens such as the lock screen.

## Application coordinator

`src/app.js` coordinates startup, routing/view composition, event wiring, and feature registration. Feature-specific business logic should stay in the corresponding feature directory.

## Dependency direction

Prefer this direction:

```text
app → features/views → state → data
                 ↘ security
```

Low-level modules should not import the application coordinator.
