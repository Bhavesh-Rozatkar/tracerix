# Backup, Export, and Restore

## Full Backup

A Full Backup is intended to restore the complete Tracerix vault.

It should include:

- Tracker definitions
- Active/archive state
- Habit measurement configuration
- Goal configuration and progress
- Skill configuration
- Personal-habit configuration
- Daily records
- Historical records
- Notes
- Relevant application configuration

By default, the resulting `.vault` file is encrypted. The export-format selector can instead create a plain-text `.json` file when portability or inspection is needed. Plain-text exports contain readable personal data and should only be used and stored deliberately.

## Records Export

Records Export is intended for historical record portability. It contains recorded dates and activity without necessarily carrying the complete tracker configuration. It uses the selected export format.

## Import safety

Import should follow this sequence:

```text
Select file
   ↓
Parse container
   ↓
Validate format/version
   ↓
Derive key from passphrase
   ↓
Authenticate/decrypt
   ↓
Validate decoded structure
   ↓
Prepare replacement state
   ↓
Commit only after validation succeeds
```

This prevents malformed or incorrect backups from partially overwriting an existing vault.

## Operational recommendations

- Export backups regularly.
- Keep more than one backup copy when the data is important.
- Store backups somewhere separate from the device running Tracerix.
- Never commit personal `.vault` or `.json` export files to GitHub.
- Keep the backup passphrase safe and separate from the backup file.
