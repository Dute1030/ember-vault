import {JOBS,type Game,type Job} from './game.ts';
export type RunRecord={id:string;job:Job;hard:boolean;outcome:'won'|'lost'|'abandoned';floor:number;endedAt:number;durationMs:number|null};
export const HISTORY_KEY='ember-vault-history-v1';
export function recordRun(records:RunRecord[],game:Game,outcome:RunRecord['outcome'],now=Date.now()):RunRecord[]{
 if(!game.runId||records.some(r=>r.id===game.runId))return records;
 return [...records,{id:game.runId,job:game.job,hard:game.hard,outcome,floor:Math.max(0,game.floor+1),endedAt:now,durationMs:game.startedAt===undefined?null:Math.max(0,now-game.startedAt)}];
}
export function parseHistory(raw:string|null):RunRecord[]{
 if(!raw)return [];
 const value:unknown=JSON.parse(raw);if(!Array.isArray(value))throw Error('Invalid history');
 const ids=new Set<string>();
 return value.filter((r):r is RunRecord=>{if(!r||typeof r!=='object')return false;const x=r as RunRecord;const valid=typeof x.id==='string'&&!ids.has(x.id)&&Object.hasOwn(JOBS,x.job)&&typeof x.hard==='boolean'&&['won','lost','abandoned'].includes(x.outcome)&&Number.isInteger(x.floor)&&x.floor>=0&&x.floor<=15&&Number.isFinite(x.endedAt)&&(x.durationMs===null||(Number.isFinite(x.durationMs)&&x.durationMs>=0));if(valid)ids.add(x.id);return valid});
}
export function runStats(records:RunRecord[],job:Job,hard:boolean){const runs=records.filter(r=>r.job===job&&r.hard===hard),wins=runs.filter(r=>r.outcome==='won'),times=wins.flatMap(r=>r.durationMs===null?[]:[r.durationMs]);return {total:runs.length,wins:wins.length,losses:runs.filter(r=>r.outcome==='lost').length,abandoned:runs.filter(r=>r.outcome==='abandoned').length,bestMs:times.length?Math.min(...times):null,deepest:runs.reduce((m,r)=>Math.max(m,r.floor),0)}}
export function runTime(ms:number|null){if(ms===null)return '未计时';const seconds=Math.floor(ms/1000);return `${Math.floor(seconds/3600)?Math.floor(seconds/3600)+'时 ':''}${Math.floor(seconds/60)%60}分 ${seconds%60}秒`}
