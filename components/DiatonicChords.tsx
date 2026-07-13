"use client";

import { type DiatonicChord } from "@/lib/music-theory";
import { playChord } from "@/lib/audio";

type Props = {
  rootNote: string;
  patternLabel: string;
  chords: DiatonicChord[];

  useSevenths: boolean;
  onSeventhsChange: (useSevenths: boolean) => void;
};

export default function DiatonicChords({
  rootNote,
  patternLabel,
  chords,
  useSevenths,
  onSeventhsChange,
}: Props) {
  return (
    <section className="chordCard">
      <div className="resultHeader">
        <div>
          <p className="eyebrow">DIATONIC CHORDS</p>

          <h2>Chords in {rootNote} {patternLabel}</h2>
        </div>

        <div className="buttonGroup small">
          <button
            type="button"
            className={!useSevenths ? "active" : ""}
            onClick={() => onSeventhsChange(false)}
          >
            Triads
          </button>

          <button
            type="button"
            className={useSevenths ? "active" : ""}
            onClick={() => onSeventhsChange(true)}
          >
            7th
          </button>
        </div>
      </div>

      <div className="chordList">

        {chords.map((chord, index) => (
          <button
            type="button"
            className={`chordItem ${index === 0 ? "tonicChord" : ""}`}
            key={chord.name}
            onClick={() => playChord(chord.tones)}
          >
            <div className="chordItemTop">
              <span className="chordRoman">{chord.roman}</span>
              <span className="chordQuality">{chord.quality}</span>
            </div>

            <strong className="chordName">{chord.name}</strong>

            <span className="chordTones">{chord.tones.join(" · ")}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
