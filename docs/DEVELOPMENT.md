# Development Guide

## Requirements

A modern browser and a simple HTTP server are sufficient. No backend runtime is required.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`.

## Module conventions

Keep feature behavior inside its feature directory. Shared functionality belongs in `core`, `data`, `security`, `state`, or `ui` only when it is genuinely shared.

Avoid putting feature-specific business rules in `src/app.js`.

## Adding a feature

1. Create `src/features/<feature-name>/`.
2. Add the feature entry module.
3. Define its state/data interactions.
4. Add rendering and event handling close to the feature.
5. Register the feature with the application coordinator.
6. Update the data-model documentation if persistent data changes.
7. Update security documentation if sensitive-data handling changes.
8. Update the changelog.

## Testing checklist

Before a release, manually test:

- Fresh vault creation
- Unlock and lock
- Auto-lock
- Add/edit/archive each tracker type
- Daily record creation and editing
- Week/month history
- Goal progress and completion
- Notes persistence
- Full backup export
- Records export
- Import of valid backup
- Import of wrong-passphrase backup
- Import of corrupted backup
- Existing-data preservation after failed import
- Offline reload
- PWA installation
- Service-worker update after a new release

## Browser developer tools

Use the browser Application/Storage panels to inspect service-worker registration and IndexedDB during development. Never inspect or copy real private records into issue reports.
