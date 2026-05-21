# Task 2 — Date Normalisation Utility

## Problem

Clinic PMS systems send appointment dates in inconsistent formats. ISO 8601, `DD/MM/YYYY`, `MM-DD-YYYY` — sometimes even garbled strings. This causes validation failures and partial syncs.

## Solution

A single utility function that normalises any supported date string into a consistent ISO 8601 UTC timestamp.

```ts
normaliseAppointmentDate(raw: string): string | null
```

### Supported formats

| Format | Example | Output |
|---|---|---|
| ISO 8601 (full) | `2026-04-14T09:00:00Z` | `2026-04-14T09:00:00.000Z` |
| ISO 8601 (offset) | `2026-04-14T09:00:00+02:00` | `2026-04-14T07:00:00.000Z` |
| ISO 8601 (date) | `2026-04-14` | `2026-04-14T00:00:00.000Z` |
| DD/MM/YYYY | `14/04/2026` | `2026-04-14T00:00:00.000Z` |
| MM-DD-YYYY | `04-14-2026` | `2026-04-14T00:00:00.000Z` |
| Invalid | `not-a-date` | `null` |

### Design choices

- **Luxon** over dayjs — built-in timezone handling, no plugins needed, cleaner API.
- **`null` return** instead of throwing — lets the caller log/skip gracefully during batch syncs.
- **Separator convention** — `/` = day-first (EU), `-` = month-first (US) — disambiguates the two regional formats.

## Setup

```bash
cd task2
npm install
```

## Run tests

```bash
npm test
```
