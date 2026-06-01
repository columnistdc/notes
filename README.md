# My Voice Memos

A simple web application for creating text notes with voice input (Web Speech API) and storing them in IndexedDB (Dexie).

## Stack

- React + TypeScript + Vite
- Web Speech API (SpeechRecognition)
- IndexedDB (Dexie)
- React Router
- Vitest + React Testing Library
- GitHub Actions (CI)

## Design and Decisions

- **IndexedDB** for asynchronous CRUD (demonstration of async/await).
- **Hook useSpeechRecognition** encapsulates work with Web Speech API and vendor prefix.
- **Simple architecture**: pages (List/Edit), components (List, Form), database layer (Dexie).
- **Buttons** with a stylish translucent orange border (rgba(255,165,0,.5)).
- Accessibility: required fields, aria states, semantic elements.

## Local Start

```bash
npm i
npm run dev
```

## Base Path

The app is built for a GitHub Pages project site, so it defaults to the
`/notes/` base path. Override it with the `BASE_PATH` env var when deploying
to a custom domain or the site root:

```bash
BASE_PATH=/ npm run build        # served at the domain root
BASE_PATH=/app/ npm run build    # served under /app/
```

The router reads `import.meta.env.BASE_URL`, so it follows `BASE_PATH`
automatically — no extra configuration needed.
