import { CHROMATIC_NOTES } from "@/lib/music-theory";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {

  if (audioContext === null) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

let masterGain: GainNode | null = null;

function getMasterGain(): GainNode {
  const ctx = getAudioContext();

  if (masterGain === null) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
  }

  return masterGain;
}

export function setMasterVolume(percent: number) {
  getMasterGain().gain.value = percent / 100;
}

let damping = 0.996;

export function setSustain(percent: number) {
  damping = 0.99 + (percent / 100) * 0.009;
}

const OPEN_STRING_FREQUENCIES: Record<number, number> = {
  6: 82.41,
  5: 110.0,
  4: 146.83,
  3: 196.0,
  2: 246.94,
  1: 329.63,
};

function getFrequency(stringNumber: number, fret: number): number {
  return OPEN_STRING_FREQUENCIES[stringNumber] * Math.pow(2, fret / 12);
}

function playFrequency(frequency: number) {
  const ctx = getAudioContext();

  const sampleRate = ctx.sampleRate;

  const durationSeconds = 6;
  const totalSamples = Math.floor(sampleRate * durationSeconds);

  const buffer = ctx.createBuffer(1, totalSamples, sampleRate);
  const data = buffer.getChannelData(0);

  const period = Math.floor(sampleRate / frequency);

  for (let i = 0; i < period; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  for (let i = period; i < totalSamples; i++) {
    data[i] = damping * 0.5 * (data[i - period] + data[i - period + 1]);
  }

  const fadeSamples = Math.floor(sampleRate * 0.3);
  for (let i = totalSamples - fadeSamples; i < totalSamples; i++) {
    data[i] *= (totalSamples - i) / fadeSamples;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.value = 0.4;

  source.connect(gain);
  gain.connect(getMasterGain());

  source.start();
}

export function playGuitarNote(stringNumber: number, fret: number) {
  playFrequency(getFrequency(stringNumber, fret));
}

export type FretPosition = {
  stringNumber: number;
  fret: number;
};

export function strumPositions(positions: FretPosition[], gapMs: number = 60) {
  positions.forEach((position, index) => {

    setTimeout(() => {
      playGuitarNote(position.stringNumber, position.fret);
    }, index * gapMs);
  });
}

function getNoteFrequency(noteIndex: number, octave: number): number {
  const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}

export function playChord(tones: string[], gapMs: number = 60) {

  let previousFrequency = 0;

  const frequencies = tones.map((tone) => {
    const noteIndex = CHROMATIC_NOTES.indexOf(tone);

    let frequency = getNoteFrequency(noteIndex, 3);

    while (frequency <= previousFrequency) {
      frequency = frequency * 2;
    }

    previousFrequency = frequency;
    return frequency;
  });

  frequencies.forEach((frequency, index) => {
    setTimeout(() => {
      playFrequency(frequency);
    }, index * gapMs);
  });
}
