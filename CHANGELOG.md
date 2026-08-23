# Changelog

## [2026-08-23] Add shared-password edit lock
- Added default read-only mode for visitors and a shared-password `LOG IN` modal for admins.
- Restored editing controls only after login and added browser-local login persistence plus logout.
- Added `VITE_ADMIN_PASSWORD` to `.env.example`, GitHub Actions build configuration, `README.md`, and `SPEC.md`.
- Documented that this is a UI-level casual gate, not backend-enforced authorization.

## [2026-08-23] Fix chevron duplication and fastest-lap spacing
- Removed the redundant card-level chevron so position/result cards now show one picker arrow.
- Restored spacing and right alignment between the FASTEST LAP label and selected driver.
- Files affected: `src/main.tsx`, `src/layout-fixes.css`.

## [2026-08-23] Show car numbers in right-side badges
- Replaced the large right-side `12/10/8` scoring badges on prediction and result cards with each driver's actual car number (`#1`, `#23`, `#44`, etc.).
- Scoring behavior remains unchanged; the badge is now unambiguously a driver-number badge.

## [2026-08-23] Fix sortable duplicate-id drag glitch
- Normalized loaded prediction/result grids to unique driver IDs and filled duplicate slots with unused drivers.
- Persisted the normalized Supabase state on load so dnd-kit receives stable unique sortable IDs after refresh.
- Fixed overlapping/ghost cards and incorrect position movement caused by legacy duplicate selections.
- Files affected: `src/data/appState.ts`, `src/main.tsx`.

## [2026-08-23] Correct driver numbers and card interactions
- Replaced driver data with the exact supplied 2026 numbers and displayed car numbers in cards and pickers.
- Added disabled duplicate choices with current-driver checkmarks in the custom picker.
- Replaced native drag-and-drop with dnd-kit PointerSensor distance activation for tap-to-pick and press/drag-to-reorder behavior.
- Made a quick tap anywhere on a position card open its picker while preserving the drag threshold behavior.
- Made RESET match APPLY RESULT height and removed its Russian subtitle.
- Removed the winner-image decorative text overlay and made the image fill the flex card cleanly with cover alignment.
- Files affected: `src/data/drivers.ts`, `src/data/appState.ts`, `src/main.tsx`, `src/picker.css`, `package.json`, `pnpm-lock.yaml`, `SPEC.md`.

## [2026-08-23] Configure GitHub Pages Supabase build
- Verified the `app_state` table is readable and writable using the publishable key and configured RLS.
- Added a GitHub Actions Pages workflow that builds with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` repository secrets.
- Explicitly kept the Supabase secret/service-role key out of frontend code and deployment configuration.
- Files affected: `.github/workflows/deploy.yml`, `README.md`, `SPEC.md`.

## [2026-08-23] Enable live shared persistence
- Confirmed the deployed Pages bundle contains the Supabase project URL and publishable key.
- Confirmed the live Supabase REST endpoint returns the shared `app_state` row and accepts updates under the configured RLS policies.
- Sync mode is refresh-based; realtime subscriptions remain a future enhancement.

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
[2026-08-23] Fix picker menus and duplicate driver labels
- Coordinated all picker menus globally so opening a new driver dropdown closes the previously open one.
- Removed the repeated driver nickname from position/result picker triggers while keeping one chevron at the far right; restored spacing for Fastest Lap labels.

[2026-08-23] Enable Race result drag-and-drop
- Added admin drag-and-drop reordering to the official Race result grid.
- Reordered result positions are persisted with the shared app state.

[2026-08-23] Correct half-based scoring range bonus
- Replaced the old ±5-position range check with exact top-5/bottom-5 half matching.
- Updated the scoring panel and SPEC examples to document the corrected rule.

[2026-08-23] Allow Fastest Lap driver overlap
- Fastest Lap pickers now allow all 22 drivers, including drivers already selected in positions 01–10.
- Duplicate blocking remains enabled for regular position cards.

[2026-08-23] Lock winner image frame size
- Fixed the center Last Race Winner image frame height so uploaded photos fill it with `object-fit: cover` without stretching the image or expanding the card layout.

[2026-08-23] Add Formula 1 account avatar upload
- Added an admin-editable avatar in place of the white account square beside `Formula 1`.
- The avatar is stored in shared app state and remains visible to read-only visitors.

[2026-08-23] Align winner card with prediction grids
- Made the center Last Race Winner card stretch to the full height of the neighboring grids, removing the empty space underneath.
- The image still uses `object-fit: cover` so it fills the frame without distortion.

[2026-08-23] Fix winner card overflow and top-5 scoring
- Constrained the center winner card to the shared prediction-grid row height so its image cannot extend below position 10.
- Removed the bottom-5 range bonus: only non-exact matches where both positions are in 1–5 receive +6.

[2026-08-23] Show scoring feedback on prediction cards
- After APPLY RESULT, exact position hits display a red `+12` badge and top-5 range hits display a gold `+6` badge on the relevant prediction cards.

[2026-08-23] Harden client-side admin sessions
- Replaced the forgeable `localStorage` admin flag with a SHA-256 token containing a 24-hour expiry.
- Tokens are validated on load and before every shared-state write; documented the remaining static-client limitation.

[2026-08-23] Lock winner card to prediction-row height
- Made the three-column prediction layout stretch as one grid row and constrained the winner image wrap with `min-height: 0`, overflow clipping, and an absolute `object-fit: cover` image.
- Verified default and wide viewport layouts: the center card bottom matches both side grids, independent of the image's intrinsic dimensions.

[2026-08-23] Add manual winner card accent color
- Added admin-only team-color presets and a custom color picker for the Last Race Winner card.
- The selected accent persists in shared state and controls the card border/glow/background plus the photo gradient overlay.

[2026-08-23] Refine winner card accent styling
- Removed the top photo tint, keeping only the bottom accent gradient.
- Removed the outer card glow and custom color input; only team-color presets remain.

[2026-08-23] Add expandable history prediction breakdowns
- APPLY RESULT now stores both predictions, the actual top-10 result, and fastest-lap picks in each history entry.
- History rounds can expand to show per-position predicted vs actual drivers, exact/range/miss points, fastest-lap bonus, and round totals; older entries show a safe no-details message.

[2026-08-23] Align RESET and APPLY RESULT controls
- Removed the header button offsets and aligned both controls with the Predictions & result heading.
- Added clean wrapping behavior for narrower viewports so the buttons do not overlap the section underline.
