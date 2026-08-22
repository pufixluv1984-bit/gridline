import { defaultState, normalizeState, type AppState } from './appState';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const hasSupabase = Boolean(supabaseUrl && supabaseKey);

async function readResponse(response: Response) {
  if (!response.ok) throw new Error(`Storage request failed: ${response.status}`);
  return response.json();
}

export type LoadResult = { state: AppState; source: 'local-data.json'|'supabase'|'static-data.json'|'defaults'; error?: string };

export async function loadSharedState(): Promise<LoadResult> {
  if (hasSupabase) {
    try {
      const rows = await readResponse(await fetch(`${supabaseUrl}/rest/v1/app_state?id=eq.gridline&select=state`, { headers: { apikey: supabaseKey!, Authorization: `Bearer ${supabaseKey}` } }));
      return { state:normalizeState(rows[0]?.state), source:'supabase' };
    } catch (error) { console.error('[GRIDLINE] Failed to load Supabase state.', error); return { state:defaultState(), source:'defaults', error:String(error) }; }
  }
  if (import.meta.env.DEV) {
    try { return { state:normalizeState(await readResponse(await fetch('/api/state'))), source:'local-data.json' }; }
    catch (error) { console.error('[GRIDLINE] Failed to load local data.json.', error); return { state:defaultState(), source:'defaults', error:String(error) }; }
  }
  try { return { state:normalizeState(await readResponse(await fetch(`${import.meta.env.BASE_URL}data.json?cache=${Date.now()}`))), source:'static-data.json' }; }
  catch (error) { console.error('[GRIDLINE] Failed to load static data.json.', error); return { state:defaultState(), source:'defaults', error:String(error) }; }
}

export async function saveSharedState(state: AppState): Promise<void> {
  if (hasSupabase) {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_state?id=eq.gridline`, { method:'PATCH', headers:{ apikey:supabaseKey!, Authorization:`Bearer ${supabaseKey}`, 'Content-Type':'application/json', Prefer:'return=minimal' }, body:JSON.stringify({ state }) });
    if (!response.ok) throw new Error(`Supabase state save failed: ${response.status}`);
    return;
  }
  if (import.meta.env.DEV) {
    const response = await fetch('/api/state', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(state) });
    if (!response.ok) throw new Error(`Local state save failed: ${response.status}`);
    return;
  }
  throw new Error('Live shared persistence is not configured. Configure Supabase before expecting cross-device writes.');
}
