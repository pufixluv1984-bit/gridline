import { drivers, defaultGrid, type Driver } from './drivers';

export type HistoryItem = { round:string; date:string; vova:number; tshy:number; totalVova:number; totalTshy:number };
export type AppState = {
  version: 1;
  round: string;
  vova: Driver[];
  tshy: Driver[];
  result: Driver[];
  vovaFL: Driver;
  tshyFL: Driver;
  resultFL: Driver;
  history: HistoryItem[];
  scores: { vova:number; tshy:number };
  avatars: { vova:string; tshy:string };
  winner: string;
  tweet: string;
};

export const avatarFallback = (name:string, color:string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="${color}"/><text x="50%" y="58%" text-anchor="middle" font-family="Arial" font-size="42" font-weight="700" fill="#fff">${name[0]}</text></svg>`)}`;

export function defaultState(): AppState {
  return {
    version: 1, round: '01', vova: defaultGrid(), tshy: defaultGrid().slice().reverse(), result: defaultGrid().slice().reverse(),
    vovaFL: drivers[7], tshyFL: drivers[7], resultFL: drivers[7], history: [], scores: { vova: 0, tshy: 0 },
    avatars: { vova: avatarFallback('V','#e84b5a'), tshy: avatarFallback('T','#24cbd0') },
    winner: 'https://images.unsplash.com/photo-1617654112368-307921291f42?auto=format&fit=crop&w=900&q=80',
    tweet: 'GEORGE RUSSELL WINS #F1SPRINT AT ZANDVOORT!!!'
  };
}

export function normalizeState(input: Partial<AppState> | null | undefined): AppState {
  const fallback = defaultState();
  return {
    ...fallback, ...input,
    scores: { ...fallback.scores, ...(input?.scores || {}) },
    avatars: { ...fallback.avatars, ...(input?.avatars || {}), vova: input?.avatars?.vova || fallback.avatars.vova, tshy: input?.avatars?.tshy || fallback.avatars.tshy },
    history: Array.isArray(input?.history) ? input!.history! : fallback.history,
    vova: Array.isArray(input?.vova) && input!.vova!.length ? input!.vova! : fallback.vova,
    tshy: Array.isArray(input?.tshy) && input!.tshy!.length ? input!.tshy! : fallback.tshy,
    result: Array.isArray(input?.result) && input!.result!.length ? input!.result! : fallback.result,
    winner: input?.winner || fallback.winner,
    tweet: input?.tweet || fallback.tweet
  };
}
