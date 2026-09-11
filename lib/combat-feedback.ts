import {getCard,intent,type Game,type Action} from './game.ts';

export type Impact = {target: number; kind: 'slash'|'magic'|'poison'|'guard'|'heal'; amount: number; delay: number; label?:string};
export type CombatFeedback = {impacts: Impact[]; attackers: {target:number;delay:number}[];duration:number};
// Presentation only: the game reducer remains the sole authority for all outcomes.
export function combatFeedback(before:Game,after:Game,action:Action):CombatFeedback {
  const result:CombatFeedback={impacts:[],attackers:[],duration:650};
  if(before.phase!=='battle'||before===after)return result;
  if(action.type==='play'){
    const card=getCard(before.hand[action.index]);
    const kind=card.poison?'poison':card.burst||card.job==='arcanist'?'magic':'slash';
    if(card.damage||card.shieldStrike||card.poison)result.attackers.push({target:-1,delay:0});
    before.enemies.forEach((enemy,i)=>{
      const next=after.enemies[i];
      if(enemy.hp<=0||!next)return;
      if(enemy.minion&&next.hp===0&&after.enemies.some(e=>e.boss==='bishop'&&e.hp===0)&&!card.all&&(action.target??before.target)!==i){result.impacts.push({target:i,kind:'magic',amount:0,delay:100,label:'消散'});return}
      const damage=enemy.hp-next.hp,blocked=enemy.block-next.block,poison=next.poison-enemy.poison;
      if(damage>0)result.impacts.push({target:i,kind:kind==='poison'?'slash':kind,amount:damage,delay:70});
      if(blocked>0)result.impacts.push({target:i,kind:'guard',amount:blocked,delay:100});
      if(poison>0)result.impacts.push({target:i,kind:'poison',amount:poison,delay:120});
    });
    if(after.block>before.block)result.impacts.push({target:-1,kind:'guard',amount:after.block-before.block,delay:0,label:'护甲 +'});
    if(after.hp>before.hp)result.impacts.push({target:-1,kind:'heal',amount:after.hp-before.hp,delay:0});
    if(after.hp<before.hp)result.impacts.push({target:-1,kind:'slash',amount:before.hp-after.hp,delay:0});
  }else if(action.type==='end'){
    let block=before.block,hp=before.hp,delay=0;
    for(let i=0;i<before.enemies.length;i++){
      const enemy=before.enemies[i];
      if(enemy.hp<=0)continue;
      if(enemy.poison>0){result.impacts.push({target:i,kind:'poison',amount:Math.min(enemy.hp,enemy.poison),delay});delay+=180;}
      if(enemy.hp<=enemy.poison){if(enemy.boss==='bishop')break;continue;}
      const attack=intent(before,enemy);
      if(attack.damage){
        result.attackers.push({target:i,delay});
        for(let hit=0;hit<attack.hits;hit++){
          const blocked=Math.min(block,attack.damage),damage=attack.damage-blocked;
          const actualDamage=Math.min(Math.max(0,hp),damage);
          block-=blocked;hp-=damage;
          if(blocked)result.impacts.push({target:-1,kind:'guard',amount:blocked,delay:delay+80});
          if(actualDamage)result.impacts.push({target:-1,kind:'slash',amount:actualDamage,delay:delay+80});
          delay+=150;
        }
      }
      if(attack.block)result.impacts.push({target:i,kind:'guard',amount:attack.block,delay,label:'护甲 +'});
      delay+=180;
      if(hp<=0)break;
    }
    result.duration=delay+500;
  }
  return result;
}
