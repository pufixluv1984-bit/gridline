import type { Driver } from '../data/drivers';
export const SCORING_RULES = { exact:12, range:6, fastestLap:2, miss:0 } as const;
const isTopHalf=(position:number)=>position>=1&&position<=5;
export function scorePlayer(prediction:Driver[], result:Driver[], predictedFL:Driver, resultFL:Driver) {
 let total=0; prediction.forEach((driver,i)=>{ const actualIndex=result.findIndex(d=>d.id===driver.id); if(actualIndex===-1) return; const predictedPosition=i+1; const actualPosition=actualIndex+1; if(actualPosition===predictedPosition) total+=SCORING_RULES.exact; else if(isTopHalf(predictedPosition)===isTopHalf(actualPosition)) total+=SCORING_RULES.range; });
 if(predictedFL?.id===resultFL?.id) total+=SCORING_RULES.fastestLap; return total;
}
