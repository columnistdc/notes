# My Voice Memos

Простое веб‑приложение для создания текстовых заметок с голосовым вводом (Web Speech API) и хранением в IndexedDB (Dexie).

## Стек

- React + TypeScript + Vite
- Web Speech API (SpeechRecognition)
- IndexedDB (Dexie)
- React Router
- Vitest + React Testing Library
- GitHub Actions (CI)

## Дизайн и решения

- **IndexedDB** для асинхронных CRUD (демонстрация async/await).
- **Хук useSpeechRecognition** инкапсулирует работу с Web Speech API и вендорным префиксом.
- **Простая архитектура**: страницы (List/Edit), компоненты (List, Form), слой БД (Dexie).
- **Кнопки** со стильной полупрозрачной оранжевой рамкой (rgba(255,165,0,.5)).
- Доступность: required‑поля, aria‑состояния, семантичные элементы.

## Локальный старт

```bash
npm i
npm run dev
```
