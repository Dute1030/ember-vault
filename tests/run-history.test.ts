import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame} from '../lib/game.ts';
import {recordRun,runStats,parseHistory,runTime} from '../lib/run-history.ts';
test('terminal results deduplicate across reloads and retain elapsed time',()=>{
 const g={...newGame('warden'),runId:'one',startedAt:1000,floor:14};const first=recordRun([],g,'won',61000);assert.equal(first[0].durationMs,60000);
 const restored=parseHistory(JSON.stringify(first));assert.equal(recordRun(restored,g,'won',99000),restored);assert.equal(runStats(restored,'warden',false).wins,1);assert.equal(runTime(60000),'1分 0秒');
});
test('stats separate class and difficulty, count abandonment and exclude unknown timing',()=>{
 const g={...newGame('shade'),runId:'a',floor:14};let records=recordRun([],g,'won',10000);
 records=recordRun(records,{...g,runId:'b',startedAt:1000},'won',5100);records=recordRun(records,{...g,runId:'c'},'abandoned',6000);
 records=recordRun(records,{...g,runId:'d',hard:true},'won',6000);records=recordRun(records,{...g,runId:'e',job:'warden'},'lost',6000);
 assert.deepEqual(runStats(records,'shade',false),{total:3,wins:2,losses:0,abandoned:1,bestMs:4100,deepest:15});assert.equal(runStats(records,'shade',true).wins,1);assert.equal(runStats(records,'warden',false).wins,0);
});
test('legacy runs do not fabricate durations and malformed history entries are ignored',()=>{
 const g={...newGame('warden'),runId:'legacy'};const records=recordRun([],g,'lost',1000);assert.equal(records[0].durationMs,null);assert.equal(runStats(records,'warden',false).bestMs,null);
 assert.equal(parseHistory(JSON.stringify([...records,...records,{bad:true}])).length,1);assert.deepEqual(recordRun([],newGame('warden'),'won'),[]);
});
