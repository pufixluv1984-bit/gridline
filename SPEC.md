# GRIDLINE specification

GRIDLINE is an F1 prediction battle for VOVA and T-SHY. It provides a dashboard for editing two top-10 predictions and the official result, applying scoring rules, reviewing round history, and resetting the shared championship totals.

## Stack and structure

- React + TypeScript + Vite with custom CSS and `@dnd-kit/core`/`@dnd-kit/sortable` for card reordering.
- `src/main.tsx` contains the Dashboard, History, grids, score card, RESET flow, and upload controls.
- `src/styles.css` contains the responsive dark visual system.
- `src/data/drivers.ts` is the driver/team/number source of truth. It contains the exact 2026 FIA-confirmed numbers supplied for all 22 drivers.
- `src/data/appState.ts` defines the shared JSON shape, defaults, and normalization.
- `src/data/storage.ts` selects the local Vite API, Supabase REST API, or static read-only fallback.
- `src/utils/scoring.ts` contains scoring constants and the score engine.
- `vite.config.ts` provides the local `/api/state` read/write endpoint and emits root `data.json` into production builds.
- `data.json` is the root-project seed/state file used by local development and emitted as a static seed for GitHub Pages.

## Implemented screens and behavior

The Dashboard includes the header tabs, hero, editable round number, shared score card, avatar uploads, scoring rules, two prediction grids, fastest-lap pickers, last-race-winner card, official result grid, APPLY RESULT, and RESET. Driver cards and dropdown options display the driver's car number. The custom picker disables drivers already selected elsewhere in the same grid, keeps the current driver selectable with a checkmark, and shows disabled choices greyed out. The History tab shows applied rounds and running scores.

## Edit lock / login gate

The default UI is read-only. A `LOG IN` button opens a single shared-password modal. The password is read from `VITE_ADMIN_PASSWORD` at build time and is not committed to the repository. A successful login stores only a SHA-256 browser-local session token containing a 24-hour expiry in `localStorage`; no raw password or fixed `1` flag is stored. The token is validated on load and again before every shared-state write, and invalid/expired tokens are removed. Logged-out visitors cannot open pickers, drag cards, upload avatars, edit tweet/image content, change the round, APPLY RESULT, or RESET. Logged-in visitors regain all editing controls, and the header button logs them out when clicked. This is still a client-side gate: the password comparison and token algorithm ship in the static bundle, so a determined user can reverse-engineer or bypass it; real security would require server-side/session verification and backend authorization.

This is intentionally a simple client-side/UI-level gate for a small friends-only fan site. It is not hardened security: a determined user could inspect the frontend or call the Supabase API directly. Supabase RLS remains the data-access policy, while this password only controls the visible editing UI.

Position cards use dnd-kit `PointerSensor` with an 8px distance activation constraint: a quick interaction opens the picker, while moving past the threshold starts a reorder drag. Result cards are picker-only and are not draggable.

Picker menus use one shared open state across VOVA, T-SHY, and the result grid, so opening one closes any other open menu. Position/result cards show the driver name once; their compact picker trigger contains only the single dropdown arrow.
The official Race result grid is also reorderable for admins with the same 8px drag activation behavior as the prediction grids; its order is saved to shared state.
After APPLY RESULT, prediction cards show a red `+12` badge for exact matches and a gold `+6` badge for non-exact top-5 matches. These per-position badges are stored in `lastApplied` and are shown only for the applied current round.

The Last Race Winner card now contains an editable Formula 1 account avatar, account label, editable tweet line, and image. The decorative WINNER/SPRINT overlay was removed. The card is a flex column inside the shared three-column prediction grid; its image wrap has `min-height: 0` and overflow clipping, and the image fills the available frame with `object-fit: cover` and centered alignment without affecting row height.

RESET uses a confirmation dialog with the exact destructive-action warning. After confirmation it sets both shared scores to zero and clears the complete history array. It intentionally preserves the current VOVA, T-SHY, and race-result grids as requested.

## Shared storage architecture

