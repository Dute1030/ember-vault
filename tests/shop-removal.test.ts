import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,act,cardRemovalCost} from '../lib/game.ts';
import {choiceConfirmation} from '../lib/choice-confirmation.ts';
test('one removal per shop, refresh preserves limit, next shop preserves increased price',()=>{
 const s=newGame('warden',false,42);s.phase='shop';s.gold=500;s.removed=true;
 const n=act(s,{type:'remove',index:0});assert.equal(n.gold,445);assert.equal(n.deck.length,s.deck.length-1);assert.equal(n.removed,true);assert.equal(n.shopRemovalUsed,true);assert.equal(cardRemovalCost(n),75);
 assert.equal(act(n,{type:'remove',index:0}),n);
 const refreshed=act(n,{type:'refreshShop'});assert.equal(act(refreshed,{type:'remove',index:0}),refreshed);
 const left=act(refreshed,{type:'leave'});left.route[left.floor+1][1]='shop';const shop=act(left,{type:'node',lane:1});assert.equal(shop.shopRemovalUsed,false);assert.equal(cardRemovalCost(shop),75);
 const snapshot=structuredClone(shop);assert.match(choiceConfirmation(shop,{type:'remove',index:0})!.detail,/75 金币/);assert.deepEqual(shop,snapshot);
 const removed=act(shop,{type:'remove',index:0});assert.equal(removed.gold,shop.gold-75);assert.equal(cardRemovalCost(removed),95);
});
test('removal rejects insufficient funds, small decks and invalid indices without changes',()=>{
 const s=newGame('shade');s.phase='shop';s.cardsRemoved=1;s.gold=74;assert.equal(act(s,{type:'remove',index:0}),s);
 s.gold=75;for(const index of [-1,.5,999])assert.equal(act(s,{type:'remove',index}),s);
 s.deck=s.deck.slice(0,6);const n=act(s,{type:'remove',index:0});assert.equal(n.gold,0);assert.equal(n.deck.length,5);n.shopRemovalUsed=false;n.gold=1000;assert.equal(act(n,{type:'remove',index:0}),n);
});
test('older saves and new runs start at the base removal price',()=>{
 const s=newGame('arcanist');delete s.cardsRemoved;delete s.shopRemovalUsed;s.phase='shop';assert.equal(cardRemovalCost(s),55);assert.equal(act(s,{type:'remove',index:0}).cardsRemoved,1);
 assert.equal(cardRemovalCost(newGame('warden')),55);
});
