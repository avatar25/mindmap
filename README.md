# MindMap

MindMap is a small local-first mood tracking app. Pick an emotion from the wheel, set an intensity, optionally add context or a journal note, and review the entries in a simple timeline.

The app stores data in the browser with `localStorage`. There is no backend, account system, or sync layer.

## What It Does

- Log emotions from an interactive wheel
- Track intensity on a 1-10 scale
- Add optional context and journal notes
- Search the timeline
- Toggle light and dark mode
- View basic analytics with charts
- Export logs as JSON or CSV
- Import CSV backups

## Running Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173
```

## Checks

Run lint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Data

MindMap saves entries under the `emotionLog` key in browser `localStorage`.

Exported CSV files use this shape:

```csv
Emotion,Intensity,Context,Journal,Date,Time,Timestamp
Joy,7,"Morning walk","Felt lighter after getting outside",2026-06-02,09:15:00,2026-06-02T09:15:00.000Z
```

The CSV importer expects emotion, intensity, date/time, or timestamp columns. JSON export is available, but JSON import is not implemented yet.

## Current Notes

- Analytics are intentionally basic.
- Data is device/browser-local unless you export it.
- The chart library makes the production bundle larger than ideal.
- CSV parsing is simple and should be hardened before treating imports as mission-critical.

## Stack

- React
- TypeScript
- Vite
- Recharts
- date-fns
