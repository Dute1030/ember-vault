"""Four original scene loops, synthesized with the Python standard library."""
import math
import random
import sys
import wave
from array import array
from pathlib import Path
RATE=22050
OUT=Path(__file__).resolve().parents[1]/'public/audio'

def render(scene,bpm,chords,melody):
    beat=60/bpm
    samples=[0.0]*round(RATE*beat*32)
    noise=random.Random(42)
    def note(pitch,start,duration,volume,voice='pluck'):
        first=round(start*RATE);count=round(duration*RATE);hz=440*2**((pitch-69)/12)
        for i in range(min(count,len(samples)-first)):
            t=i/RATE;phase=2*math.pi*hz*t
            envelope=min(1,t/.012)*min(1,max(0,duration-t)/.04)
            if voice=='kick':v=math.sin(2*math.pi*(55*t+4*(1-math.exp(-t*22))))*math.exp(-t*14)
            elif voice=='hat':v=(noise.random()*2-1)*math.exp(-t*45)
            elif voice=='bass':v=(math.sin(phase)+.2*math.sin(phase*2))*math.exp(-t*1.5)
            elif voice=='pad':v=math.sin(phase)*min(1,t/.15)
            else:v=(math.sin(phase)+.2*math.sin(phase*3))*math.exp(-t*(5 if scene=='shop' else 3))
            samples[first+i]+=volume*v*envelope
    for bar in range(8):
        root,chord=chords[bar%len(chords)];start=bar*4*beat
        if scene=='rest':
            for pitch in chord:note(pitch,start,3.95*beat,.035,'pad')
            note(root,start,3.5*beat,.065,'bass')
            for j,pitch in enumerate(melody[bar%len(melody)]):
                if pitch:note(pitch,start+j*beat,1.6*beat,.065)
        else:
            for j in range(8):
                note(chord[[0,1,2,1,0,2,1,2][j]],start+j*beat/2,.43*beat,.035)
                if scene in ['battle','boss']:
                    note(root+(12 if j%4==3 else 0),start+j*beat/2,.38*beat,.075,'bass')
                    note(60,start+j*beat/2,.09,.017,'hat')
            if scene=='shop':
                for j in [0,2]:note(root,start+j*beat,1.3*beat,.075,'bass')
            else:
                for j in ([0,1.5,2,3] if scene=='boss' else [0,2]):note(40,start+j*beat,.2,.12,'kick')
            for j,pitch in enumerate(melody[bar%len(melody)]):
                if pitch:note(pitch,start+j*beat/2,.65*beat,.07)
    for i in range(round(.025*RATE)):
        samples[-1-i]*=i/round(.025*RATE)
    peak=max(abs(v) for v in samples);assert 0<peak<1
    assert abs(samples[0])<.001 and abs(samples[-1])<.001
    pcm=array('h',(round(v*32767) for v in samples))
    if sys.byteorder!='little':pcm.byteswap()
    path=OUT/(scene+'-loop.wav')
    with wave.open(str(path),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(pcm.tobytes())
    print(f'{scene}: {len(samples)/RATE:.2f}s, {bpm} BPM, peak={peak:.3f}')

render('battle',112,[(38,[62,65,69]),(34,[58,62,65]),(36,[60,64,67]),(33,[57,61,64])],[[74,0,74,77,76,74,69,72],[70,74,0,77,74,70,69,0],[72,76,79,0,76,72,74,0],[73,76,0,73,69,0,72,73]])
render('boss',132,[(38,[62,65,68]),(37,[61,64,67]),(34,[58,62,65]),(33,[57,61,64])],[[74,75,74,0,81,80,77,75],[73,76,79,76,73,0,72,73],[77,74,70,0,82,81,77,74],[73,76,81,0,80,76,73,69]])
render('shop',96,[(41,[65,69,72]),(38,[62,65,69]),(43,[67,70,74]),(36,[64,67,72])],[[77,0,81,79,77,0,72,0],[74,77,0,81,77,74,0,0],[79,0,82,81,79,77,74,0],[76,79,0,84,79,76,77,0]])
render('rest',68,[(38,[62,65,69]),(34,[58,62,65]),(41,[60,65,69]),(36,[60,64,67])],[[74,0,77,0],[74,70,0,0],[72,0,69,0],[67,69,0,0]])
