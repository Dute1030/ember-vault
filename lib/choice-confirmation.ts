import {getCard,description,NODE_NAMES,type Game,type Action} from './game.ts';
// Build a read-only preview. Only the UI's explicit confirm calls the reducer.
export function choiceConfirmation(state:Game,action:Action){let title='确认选择',detail='';switch(action.type){
case 'node':{const floor=state.floor+1;title=`前往第 ${floor+1} 层 · ${NODE_NAMES[state.route[floor][action.lane]]}`;detail=`选择${['左侧','中央','右侧'][action.lane]}路线。确认后进入该节点，本层无法改选。`;break}
case 'reward':title=action.index<0?'跳过奖励卡牌':'加入 '+getCard(state.offers[action.index]).name;detail=action.index<0?'不添加卡牌，保持牌组精简并继续前进。':`${getCard(state.offers[action.index]).cost} 能量。`+description(getCard(state.offers[action.index]))+' 确认后加入牌组，放弃其余奖励。';break;
case 'event':title=action.index===1?'平静离去':['献上鲜血','带走钱袋','触碰镜面'][state.event];detail=action.index===1?'恢复 5 点生命，结束事件。':['失去 9 生命，获得随机遗物。','获得 55 金币，加入一张基础斩击。','失去 7 生命，随机强化至多 2 张未升级卡牌。'][state.event];if(action.index===0&&state.hp<=(state.event===0?9:state.event===2?7:0))detail+=' 警告：此选择将导致本局死亡。';break;
case 'rest':title='在营地休息';detail=`恢复 ${Math.min(state.maxHp-state.hp,Math.ceil(state.maxHp*.3))} 点生命，结束本次营地停留，无法再升级。`;break;
case 'buy':title=action.index===3?'购买随机遗物':'购买 '+getCard(state.shop[action.index]).name;detail=action.index===3?'支付 90 金币，获得一件随机遗物。':`${getCard(state.shop[action.index]).cost} 能量。`+description(getCard(state.shop[action.index]))+' 支付 45 金币并加入牌组。';break;
case 'remove':title='移除 '+getCard(state.deck[action.index]).name;detail=`${getCard(state.deck[action.index]).cost} 能量。`+description(getCard(state.deck[action.index]))+' 支付 55 金币，永久移除这张牌。';break;
case 'leave':title=state.phase==='camp'?'离开营地':'离开商店';detail=state.phase==='camp'?'放弃本次休息和升级机会，继续前进。':'结束购物，继续前进。';break;
default:return null;
}return {title,detail};}
