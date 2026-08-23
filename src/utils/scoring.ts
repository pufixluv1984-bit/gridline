import type { Driver } from '../data/drivers';
export const SCORING_RULES = { exact:12, range:6, fastestLap:2, miss:0 } as const;
const isTop5=(position:number)=>position>=1&&position<=5;
export function scorePositions(prediction:Driver[], result:Driver[]) {
 return prediction.map((driver,i)=>{ const actualIndex=result.findIndex(d=>d.id===driver.id); if(actualIndex===-1) return SCORING_RULES.miss; const predictedPosition=i+1; const actualPosition=actualIndex+1; if(actualPosition===predictedPosition) return SCORING_RULES.exact; if(isTop5(predictedPosition)&&isTop5(actualPosition)) return SCORING_RULES.range; return SCORING_RULES.miss; });
}
export function scorePlayer(prediction:Driver[], result:Driver[], predictedFL:Driver, resultFL:Driver) {
 let total=scorePositions(prediction,result).reduce((sum:number,points:number)=>sum+points,0);
 if(predictedFL?.id===resultFL?.id) total+=SCORING_RULES.fastestLap; return total;
}
