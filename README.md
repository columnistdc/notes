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
