'use client';
import {useEffect,useRef} from 'react';
import {MUSIC_TRACKS,type MusicScene} from '@/lib/music-scene';
export function useSceneMusic(scene:MusicScene,enabled:boolean){
 const control=useRef<{start:()=>void;sync:()=>void}|null>(null);
 const settings=useRef({scene,enabled});settings.current={scene,enabled};
 useEffect(()=>{
  const players=[new Audio(),new Audio()];for(const p of players){p.loop=true;p.preload='none';p.volume=0}
  let active=0,playing:MusicScene|null=null,pending:MusicScene|null=null,unlocked=false,token=0,disposed=false;
  let fade:ReturnType<typeof setInterval>|null=null;
  const clearFade=()=>{if(fade){clearInterval(fade);fade=null}};
  const stop=()=>{token++;pending=null;clearFade();for(const p of players)p.pause()};
  const update=()=>{
   const {scene:desired,enabled:on}=settings.current;
   if(disposed)return;if(!on||document.hidden){stop();return}if(!unlocked)return;
   if(pending===desired)return;
   if(pending){token++;pending=null;players[1-active].pause();clearFade();}
   const source=players[active];if(playing===desired){if(source.paused){source.volume=.28;void source.play().catch(()=>{})}return}
   token++;const request=token;clearFade();pending=desired;
   const incoming=players[1-active];incoming.pause();incoming.src=MUSIC_TRACKS[desired].src;incoming.volume=0;
   void incoming.play().then(()=>{
    if(disposed||request!==token)return;
    pending=null;playing=desired;active=1-active;const fromVolume=source.volume,start=performance.now();
    fade=setInterval(()=>{const amount=Math.min(1,(performance.now()-start)/650);source.volume=fromVolume*(1-amount);incoming.volume=.28*amount;if(amount===1){source.pause();clearFade()}},30);
   }).catch(()=>{if(request===token){pending=null;source.pause();playing=null}});
  };
  control.current={start:()=>{unlocked=true;update()},sync:update};
  const visibility=()=>update();document.addEventListener('visibilitychange',visibility);
  return()=>{disposed=true;stop();document.removeEventListener('visibilitychange',visibility);for(const p of players){p.removeAttribute('src');p.load()}control.current=null};
 },[]);
 useEffect(()=>control.current?.sync(),[scene,enabled]);
 return ()=>control.current?.start();
}
