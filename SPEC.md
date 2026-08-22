# GRIDLINE specification

GRIDLINE is an F1 prediction battle for VOVA and T-SHY. It provides a dashboard for editing two top-10 predictions and the official result, applying scoring rules, reviewing round history, and resetting the shared championship totals.

## Stack and structure

- React + TypeScript + Vite with custom CSS.
- `src/main.tsx` contains the Dashboard, History, grids, score card, RESET flow, and upload controls.
- `src/styles.css` contains the responsive dark visual system.
- `src/data/drivers.ts` is the driver/team source of truth.
- `src/data/appState.ts` defines the shared JSON shape, defaults, and normalization.
- `src/data/storage.ts` selects the local Vite API, Supabase REST API, or static read-only fallback.
- `src/utils/scoring.ts` contains scoring constants and the score engine.
- `vite.config.ts` provides the local `/api/state` read/write endpoint and emits root `data.json` into production builds.
- `data.json` is the root-project seed/state file used by local development and emitted as a static seed for GitHub Pages.

## Implemented screens and behavior

The Dashboard includes the header tabs, hero, editable round number, shared score card, avatar uploads, scoring rules, two prediction grids, fastest-lap selects, last-race-winner card, official result grid, APPLY RESULT, and RESET. Prediction cards support native HTML drag-and-drop reordering and driver selection. Duplicate drivers are allowed and receive a yellow warning border. The History tab shows applied rounds and running scores.

RESET uses a confirmation dialog with the exact destructive-action warning. After confirmation it sets both shared scores to zero and clears the complete history array. It intentionally preserves the current VOVA, T-SHY, and race-result grids as requested.

## Shared storage architecture

The app no longer uses `localStorage` for application state.

### Local development

When running Vite in development, `src/data/storage.ts` calls `GET /api/state` and `POST /api/state`. The Vite plugin in `vite.config.ts` reads and writes the root `data.json` file. If the file is missing or invalid, the app falls back to `defaultState()`; the next local POST recreates a valid JSON file. Every edited prediction, reorder, fastest-lap change, avatar upload, winner/tweet change, APPLY RESULT, round edit, and RESET calls the save path.

### Live GitHub Pages status

GitHub Pages is static hosting and cannot accept browser writes to the repository. The deployed site can read the emitted `data.json`, but it cannot provide true cross-device persistence without a backend. In this environment I could not create or configure a Supabase project on the user's behalf, so the current live deployment is **not yet a genuinely shared writable backend**. When no Supabase environment variables are present in production, writes are intentionally skipped and a warning is logged; this is not silently presented as shared persistence.

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

4. Add the same variables to the GitHub Pages deployment workflow/environment. The current `gh-pages` script does not inject repository secrets, so a workflow is recommended before enabling production writes.

The client then reads and patches the single `app_state` row with `id = 'gridline'`, using the same `AppState` JSON shape as `data.json`. The anon key is intended to be public; do not put a Supabase service-role key in the browser.

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
}
```

Avatars and winner images are base64 strings when uploaded. The root seed file intentionally contains empty arrays/strings; normalization supplies sensible placeholder defaults on first load.

## Scoring formula

`scorePlayer` iterates over each predicted position. An exact index match adds `SCORING_RULES.exact` (12). A driver found in the result within five positions adds `SCORING_RULES.range` (6). Otherwise it adds zero. A matching fastest-lap driver adds `SCORING_RULES.fastestLap` (2).

## Limitations / TODO

- The current published Pages site is read-only until Supabase credentials and policies are configured.
- Native drag-and-drop is used instead of dnd-kit to keep the standalone build lightweight.
- History entries have no edit/delete controls.
- The winner label remains decorative and follows the round input.
