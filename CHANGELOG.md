# Changelog

## [2026-08-23] Connect Supabase client configuration
- Added the provided Supabase project URL and publishable key to the local ignored `.env` file.
- Supabase now takes precedence over the local JSON API whenever the environment variables are present.
- The Supabase table/policies are still pending creation in the project SQL editor; the secret key was not stored or exposed in the frontend.
- Files affected: `.env` (ignored), `src/data/storage.ts`, `SPEC.md`.

## [2026-08-23] Fix refresh persistence and storage diagnostics
- Added an explicit load-first flow with a loading screen and console logs identifying local JSON, static JSON, Supabase, or default sources.
- Serialized save requests so rapid edits cannot overwrite one another out of order.
- Added retry behavior instead of silently replacing storage read failures with defaults.
- Added `.env.example` and clarified that live cross-device writes still require Supabase credentials.
- Files affected: `src/main.tsx`, `src/data/storage.ts`, `vite.config.ts`, `.env.example`, `README.md`.

## [2026-08-23] Add shared-state storage layer and RESET
- Replaced application `localStorage` persistence with a shared `AppState` JSON model.
- Added local Vite API read/write support for root `data.json` and a production Supabase REST adapter when configured through env variables.
- Added the confirmed RESET action to clear both scores and all history while preserving current grids.
- Documented the GitHub Pages static-hosting limitation and Supabase setup in `SPEC.md`.
- Files affected: `data.json`, `vite.config.ts`, `src/main.tsx`, `src/data/appState.ts`, `src/data/storage.ts`, `SPEC.md`.

## [2026-08-23] Publish GRIDLINE to GitHub Pages
- Created the public `pufixluv1984-bit/gridline` repository and pushed the `main` branch.
- Added the Vite `/gridline/` base path, `gh-pages` deployment scripts, and live README link.
- Enabled GitHub Pages from the `gh-pages` branch.
- Files affected: `vite.config.ts`, `package.json`, `pnpm-lock.yaml`, `README.md`.

## [2026-08-23] Initial implementation of GRIDLINE
- Built the responsive dashboard and history SPA.
- Added driver data, team colors, scoring engine, drag-and-drop prediction grids, fastest-lap selection, uploads, localStorage persistence, and round history.
- Added `SPEC.md` documenting the implemented behavior and known deviations.
- Files affected: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/`, `SPEC.md`.
