# GRIDLINE

GRIDLINE is a dark, F1-inspired prediction battle for two players. Enter VOVA and T-SHY's top-10 predictions, choose fastest lap drivers, enter the official race result, apply the scoring rules, and review round history.

## Run locally

```bash
npm install
npm run dev
```

The app uses a shared JSON state model rather than `localStorage`.

During local development, Vite reads and writes the shared state in the root `data.json` through `/api/state`. GitHub Pages can serve the seed JSON but cannot accept browser writes; configure Supabase using the steps in `SPEC.md` for true shared persistence across visitors.

For live shared persistence, copy `.env.example` to `.env`, fill in the Supabase URL and anon key, and build/deploy with those variables available. `.env` is ignored by Git.

GitHub Pages deployment is automated by `.github/workflows/deploy.yml`. Add repository Actions secrets named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; use only the Supabase publishable/anon key here. Never add a Supabase secret/service-role key to GitHub Actions secrets used by the frontend build.

Editing is protected by a simple shared UI password. Set `VITE_ADMIN_PASSWORD` in `.env` locally and as a GitHub Actions secret for the live build. Visitors can view the site without logging in; each admin logs in separately and the browser remembers the session in `localStorage`. This is a casual UI gate, not backend-enforced security.

## Links

Live deployment: https://pufixluv1984-bit.github.io/gridline/

See [SPEC.md](SPEC.md) for the implementation details and [CHANGELOG.md](CHANGELOG.md) for the change history.
