import {newGame,act,type Game,type Action} from './game.ts';
export const TUTORIAL_STEPS=[
  {title:'先观察敌人意图',text:'上方「6 点攻击」表示敌人结束回合后会打你。点击骷髅，确认你已看清它的意图。正式战斗请先选牌，再点目标。'},
  {title:'用护甲挡住攻击',text:'打出「格挡」：花费 1 点能量，获得 5 点护甲。加上铁卫的被动 2 护甲，足以挡下 6 点攻击。'},
  {title:'打出你的第一击',text:'先点击「斩击」，再点击骷髅施放：花费 1 点能量，造成 6 点伤害。能量数字决定本回合还能打多少牌。'},
  {title:'结束回合，观察结算',text:'点击结束回合。敌人会攻击，护甲先承受伤害；随后弃置手牌、抽 5 张，能量恢复为 3。剩余能量不会保留。'},
  {title:'抓住击杀机会',text:'敌人只剩 6 点生命。选择「斩击」后点击骷髅，将它击败，这样它就没有机会再攻击。'},
  {title:'战后构筑',text:'选一张奖励卡牌，或跳过以保持牌组精简。正式冒险中，营地可以休息或升级，商店可以删掉基础牌。'},
  {title:'准备好踏入地牢了',text:'记住：看意图 → 留够防御 → 集中击杀。下一步选择职业开始冒险；铁卫更适合新手，影刃靠连击与毒，秘术师靠蓄能与爆发。'},
];
export function newTutorial():Game{
  const g=act(newGame('warden',false,7),{type:'node',lane:1});
  g.hand=['guard','strike','shield'];g.draw=['guard','strike','shield','guard','strike'];g.discard=[];g.exhaust=[];
  g.enemies=[{name:'失魂士兵',hp:12,maxHp:12,block:0,poison:0,weak:0,vuln:0,power:0,offset:0,pattern:[{damage:6,label:'训练攻击'}]}];g.target=0;
  return g;
}
export function tutorialAllows(step:number,g:Game,a:Action){
  if(step===0)return a.type==='target'&&a.index===0;
  if(step===1||step===2||step===4)return a.type==='play'&&g.hand[a.index]===(step===1?'guard':'strike');
  if(step===3)return a.type==='end';
  if(step===5)return a.type==='reward'&&(a.index===-1||!!g.offers[a.index]);
  return false;
}
