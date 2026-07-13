export const CHROMATIC_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const FLAT_NAMES: Record<string, string> = {
  "C#": "D♭",
  "D#": "E♭",
  "F#": "G♭",
  "G#": "A♭",
  "A#": "B♭",
};

export const GUITAR_STRINGS = [
  { number: 6, name: "Low E", openNote: "E" },
  { number: 5, name: "A", openNote: "A" },
  { number: 4, name: "D", openNote: "D" },
  { number: 3, name: "G", openNote: "G" },
  { number: 2, name: "B", openNote: "B" },
  { number: 1, name: "High E", openNote: "E" },
];

export type ScaleType = "major" | "minor";

export const SCALE_PATTERNS = {
  major: {
    label: "Major",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    degrees: ["1", "2", "3", "4", "5", "6", "7"],
  },

  minor: {
    label: "Natural Minor",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    degrees: ["1", "2", "♭3", "4", "5", "♭6", "♭7"],
  },
};

export function getScaleNotes(rootNote: string, scaleType: ScaleType) {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);

  const selectedPattern = SCALE_PATTERNS[scaleType];

  return selectedPattern.intervals.map((interval) => {
    const noteIndex = (rootIndex + interval) % CHROMATIC_NOTES.length;

    return CHROMATIC_NOTES[noteIndex];
  });
}

export function getNoteAtFret(openNote: string, fret: number) {
  const openNoteIndex = CHROMATIC_NOTES.indexOf(openNote);

  const noteIndex = (openNoteIndex + fret) % CHROMATIC_NOTES.length;

  return CHROMATIC_NOTES[noteIndex];
}

const CHORD_QUALITIES: Record<ScaleType, string[]> = {
  major: ["", "m", "m", "", "", "m", "dim"],
  minor: ["m", "dim", "", "m", "m", "", ""],
};

const SEVENTH_QUALITIES: Record<ScaleType, string[]> = {
  major: ["maj7", "m7", "m7", "maj7", "7", "m7", "m7♭5"],
  minor: ["m7", "m7♭5", "maj7", "m7", "m7", "maj7", "7"],
};

const ROMAN_NUMERALS: Record<ScaleType, string[]> = {
  major: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
  minor: ["i", "ii°", "♭III", "iv", "v", "♭VI", "♭VII"],
};

const QUALITY_LABELS: Record<string, string> = {
  "": "Major",
  m: "Minor",
  dim: "Dim",
  maj7: "Major 7",
  m7: "Minor 7",
  "7": "Dom 7",
  "m7♭5": "Half-dim",
};

export type DiatonicChord = {
  name: string;
  roman: string;
  quality: string;
  tones: string[];
};

export function getDiatonicChords(
  scaleNotes: string[],
  scaleType: ScaleType,
  useSevenths: boolean = false
): DiatonicChord[] {
  return scaleNotes.map((note, i) => {
    const suffix = useSevenths
      ? SEVENTH_QUALITIES[scaleType][i]
      : CHORD_QUALITIES[scaleType][i];

    const tones = [
      scaleNotes[i],
      scaleNotes[(i + 2) % 7],
      scaleNotes[(i + 4) % 7],
    ];

    if (useSevenths) {
      tones.push(scaleNotes[(i + 6) % 7]);
    }

    return {
      name: note + suffix,
      roman: ROMAN_NUMERALS[scaleType][i],
      quality: QUALITY_LABELS[suffix],
      tones,
    };
  });
}

export type ChordQuality = "" | "m" | "7" | "maj7" | "m7";
export type ChordVoicing = "open" | "barreE" | "barreA" | "triad";

type ShapeArray = (number | null)[];

const OPEN_CHORD_SHAPES: Record<string, ShapeArray> = {

  C: [null, 3, 2, 0, 1, 0],
  A: [null, 0, 2, 2, 2, 0],
  G: [3, 2, 0, 0, 0, 3],
  E: [0, 2, 2, 1, 0, 0],
  D: [null, null, 0, 2, 3, 2],

  Am: [null, 0, 2, 2, 1, 0],
  Em: [0, 2, 2, 0, 0, 0],
  Dm: [null, null, 0, 2, 3, 1],
  Cm: [null, null, 5, 5, 4, 3],

  C7: [null, 3, 2, 3, 1, 0],
  A7: [null, 0, 2, 0, 2, 0],
  G7: [3, 2, 0, 0, 0, 1],
  E7: [0, 2, 0, 1, 0, 0],
  D7: [null, null, 0, 2, 1, 2],
  B7: [null, 2, 1, 2, 0, 2],

  Cmaj7: [null, 3, 2, 0, 0, 0],
  Amaj7: [null, 0, 2, 1, 2, 0],
  Gmaj7: [3, 2, 0, 0, 0, 2],
  Emaj7: [0, 2, 1, 1, 0, 0],
  Dmaj7: [null, null, 0, 2, 2, 2],
  Fmaj7: [null, null, 3, 2, 1, 0],

  Am7: [null, 0, 2, 0, 1, 0],
  Em7: [0, 2, 0, 0, 0, 0],
  Dm7: [null, null, 0, 2, 1, 1],
  Cm7: [null, null, 1, 3, 1, 3],
};

const E_SHAPE_OFFSETS: Record<ChordQuality, ShapeArray> = {
  "": [0, 2, 2, 1, 0, 0],
  m: [0, 2, 2, 0, 0, 0],
  "7": [0, 2, 0, 1, 0, 0],
  maj7: [0, 2, 1, 1, 0, 0],
  m7: [0, 2, 0, 0, 0, 0],
};

const A_SHAPE_OFFSETS: Record<ChordQuality, ShapeArray> = {
  "": [null, 0, 2, 2, 2, 0],
  m: [null, 0, 2, 2, 1, 0],
  "7": [null, 0, 2, 0, 2, 0],
  maj7: [null, 0, 2, 1, 2, 0],
  m7: [null, 0, 2, 0, 1, 0],
};

function shapeArrayToRecord(shape: ShapeArray): Record<number, number> {
  const record: Record<number, number> = {};

  shape.forEach((fret, index) => {
    if (fret !== null) {
      record[6 - index] = fret;
    }
  });

  return record;
}

export function getChordShape(
  rootNote: string,
  quality: ChordQuality,
  voicing: ChordVoicing
): Record<number, number> | null {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote);

  if (voicing === "open") {
    const shape = OPEN_CHORD_SHAPES[rootNote + quality];
    return shape ? shapeArrayToRecord(shape) : null;
  }

  if (voicing === "barreE" || voicing === "barreA") {

    const openIndex = voicing === "barreE" ? 4 : 9;
    const rootFret = (rootIndex - openIndex + 12) % 12;

    const offsets =
      voicing === "barreE" ? E_SHAPE_OFFSETS[quality] : A_SHAPE_OFFSETS[quality];

    const frets = offsets.map((offset) =>
      offset === null ? null : offset + rootFret
    );

    if (frets.some((fret) => fret !== null && fret > 12)) {
      return null;
    }

    return shapeArrayToRecord(frets);
  }

  let rootFret = (rootIndex - 7 + 12) % 12;

  if (rootFret - 2 < 0) {
    rootFret += 12;
  }

  const isMinorThird = quality === "m" || quality === "m7";

  const frets: ShapeArray = [
    null,
    null,
    null,
    rootFret,
    isMinorThird ? rootFret - 1 : rootFret,
    rootFret - 2,
  ];

  if (frets.some((fret) => fret !== null && fret > 12)) {
    return null;
  }

  return shapeArrayToRecord(frets);
}
