# Repository Guidelines

This repo powers 212video: a curated YouTube viewer with a React (Vite + MUI) frontend and an Express + SQLite backend. It assumes a single local user and stores progress in SQLite.

## Project Structure & Module Organization

- `frontend/`: React UI.
  - `frontend/src/App.jsx`: app shell, routing, and top-level state.
  - `frontend/src/components/`: cards, grids, nav, player views.
  - `frontend/src/hooks/`: data fetching, infinite scroll, watch tracking.
  - `frontend/src/utils/`: date/video helpers.
  - `frontend/src/styles.css`: global styles.
- `backend/`: API + data store.
  - `backend/src/server.js`: Express API entry point.
  - `backend/src/db.js`: SQLite schema and queries.
- `backend/src/youtube.js`: YouTube API fetch and caching logic.
- `backend/data/channels.json`: curated channel list.
- `backend/data/playlists.json`: curated playlists (YouTube playlist IDs or manual videos).
- `backend/data/settings.json`: app settings (daily limit, timezone).
  - `backend/data/watch.sqlite`: runtime DB (auto-created).
  - `backend/.env`: `YOUTUBE_API_KEY` for channel refreshes.

## Build, Test, and Development Commands

From repo root:

- `npm install` installs workspace dependencies.
- `npm run dev` runs backend (`:4000`) and frontend (`:5173`).
- `npm run dev:backend` or `npm run dev:frontend` runs one side only.
- `npm --workspace frontend run build` creates a production UI bundle.
- `npm --workspace frontend run preview` previews the built UI.

## Coding Style & Naming Conventions

- JavaScript: ES modules in frontend, CommonJS in backend.
- 2-space indentation, `camelCase` for functions/vars, `PascalCase` for components.
- Keep frontend files small (<100 lines) by extracting hooks/components.
- Prefer explicit API payloads (`videoId`, `seconds`, `channelId`).

## Testing Guidelines

No automated tests yet. If you add them, use:

- Frontend: `*.test.jsx` with Vitest or Jest.
- Backend: `*.test.js` with the Node test runner.
- Focus on watch-limit and progress-resume flows.

## Commit & Pull Request Guidelines

- Use concise, imperative commits (e.g., `Add channel refresh cache`).
- Keep commits scoped; avoid mixing UI and data-layer changes.
- PRs should include a short summary, test notes, and UI screenshots.

## Configuration & Secrets

- Update channels/settings in `backend/data/channels.json` and `backend/data/settings.json`.
- Store API keys in `backend/.env`; never commit secrets.
