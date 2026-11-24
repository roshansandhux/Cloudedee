#!/usr/bin/env python3
"""Find the beats in an audio file so cuts/animations can land on them.

Usage:  python3 scripts/beats.py <audio file> [--fps 30] [--out beats.json]
Prints tempo + beat times; writes JSON {tempo, beats:[{t, frame}], onsets:[...]}.
Needs:  pip3 install librosa soundfile
"""
import argparse, json, sys

import librosa
import numpy as np


def main():
    p = argparse.ArgumentParser()
    p.add_argument("audio")
    p.add_argument("--fps", type=float, default=30)
    p.add_argument("--out")
    a = p.parse_args()

    y, sr = librosa.load(a.audio, sr=None, mono=True)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beats = librosa.frames_to_time(beat_frames, sr=sr)
    onsets = librosa.onset.onset_detect(y=y, sr=sr, units="time")
    tempo = float(np.atleast_1d(tempo)[0])

    data = {
        "file": a.audio,
        "duration": round(len(y) / sr, 3),
        "tempo": round(tempo, 2),
        "fps": a.fps,
        "beats": [{"t": round(float(t), 3), "frame": int(round(t * a.fps))} for t in beats],
        "onsets": [{"t": round(float(t), 3), "frame": int(round(t * a.fps))} for t in onsets],
    }
    print(f"{a.audio}: {data['duration']}s, ~{data['tempo']} BPM, "
          f"{len(data['beats'])} beats, {len(data['onsets'])} onsets", file=sys.stderr)
    text = json.dumps(data, indent=1)
    if a.out:
        with open(a.out, "w") as f:
            f.write(text)
    else:
        print(text)


if __name__ == "__main__":
    main()
