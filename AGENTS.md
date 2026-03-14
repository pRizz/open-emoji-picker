# AGENTS.md

## Cursor Cloud specific instructions

This is a **SolidJS + Vite** single-page emoji picker app with no backend. All standard dev commands are in `package.json` and documented in `README.md`.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Tests | `npm test` |
| Build (tsc + vite) | `npm run build` |
| Full check (test + build) | `npm run check` |

### Non-obvious notes

- **Node.js 22** is required (per CI workflow in `.github/workflows/deploy.yml`).
- Vite `base` is set to `/open-emoji-picker/` for GitHub Pages, so the local dev URL is `http://localhost:5173/open-emoji-picker/` (not the root `/`).
- There is no linter configured separately; TypeScript checking is done via `tsc -b` as part of `npm run build`.
- No backend, database, or external services are needed. The app is entirely client-side with `localStorage` for recent emojis.
- Tests use `jsdom` environment via Vitest; no browser or dev server needed for tests.
