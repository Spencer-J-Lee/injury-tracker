# Injury Tracker

A personal tool for logging injuries, tracking symptoms and remedies over time, and spotting trends before your next PT appointment. Built as a local-first web app — all data lives in your browser (IndexedDB via Dexie), with export/import for backups.

## Features

- Log injuries and track their status over time
- Record log entries (pain levels, notes, sessions) per injury
- Track remedies and see which ones you've tried for a given injury
- Dashboard with filtering across active injuries
- Charts for visualizing trends
- JSON export/import for backups (no server, no account — your data stays on your device)

## Tech Stack

- React 19 + TypeScript
- Vite
- Dexie (IndexedDB) for local persistence
- React Router
- Tailwind CSS
- Recharts

## Getting Started

```bash
npm install
npm run dev
```

```bash
npm run build    # production build
npm run lint      # oxlint
npm run preview   # preview production build
```

## Project Status

This is a personal tool built to solve my own problem, not a polished product. The priority so far has been shipping working functionality quickly rather than production-grade code quality — expect rough edges, thin test coverage, and code that hasn't been heavily reviewed or refactored. Use accordingly.
