import {EVENTS} from './events.ts';
import {cardRemovalCost,shopRefreshCost,getCard,description,NODE_NAMES,type Game,type Action} from './game.ts';
// Build a read-only preview. Only the UI's explicit confirm calls the reducer.
export function choiceConfirmation(state:Game,action:Action){let title='确认选择',detail='';switch(action.type){
case 'node':{const floor=state.floor+1;title=`前往第 ${floor+1} 层 · ${NODE_NAMES[state.route[floor][action.lane]]}`;detail=`选择${['左侧','中央','右侧'][action.lane]}路线。确认后进入该节点，本层无法改选。`;break}
case 'reward':title=action.index<0?'跳过奖励卡牌':'加入 '+getCard(state.offers[action.index]).name;detail=action.index<0?'不添加卡牌，保持牌组精简并继续前进。':`${getCard(state.offers[action.index]).cost} 能量。`+description(getCard(state.offers[action.index]))+' 确认后加入牌组，放弃其余奖励。';break;
case 'event':title=action.index===1?'平静离去':EVENTS[state.event].choice;detail=action.index===1?'恢复 5 点生命，结束事件。':EVENTS[state.event].detail;if(action.index===0&&state.hp<=EVENTS[state.event].hp)detail+=' 警告：此选择将导致本局死亡。';break;
case 'rest':title='在营地休息';detail=`恢复 ${Math.min(state.maxHp-state.hp,Math.ceil(state.maxHp*.3))} 点生命，结束本次营地停留，无法再升级。`;break;
case 'refreshShop':title='刷新商店卡牌';detail=`支付 ${shopRefreshCost(state)} 金币，重新上架 3 张本职业卡牌（已售出的卡位也会补货）。当前在售卡牌会被替换；遗物库存不变。下次刷新需 ${shopRefreshCost(state)+10} 金币，进入新商店后重置为 20 金币。`;break;
case 'buy':title=action.index===3?'购买随机遗物':'购买 '+getCard(state.shop[action.index]).name;detail=action.index===3?'支付 90 金币，获得一件随机遗物。':`${getCard(state.shop[action.index]).cost} 能量。`+description(getCard(state.shop[action.index]))+' 支付 45 金币并加入牌组。';break;
case 'remove':title='移除 '+getCard(state.deck[action.index]).name;detail=`${getCard(state.deck[action.index]).cost} 能量。`+description(getCard(state.deck[action.index]))+` 支付 ${cardRemovalCost(state)} 金币，永久移除这张牌，用完本店删牌机会。下一次删牌需 ${cardRemovalCost(state)+20} 金币；刷新商品不会恢复删牌机会。`;break;
case 'leave':title=state.phase==='camp'?'离开营地':'离开商店';detail=state.phase==='camp'?'放弃本次休息和升级机会，继续前进。':'结束购物，继续前进。';break;
default:return null;
}return {title,detail};}
