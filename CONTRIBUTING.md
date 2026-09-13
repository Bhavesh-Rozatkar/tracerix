# Contributing to Tracerix

Thank you for contributing.

## Before making changes

Read:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`

## Code organization

Keep feature-specific code in `src/features/<feature-name>/`. Avoid adding unrelated business logic to `src/app.js`.

## Pull requests

A pull request should:

- Explain what changed and why.
- Keep changes focused.
- Update documentation when behavior or architecture changes.
- Avoid committing personal data, vault files, credentials, or local browser data.
- Include manual testing notes for user-facing changes.

## Security-sensitive changes

Changes involving cryptography, passphrases, backups, import validation, or sensitive-data handling should receive additional review. See `SECURITY.md`.
