# Injury Rehab Tracker

A personal tool for logging injuries, tracking symptoms and remedies over time, and spotting trends before your next PT appointment. Built as a local-first web app — all data lives in your browser (IndexedDB via Dexie), with export/import for backups.

## Project Status

This is a personal tool built to solve my own problem, not a polished product. The priority so far has been shipping working functionality quickly rather than production-grade code quality — expect rough edges, thin test coverage, and code that hasn't been heavily reviewed or refactored. Use accordingly.

## Screenshots

### Injuries View 
<img width="auto" height="600" alt="1" src="https://github.com/user-attachments/assets/92875cf4-4d31-489e-ac1c-6c49fbd033c5" />
<img width="auto" height="600" alt="2" src="https://github.com/user-attachments/assets/b519311d-6858-4542-be2a-18a74d87f155" />
<img width="auto" height="600" alt="3" src="https://github.com/user-attachments/assets/1e9a1cff-155f-4344-bb11-724885d430ba" />

### Habits View
<img width="auto" height="600" alt="4" src="https://github.com/user-attachments/assets/4bf8080f-adb1-4af6-9e6c-751a6368d916" />
<img width="auto" height="600" alt="5" src="https://github.com/user-attachments/assets/2df8c5d7-8992-4003-9567-017acd73f8cd" />

### Strengthening Plan View
<img width="auto" height="600" alt="6" src="https://github.com/user-attachments/assets/a52e1ab9-144c-406e-9fbf-488cf9ff0170" />
<img width="auto" height="600" alt="7" src="https://github.com/user-attachments/assets/88c1d0c9-b0ac-41c3-b3dc-ca63afa23d3a" />

### Journal View
<img width="auto" height="600" alt="8" src="https://github.com/user-attachments/assets/88d32082-57f2-4ce2-8d8c-57aa4fb1a744" />

### Rest Activities View
<img width="auto" height="600" alt="9" src="https://github.com/user-attachments/assets/358f4842-5b7e-466a-8407-2197a94b13fd" />

### Settings View
<img width="auto" height="600" alt="10" src="https://github.com/user-attachments/assets/a3381151-1417-46d2-beba-5ce8cea63fbb" />

## Features

- Log injuries and track their status over time, with pain mechanism classification (nociceptive, neuropathic, nociplastic)
- Record log entries (pain levels, rich-text notes, sessions) per injury
- Morning check-ins to track resting pain, stiffness, and numbness separately from day-to-day logs
- Track remedies and see which ones you've tried, and whether they provide immediate relief
- Track triggers by category to spot what's aggravating an injury
- Dashboard with filtering across active injuries
- Pain trend charts, including a mini trend chart on each injury card
- Strengthening exercise planner with weekly/4-day grid views, grouped by injury
- Habit tracker with sectioned daily grids and completion history
- Rest activity library for logging low-impact activities
- Todo list for quick tasks, with a modal for adding/completing on the fly
- Freeform journal with rich-text entries, pagination, and draft autosave
- Quick "stamp" picker for reusable snippets of text
- JSON export/import for backups (no server, no account — your data stays on your device)

## Tech Stack

- React 19 + TypeScript
- Vite
- Dexie (IndexedDB) for local persistence
- React Router
- Tailwind CSS
- Recharts
- Tiptap (rich text editing)
- Font Awesome

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
