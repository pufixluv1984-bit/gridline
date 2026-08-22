import { defaultState, normalizeState, type AppState } from './appState';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const hasSupabase = Boolean(supabaseUrl && supabaseKey);

async function readResponse(response: Response) {
  if (!response.ok) throw new Error(`Storage request failed: ${response.status}`);
  return response.json();
}

export async function loadSharedState(): Promise<AppState> {
  try {
    if (import.meta.env.DEV) {
      return normalizeState(await readResponse(await fetch('/api/state')));
    }
    if (hasSupabase) {
      const rows = await readResponse(await fetch(`${supabaseUrl}/rest/v1/app_state?id=eq.gridline&select=state`, { headers: { apikey: supabaseKey!, Authorization: `Bearer ${supabaseKey}` } }));
      return normalizeState(rows[0]?.state);
    }
    return normalizeState(await readResponse(await fetch(`${import.meta.env.BASE_URL}data.json?cache=${Date.now()}`)));
  } catch (error) {
    console.warn('Shared state could not be loaded; using defaults.', error);
    return defaultState();
  }
}

export async function saveSharedState(state: AppState): Promise<void> {
  if (import.meta.env.DEV) {
    const response = await fetch('/api/state', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(state) });
    if (!response.ok) throw new Error(`Local state save failed: ${response.status}`);
    return;
  }
  if (hasSupabase) {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_state?id=eq.gridline`, { method:'PATCH', headers:{ apikey:supabaseKey!, Authorization:`Bearer ${supabaseKey}`, 'Content-Type':'application/json', Prefer:'return=minimal' }, body:JSON.stringify({ state }) });
    if (!response.ok) throw new Error(`Supabase state save failed: ${response.status}`);
    return;
  }
  console.warn('Live shared persistence is not configured. GitHub Pages is read-only; state was not saved remotely.');
}
