import {getCard,type Job} from './game.ts';
export const ARCHETYPES=[
 {id:'armor',job:'warden',name:'蓄甲盾击',setup:['guard','wall','hold','bulwark'],payoff:['shield','furnace','iron'],support:['brace','shelter'],loop:'壁垒蓄甲 → 固守跨回合保留 → 盾击输出、钢铁意志补牌；熔炉重拳把护甲一次性转为伤害。',risk:'先输出会失去抽牌条件；熔炉重拳耗光护甲，须选敌人不进攻的回合。'},
 {id:'blood',job:'warden',name:'血铸反攻',setup:['blood','oath','gamble'],payoff:['rage','laststand','march','rally'],support:['renew','resolve','provision'],loop:'血铸或血誓铸甲先支付生命 → 战意额外力量 → 背水列阵爆发、钢铁行军补防，重整旗鼓回血补牌。',risk:'需要同回合先支付至少 3 生命；敌人伤害不算。无痛分支无法单独启动血铸条件。'},
 {id:'poison',job:'shade',name:'叠毒引爆',setup:['venom','whisper'],payoff:['antidote','toxic','rupture'],support:['smoke','renew'],loop:'淬毒配合无声蔓延叠至 5 层 → 以毒为幕加强防御、毒雾续毒 → 毒囊破裂引爆全部中毒。',risk:'引爆后毒层清空，防御奖励也随之消失；补毒与引爆的时机要取舍。'},
 {id:'chain',job:'shade',name:'连击收割',setup:['shiv','cycle','dance','mark'],payoff:['ambush','thread','finish','vanish'],support:['escape','prepare','momentum','desperate'],loop:'快刃、潜行低费启动 → 第三张触发疾影 → 牵丝刃续抽、烟中换位补防，终结收割。',risk:'高费牌太多会卡住连击；灰烬之王半血后第四张牌会灼伤自身。'},
 {id:'focus',job:'arcanist',name:'蓄能爆发',setup:['meditate','channel','embers','sundial'],payoff:['bolt','comet','nova','starlance','prism'],support:['aegis','surge','insight'],loop:'冥想等蓄至 4 灵力 → 彗星触发额外爆发；折光结界可把灵力换护甲并抽牌。',risk:'爆发与折光争夺同一份灵力；提前打灵火会让后续大牌失去蓄能条件。'},
 {id:'frost',job:'arcanist',name:'寒霜压制',setup:['frost'],payoff:['barrier','orbit','eclipse'],support:['feint','aegis','sundial'],loop:'寒霜施加 2 回合虚弱 → 符文屏障获得额外护甲、环星术额外蓄能 → 蚀日咒打出条件群伤。',risk:'敌人行动后虚弱减 1，须及时补寒霜；群攻只对已经满足条件的敌人增加伤害。'},
] as const;
export function jobArchetypes(job:Job){return ARCHETYPES.filter(a=>a.job===job)}
export function cardArchetypes(key:string){const id=getCard(key).id.replace(/[+~]$/,'');return ARCHETYPES.filter(a=>[...a.setup,...a.payoff].some(k=>k===id))}
export function archetypeDeck(deck:string[],ids:readonly string[]){return deck.filter(k=>ids.includes(getCard(k).id.replace(/[+~]$/,'')))}
export function draftContext(deck:string[],key:string){const routes=cardArchetypes(key);if(!routes.length)return '通用补位：按当前缺少的攻防能力选择';return routes.map(a=>{const names=[...new Set(archetypeDeck(deck,[...a.setup,...a.payoff]).map(k=>getCard(k).name))];return `${a.name} · ${names.length?'已有 '+names.slice(0,3).join('、'):'配合牌不足，可先跳过'}`}).join(' / ')}
