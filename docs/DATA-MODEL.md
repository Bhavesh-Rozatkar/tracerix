# Data Model

Tracerix separates **tracker configuration** from **daily records** conceptually.

## Tracker definitions

The application maintains collections for:

- Habits
- Finite goals
- Infinite skills
- Personal habits

Each tracker item has a stable identifier. Active/archive state controls whether it appears in current tracking.

## Daily records

Daily records are keyed by calendar date and contain the recorded values for that day, plus optional notes.

A record may contain:

```text
Date
├── Habit values
├── Finite-goal progress
├── Infinite-skill activity
├── Personal-habit values
└── Notes
```

## Historical preservation

Archiving/removing a tracker item must not remove its previous records. This allows historical data to remain readable even after an item is no longer active.

## Goal progress

Finite goals have a configured total and a current completed amount. Progress is bounded by the goal's defined structure and is displayed as a percentage and progress bar.

## Storage

Persistent application state is stored in IndexedDB. Session-only secrets and unlocked state should remain in memory for the lifetime of the unlocked session.
