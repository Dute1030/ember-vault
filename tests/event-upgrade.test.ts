import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,act,getCard} from '../lib/game.ts';

for(const deck of [['strike','strike','guard+','guard~'],['strike','guard+'],['strike+','guard~']]){
 test(`mirror reports the actual upgrades for ${deck.join(',')}`,()=>{
  const before=newGame('warden',false,42);before.phase='event';before.event=2;before.hp=30;before.deck=[...deck];
  const after=act(before,{type:'event',index:0});
  const changed=before.deck.flatMap((id,index)=>id===after.deck[index]?[]:[{id,index}]);
  assert.equal(after.hp,23);assert.equal(after.phase,'map');assert.deepEqual(before.deck,deck);
  assert.equal(changed.length,Math.min(2,deck.filter(id=>!/[+~]$/.test(id)).length));
  for(const {id,index} of changed){assert.equal(after.deck[index],id+'+');assert.ok(after.log[0].includes(`${getCard(id).name} → ${getCard(after.deck[index]).name}`));}
  if(!changed.length)assert.match(after.log[0],/没有可升级/);
  assert.equal(act(after,{type:'event',index:0}),after);
 });
}
test('lethal mirror payment never upgrades cards',()=>{
 const before=newGame('warden',false,42);before.phase='event';before.event=2;before.hp=7;
 const after=act(before,{type:'event',index:0});assert.equal(after.phase,'lost');assert.deepEqual(after.deck,before.deck);
});
