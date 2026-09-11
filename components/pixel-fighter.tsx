import type {CSSProperties} from 'react';
import type {CombatFeedback} from '../lib/combat-feedback';

export const SPRITES:Record<string,number>={warden:0,shade:1,arcanist:2,'地穴潜伏者':3,'失魂士兵':4,'祷火侍从':6,'灰烬幼灵':5,'迷途怨灵':6,'锈甲处刑者':7,'虚空骑士':8,'焚骨巨像':9,'守门者 · 铁颚':10,'无光主教':11,'灰烬之王':12};
export function PixelFighter({name,feedback,target=-1}:{name:string;feedback?:CombatFeedback;target?:number}){
  const cell=SPRITES[name]??3;
  const attack=feedback?.attackers.find(a=>a.target===target);
  const hit=feedback?.impacts.find(a=>a.target===target&&['slash','magic','poison'].includes(a.kind));
  return <div className="pixel-stage" aria-hidden="true"><div className={'sprite-motion'+(attack?' lunging':'')+(target>=0?' enemy-motion':'')} style={{animationDelay:`${attack?.delay??0}ms`} }><div className={'pixel-sprite'+(hit?' sprite-hit':'')} style={{backgroundPosition:`${(cell%4)*100/3}% ${Math.floor(cell/4)*100/3}%`,animationDelay:`${hit?.delay??0}ms`} }/></div></div>;
}
export function BattleImpacts({feedback,target}:{feedback?:CombatFeedback;target:number}){
  return <div className="impact-layer" aria-hidden="true">{feedback?.impacts.filter(x=>x.target===target).map((impact,i)=><div key={i} className={`impact impact-${impact.kind}`} style={{'--delay':`${impact.delay}ms`,'--float-x':`${i%2?18:-12}px`} as CSSProperties}><span className="impact-flash"/>{Array.from({length:6},(_,n)=><i key={n} className="impact-particle" style={{'--angle':`${n*60}deg`} as CSSProperties}/>)}<b className="damage-number">{impact.label??(impact.kind==='guard'?'格挡 ':impact.kind==='heal'?'+':impact.kind==='poison'?'毒 ': '−')}{impact.amount}</b></div>)}</div>;
}
