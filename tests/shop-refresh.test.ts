import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,act,CARDS,shopRefreshCost} from '../lib/game.ts';
import {choiceConfirmation} from '../lib/choice-confirmation.ts';

test('refresh replaces stock, refills sold slots and preserves purchased relic state',()=>{
 const s=newGame('warden',false,42);s.phase='shop';s.gold=100;s.shop=['bash','','wall'];s.removed=true;
 const original=structuredClone(s);const preview=choiceConfirmation(s,{type:'refreshShop'});
 assert.match(preview!.detail,/20 金币/);assert.deepEqual(s,original);
 const n=act(s,{type:'refreshShop'});assert.equal(n.gold,80);assert.equal(n.shop.length,3);assert.equal(new Set(n.shop).size,3);
 assert.ok(n.shop.every(k=>CARDS[k].job===s.job&&!s.shop.includes(k)));assert.deepEqual(n.deck,s.deck);assert.deepEqual(n.relics,s.relics);assert.equal(n.removed,true);assert.equal(shopRefreshCost(n),30);assert.deepEqual(s,original);
 const next=act(n,{type:'refreshShop'});assert.equal(next.gold,50);assert.equal(shopRefreshCost(next),40);
});
test('unaffordable and out-of-shop refreshes do not change state or randomness',()=>{
 const s=newGame('shade');assert.equal(act(s,{type:'refreshShop'}),s);s.phase='shop';s.gold=19;assert.equal(act(s,{type:'refreshShop'}),s);
 s.gold=20;assert.equal(act(s,{type:'refreshShop'}).gold,0);
});
test('older saves default to 20 and entering another shop resets price',()=>{
 const s=newGame('arcanist',false,42);delete s.shopRefreshes;assert.equal(shopRefreshCost(s),20);
 s.shopRefreshes=4;s.route[0][1]='shop';const n=act(s,{type:'node',lane:1});assert.equal(n.phase,'shop');assert.equal(shopRefreshCost(n),20);
});
