# GRIDLINE specification

GRIDLINE is a client-side F1 prediction battle for VOVA and T-SHY. It provides a dashboard for entering two top-10 predictions and the official result, calculating round points, and reviewing applied rounds in a history view.

## Stack and structure

- React + TypeScript + Vite; custom CSS for the responsive dark UI.
- `src/main.tsx` contains the screens and interactive components.
- `src/styles.css` contains the visual system and responsive layout.
- `src/data/drivers.ts` is the single driver data source.
- `src/data/teamColors.ts` exposes the team color table.
- `src/utils/scoring.ts` contains constants and the score engine.

## Implemented screens and behavior

The Dashboard includes the header tabs, hero, editable round number, running score card, avatar uploads, scoring rules, prediction grids, fastest-lap selects, last-race-winner card with image/tweet persistence, and the official result grid. Prediction cards support native HTML drag-and-drop reordering and driver selection. Duplicate drivers are allowed and receive a yellow warning border. The History tab shows applied rounds and running scores.

The requested app is implemented without a backend. The “winner” label is decorative and follows the round input; the winner text/image are editable, but the F1 logo is represented with text rather than a remote icon. Applying a result records a history snapshot but does not clear or lock the grids, so the owner can correct an entry and apply again.

## Scoring formula

`scorePlayer` iterates over each predicted position. An exact index match adds `SCORING_RULES.exact` (12). A driver found in the result within five positions adds `SCORING_RULES.range` (6). Otherwise it adds zero. A matching fastest-lap driver adds `SCORING_RULES.fastestLap` (2).

## Local storage schema

`gridline-vova`, `gridline-tshy`, and `gridline-result` store arrays of ten Driver objects. `gridline-vova-fl`, `gridline-tshy-fl`, and `gridline-result-fl` store one Driver object each. `gridline-history` stores `{round,date,vova,tshy,totalVova,totalTshy}[]`. `gridline-avatars` stores `{vova,tshy}` base64 image strings. `gridline-winner` stores the winner image URL/base64 string and `gridline-tweet` stores the tweet text.

## Limitations / TODO

The project intentionally uses native drag-and-drop instead of the requested dnd-kit dependency to keep the standalone build lightweight. It has no multi-round reset workflow or edit/delete controls for history entries.
