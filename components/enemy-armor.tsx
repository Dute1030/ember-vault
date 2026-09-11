'use client';
import {useEffect,useState} from 'react';
import {Shield} from 'lucide-react';
import type {CombatFeedback} from '@/lib/combat-feedback';
export function EnemyArmor({block,nextBlock,feedback,target}:{block:number;nextBlock:number;feedback?:CombatFeedback;target:number}){
 const gain=feedback?.impacts.find(i=>i.target===target&&i.kind==='guard'&&i.label==='护甲 +');
 const[revealed,setRevealed]=useState(false);
 useEffect(()=>{if(!gain)return;const timer=setTimeout(()=>setRevealed(true),gain.delay);return()=>clearTimeout(timer)},[gain]);
 const amount=revealed?nextBlock:block;
 return <span className={'enemy-armor'+(amount>0?' has-armor':'')+(revealed?' armor-gained':'')} aria-live="polite" aria-label={`当前护甲 ${amount} 点`} title="护甲先抵消攻击伤害；在该敌人下次行动开始时清零。"><Shield size={17}/><span>护甲</span><b>{amount}</b>{revealed&&gain&&<small>+{gain.amount}</small>}</span>;
}
