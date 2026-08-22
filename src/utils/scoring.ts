import type { Driver } from '../data/drivers';
export const SCORING_RULES = { exact:12, range:6, fastestLap:2, miss:0 } as const;
export function scorePlayer(prediction:Driver[], result:Driver[], predictedFL:Driver, resultFL:Driver) {
 let total=0; prediction.forEach((driver,i)=>{ const actual=result.findIndex(d=>d.id===driver.id); if(actual===i) total+=SCORING_RULES.exact; else if(actual!==-1 && Math.abs(actual-i)<=5) total+=SCORING_RULES.range; });
 if(predictedFL.id===resultFL.id) total+=SCORING_RULES.fastestLap; return total;
}