The app no longer uses `localStorage` for application state.

### Local development

When running Vite in development without Supabase variables, `src/data/storage.ts` calls `GET /api/state` and `POST /api/state`. The Vite plugin in `vite.config.ts` reads and writes the root `data.json` file. If the file is missing or invalid, the app falls back to `defaultState()`; the next local POST recreates a valid JSON file. If Supabase variables are present, development uses Supabase too, so local testing matches production. Every edited prediction, reorder, fastest-lap change, avatar upload, winner/tweet change, APPLY RESULT, round edit, and RESET calls the save path.

### Live GitHub Pages status

GitHub Pages is static hosting and cannot accept browser writes to the repository. The deployed site now uses the configured Supabase REST API directly from the browser, so it does not need to write the repository. When no Supabase environment variables are present in production, writes are intentionally rejected and a visible save error is shown; this is not silently presented as shared persistence.

### Supabase setup for true live sharing

1. Create a free Supabase project.
2. Run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.app_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.app_state (id, state)
values ('gridline', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.app_state enable row level security;
create policy "public can read gridline state" on public.app_state for select using (id = 'gridline');
create policy "public can update gridline state" on public.app_state for update using (id = 'gridline') with check (id = 'gridline');
```

3. Add the Supabase project URL and anon public key as Vite environment variables in a local `.env` file (never commit secrets):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

4. Add the same variables to the GitHub repository Actions secrets as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `.github/workflows/deploy.yml` injects them only at build time. Use the publishable/anon key, never a Supabase secret/service-role key, because Vite embeds `VITE_*` values into browser JavaScript.

The client then reads and patches the single `app_state` row with `id = 'gridline'`, using the same `AppState` JSON shape as `data.json`. The anon key is intended to be public; do not put a Supabase service-role key in the browser. The current adapter is refresh-based: a new page load reads the latest shared row, but there is no Supabase Realtime subscription yet. Save requests are serialized so rapid edits persist in order.

On startup the UI stays in a loading state until the storage read completes. The browser console logs whether the state came from local `data.json`, Supabase, the static JSON seed, or defaults. Storage read failures show a retry state instead of flashing or overwriting with defaults.

## Data model

```ts
type AppState = {
  version: 1;
  round: string;
  vova: Driver[]; tshy: Driver[]; result: Driver[];
  vovaFL: Driver; tshyFL: Driver; resultFL: Driver;
  history: { round:string; date:string; vova:number; tshy:number; totalVova:number; totalTshy:number }[];
  scores: { vova:number; tshy:number };
  avatars: { vova:string; tshy:string };
  winner: string;
  tweet: string;
  tweetAvatar: string;
  cardAccent: string;
  lastApplied: { round:string; vova:number[]; tshy:number[] } | null;
}
```

Avatars, the Formula 1 account avatar, and winner images are base64 strings when uploaded. The root seed file intentionally contains empty arrays/strings; normalization supplies sensible placeholder defaults on first load. `cardAccent` is a shared hex color for the Last Race Winner card, selected only from team-color presets; it drives the card border/background and the bottom-only non-destructive image gradient overlay without an outer glow.

## Scoring formula

`scorePlayer` iterates over each predicted position. An exact position match adds `SCORING_RULES.exact` (12). A non-exact driver match adds `SCORING_RULES.range` (6) only when both predicted and actual positions are in the top 5. For example, Leclerc predicted P3 and finishing P4 earns +6, while predicted P8 and finishing P9 earns 0; bottom-5 non-exact positions receive no range bonus. A driver missing from the result top 10 earns 0. A matching fastest-lap driver adds `SCORING_RULES.fastestLap` (2).

## Limitations / TODO

- The published Pages site is configured with the Supabase URL and publishable key through encrypted GitHub Actions secrets. It uses refresh-based synchronization: visitors see the same saved state after loading/refreshing. There is no realtime subscription yet.
- History entries have no edit/delete controls.
- Realtime Supabase subscriptions are not implemented; sync is refresh-based.
