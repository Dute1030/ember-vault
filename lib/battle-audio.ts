import type {CombatFeedback} from './combat-feedback';
export type SoundKind='swing'|'cast'|'hit'|'hurt'|'block'|'poison'|'heal';
export type SoundCue={kind:SoundKind;delay:number};
export function soundCues(feedback:CombatFeedback):SoundCue[]{
  const cues:SoundCue[]=feedback.attackers.map(a=>({kind:a.target===-1&&feedback.impacts.some(i=>i.kind==='magic'||i.kind==='poison')?'cast':'swing',delay:a.delay}));
  for(const i of feedback.impacts)cues.push({kind:i.kind==='guard'?'block':i.kind==='heal'?'heal':i.kind==='poison'?'poison':i.target===-1?'hurt':'hit',delay:i.delay});
  return cues.filter((c,i)=>cues.findIndex(x=>x.kind===c.kind&&x.delay===c.delay)===i);
}
const tones:Record<SoundKind,[number,number,number,OscillatorType]>={swing:[700,110,.12,'sawtooth'],cast:[220,880,.2,'triangle'],hit:[180,45,.14,'square'],hurt:[105,28,.22,'sawtooth'],block:[1300,420,.15,'triangle'],poison:[340,100,.18,'sine'],heal:[440,880,.28,'sine']};
export class BattleAudio{
  private context:AudioContext|null=null;
  private master:GainNode|null=null;
  private enabled=true;
  private voices=new Set<AudioScheduledSourceNode>();
  setEnabled(enabled:boolean){this.enabled=enabled;if(this.master&&this.context)this.master.gain.setValueAtTime(enabled?.22:0,this.context.currentTime);if(!enabled)this.stop()}
  unlock(){if(!this.enabled)return;try{if(!this.context){this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=.22;this.master.connect(this.context.destination)}void this.context.resume().catch(()=>{})}catch{/* Unsupported browsers can still play silently. */}}
  play(feedback:CombatFeedback){if(!this.enabled)return;this.unlock();const ctx=this.context,master=this.master;if(!ctx||!master)return;for(const cue of soundCues(feedback)){
    const [from,to,duration,wave]=tones[cue.kind],time=ctx.currentTime+cue.delay/1000;
    const gain=ctx.createGain();gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(.28,time+.006);gain.gain.exponentialRampToValueAtTime(.001,time+duration);gain.connect(master);
    const osc=ctx.createOscillator();osc.type=wave;osc.frequency.setValueAtTime(from,time);osc.frequency.exponentialRampToValueAtTime(to,time+duration);osc.connect(gain);this.track(osc,()=>gain.disconnect());osc.start(time);osc.stop(time+duration+.02);
    if(['swing','hit','hurt','block'].includes(cue.kind)){
      const noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.09),ctx.sampleRate),data=noise.getChannelData(0);let seed=17;
      for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)|0;data[i]=((seed>>>0)/2147483648-1)*(1-i/data.length)}
      const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),volume=ctx.createGain();source.buffer=noise;filter.type='lowpass';filter.frequency.value=cue.kind==='block'?3500:cue.kind==='swing'?2400:900;volume.gain.value=.12;source.connect(filter);filter.connect(volume);volume.connect(master);this.track(source,()=>{filter.disconnect();volume.disconnect()});source.start(time);source.stop(time+.1);
    }
  }}
  private track(source:AudioScheduledSourceNode,cleanup:()=>void){this.voices.add(source);source.onended=()=>{this.voices.delete(source);source.disconnect();cleanup()}}
  stop(){for(const voice of this.voices){try{voice.stop()}catch{}}this.voices.clear()}
  dispose(){this.stop();void this.context?.close().catch(()=>{});this.context=null;this.master=null}
}
