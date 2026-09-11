"""Original 16-bar D-minor dungeon loop. Standard-library, no external samples."""
import math
import wave
from array import array
from pathlib import Path

RATE = 22050
BEAT = 60 / 88
BARS = 16
samples = [0.0] * round(RATE * BEAT * BARS * 4)


def note(midi, start, duration, volume, voice):
    hz = 440 * 2 ** ((midi - 69) / 12)
    first, length = round(start * RATE), round(duration * RATE)
    for i in range(min(length, len(samples) - first)):
        t = i / RATE
        attack = min(1, t / (0.08 if voice == 'pad' else 0.012))
        release = min(1, max(0, duration - t) / 0.09)
        phase = 2 * math.pi * hz * t
        if voice == 'pluck':
            wave_value = (math.sin(phase) + .25 * math.sin(3 * phase)) * math.exp(-t * 3)
        elif voice == 'bass':
            wave_value = math.sin(phase) + .15 * math.sin(2 * phase)
        else:
            wave_value = (math.sin(phase) + .35 * math.sin(phase * 1.002)) / 1.35
        samples[first + i] += wave_value * volume * attack * release


# D minor → Bb → F → C, a returning eight-bar phrase with a varied second pass.
chords = [(38, [62, 65, 69]), (34, [58, 62, 65]), (41, [60, 65, 69]), (36, [60, 64, 67])]
melodies = [[74, 0, 77, 76, 74, 0, 69, 0], [70, 0, 74, 0, 77, 74, 0, 0],
            [72, 0, 69, 72, 77, 0, 76, 0], [76, 0, 74, 72, 67, 0, 69, 0],
            [74, 77, 81, 0, 77, 76, 74, 0], [77, 0, 74, 70, 74, 0, 77, 0],
            [77, 76, 72, 0, 69, 72, 76, 0], [74, 72, 69, 0, 67, 69, 0, 0]]
for bar in range(BARS):
    root, chord = chords[(bar // 2) % 4]
    start = bar * 4 * BEAT
    for pitch in chord:
        note(pitch - 12, start, 3.95 * BEAT, .022, 'pad')
    for beat in [0, 2]:
        note(root, start + beat * BEAT, 1.7 * BEAT, .09, 'bass')
    for half in range(8):
        pitch = chord[[0, 1, 2, 1, 0, 2, 1, 2][half]]
        note(pitch, start + half * BEAT / 2, .42 * BEAT, .035, 'pluck')
    for half, pitch in enumerate(melodies[bar % 8]):
        if pitch:
            note(pitch, start + half * BEAT / 2, .7 * BEAT, .052 if bar < 8 else .07, 'pluck')

peak = max(abs(v) for v in samples)
assert 0.05 < peak < 0.95, peak
pcm = array('h', (round(v * 32767) for v in samples))
import sys
if sys.byteorder != 'little':
    pcm.byteswap()
out = Path(__file__).resolve().parents[1] / 'public/audio/embers-loop.wav'
with wave.open(str(out), 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(RATE)
    f.writeframes(pcm.tobytes())
print(f'Original loop: {len(samples)/RATE:.2f}s, peak={peak:.3f}, seamless silent boundaries, {out}')
assert abs(samples[0]) < .001 and abs(samples[-1]) < .001
