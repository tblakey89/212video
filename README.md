# 212video

Curated YouTube viewing for kids. The app is split into a React (Vite + MUI) frontend and an Express + SQLite backend. It assumes a single local user and stores watch progress in SQLite.

## Quick start

From the repo root:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and the backend on `http://localhost:4000`.

Run one side only:

```bash
npm run dev:backend
npm run dev:frontend
```

## Configuration

- `backend/data/channels.json`: curated channels (by `youtubeChannelId` or `youtubeHandle`).
- `backend/data/playlists.json`: curated playlists (by `youtubePlaylistId` or manual video lists).
- `backend/data/settings.json`: daily limit, timezone, and max videos per channel/playlist.
- `backend/.env`: set `YOUTUBE_API_KEY` to enable refreshes from YouTube.
- `frontend/public/iframe_api.js`: cached copy of the YouTube IFrame API for networks that block `youtube.com`.
- `frontend/public/www-widgetapi.js`: optional cached widget API (requires editing `iframe_api.js` to point here).

When a YouTube API key is set, `/api/channels` and `/api/playlists` cache results in SQLite (`backend/data/watch.sqlite`) and refresh once per day.

## Raspberry Pi launcher

Templates for a desktop launcher and startup script live in `raspberry-pi/`. See `raspberry-pi/README.md` for app-mode Chromium launch instructions.

## Notes

- Shorts are fetched via the channel shorts playlist when available.
- Watch progress and daily totals are recorded in SQLite and shown on the home screen.
