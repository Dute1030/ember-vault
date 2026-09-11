import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,act,type Game} from '../lib/game.ts';
import {combatFeedback} from '../lib/combat-feedback.ts';
function combat():Game{const g=act(newGame('warden',false,42),{type:'node',lane:1});g.enemies=[{name:'失魂士兵',hp:50,maxHp:50,block:0,poison:0,weak:0,vuln:0,power:0,pattern:[{damage:10,label:'攻击'}],offset:0}];return g}
test('damage popups use actual health loss and absorbed armor separately',()=>{const g=combat();g.hand=['strike'];g.enemies[0].block=4;const a={type:'play',index:0} as const;const n=act(g,a);const fx=combatFeedback(g,n,a);assert.equal(fx.impacts.find(i=>i.kind==='slash')?.amount,2);assert.equal(fx.impacts.find(i=>i.kind==='guard')?.amount,4);assert.deepEqual(fx.attackers,[{target:-1,delay:0}])});
test('overkill popup never exceeds actual enemy life',()=>{const g=combat();g.enemies[0].hp=1;g.hand=['strike'];const a={type:'play',index:0} as const;const n=act(g,a);assert.equal(n.phase,'reward');assert.equal(combatFeedback(g,n,a).impacts.find(i=>i.target===0)?.amount,1)});
test('poison kill has no attack animation from the dead enemy',()=>{const g=combat();g.enemies[0].hp=3;g.enemies[0].poison=5;const a={type:'end'} as const;const fx=combatFeedback(g,act(g,a),a);assert.equal(fx.attackers.length,0);assert.equal(fx.impacts[0].kind,'poison');assert.equal(fx.impacts[0].amount,3)});
test('multi-hit enemy attacks consume armor in the correct order',()=>{const g=combat();g.block=12;g.enemies[0].pattern[0].hits=2;const a={type:'end'} as const;const fx=combatFeedback(g,act(g,a),a);assert.deepEqual(fx.impacts.filter(i=>i.kind==='guard').map(i=>i.amount),[10,2]);assert.deepEqual(fx.impacts.filter(i=>i.kind==='slash').map(i=>i.amount),[8]);assert(fx.duration>Math.max(...fx.impacts.map(i=>i.delay))+450)});
test('AOE magic affects every living enemy and does not mutate game state',()=>{const g=combat();g.enemies.push(structuredClone(g.enemies[0]));g.hand=['nova'];g.focus=3;const a={type:'play',index:0} as const,n=act(g,a),snapshot=structuredClone(n);const fx=combatFeedback(g,n,a);assert.deepEqual(fx.impacts.filter(i=>i.kind==='magic').map(i=>[i.target,i.amount]),[[0,21],[1,21]]);assert.deepEqual(n,snapshot)});
test('invalid play produces no feedback; armor gain differs from blocked damage',()=>{const g=combat();g.hand=['guard'];g.energy=0;const a={type:'play',index:0} as const;assert.equal(combatFeedback(g,act(g,a),a).impacts.length,0);g.energy=1;assert.equal(combatFeedback(g,act(g,a),a).impacts[0].label,'护甲 +')});
test('lethal enemy multi-hit never displays more lost health than player had',()=>{const g=combat();g.hp=3;g.block=0;g.enemies[0].pattern[0].hits=2;const a={type:'end'} as const;const fx=combatFeedback(g,act(g,a),a);assert.equal(fx.impacts.filter(i=>i.target===-1&&i.kind==='slash').reduce((n,i)=>n+i.amount,0),3)});
test('boss guard gain matches armor retained into player turn',()=>{
 const g=combat();g.enemies[0].boss='ashking';g.enemies[0].block=12;g.enemies[0].pattern=[{damage:0,block:16,buff:2,label:'王座庇护'}];
 const action={type:'end'} as const;const next=act(g,action);const fx=combatFeedback(g,next,action);
 assert.equal(next.enemies[0].block,16);assert.equal(fx.impacts.find(i=>i.target===0&&i.label==='护甲 +')?.amount,16);
});
test('enemy attacks that also grant armor emit both feedback types',()=>{
 const g=combat();g.enemies[0].pattern=[{damage:5,block:8,label:'盾击'}];const action={type:'end'} as const;const next=act(g,action);const fx=combatFeedback(g,next,action);
 assert.equal(next.enemies[0].block,8);assert.ok(fx.impacts.some(i=>i.target===-1));assert.equal(fx.impacts.find(i=>i.target===0&&i.label==='护甲 +')?.amount,8);
});
