# Deployment

## GitHub Pages

Tracerix is designed for static hosting.

1. Create a repository.
2. Copy the project contents into the repository root.
3. Commit and push to `main`.
4. Open **Settings → Pages**.
5. Select **Deploy from a branch**.
6. Select `main` and `/ (root)`.
7. Save.
8. Open the generated HTTPS URL.

## Service worker

The service worker controls offline caching. When changing application files, update the cache version in `sw.js` so installed clients can receive the new application shell.

## Base paths

If the repository is published at a GitHub Pages project URL such as `/tracerix/`, all asset references must remain relative or otherwise account for the repository base path.

## Release checklist

- Test on desktop and mobile.
- Verify the HTTPS deployment.
- Test service-worker installation.
- Test offline reload.
- Test encrypted export/import.
- Confirm no personal data or backup files are committed.
- Update `CHANGELOG.md`.
- Bump the application/cache version when appropriate.
