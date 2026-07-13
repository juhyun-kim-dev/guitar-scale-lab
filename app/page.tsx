"use client";

import { useState } from "react";

import {
  type ScaleType,
  SCALE_PATTERNS,
  getScaleNotes,
  getDiatonicChords,
} from "@/lib/music-theory";

import ChromaticStrip from "@/components/ChromaticStrip";
import ScaleControls from "@/components/ScaleControls";
import NoteList from "@/components/NoteList";
import DiatonicChords from "@/components/DiatonicChords";
import Fretboard from "@/components/Fretboard";

export default function Home() {

  const [rootNote, setRootNote] = useState("C");
  const [scaleType, setScaleType] = useState<ScaleType>("major");

  const [useSevenths, setUseSevenths] = useState(false);

  const scaleNotes = getScaleNotes(rootNote, scaleType);
  const selectedPattern = SCALE_PATTERNS[scaleType];

  const diatonicChords = getDiatonicChords(scaleNotes, scaleType, useSevenths);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">GUITAR THEORY TOOL</p>

        <h1>Guitar Scale Lab</h1>

        <p className="description">
          Pick a key and a scale to explore every note on the fretboard.
        </p>
      </section>

      <ChromaticStrip
        rootNote={rootNote}
        scaleNotes={scaleNotes}
        onSelectNote={setRootNote}
      />

      <ScaleControls
        rootNote={rootNote}
        scaleType={scaleType}
        onRootNoteChange={setRootNote}
        onScaleTypeChange={setScaleType}
      />

      <NoteList
        rootNote={rootNote}
        patternLabel={selectedPattern.label}
        scaleNotes={scaleNotes}
        degrees={selectedPattern.degrees}
      />

      <DiatonicChords
        rootNote={rootNote}
        patternLabel={selectedPattern.label}
        chords={diatonicChords}
        useSevenths={useSevenths}
        onSeventhsChange={setUseSevenths}
      />

      <Fretboard
        rootNote={rootNote}
        patternLabel={selectedPattern.label}
        scaleNotes={scaleNotes}
      />
    </main>
  );
}
