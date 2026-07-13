"use client";

import { useState } from "react";
import {
  GUITAR_STRINGS,
  CHROMATIC_NOTES,
  getNoteAtFret,
  getChordShape,
  type ChordQuality,
  type ChordVoicing,
} from "@/lib/music-theory";
import {
  playGuitarNote,
  strumPositions,
  setMasterVolume,
  setSustain,
} from "@/lib/audio";

type Props = {
  rootNote: string;
  patternLabel: string;
  scaleNotes: string[];
};

export default function Fretboard({ rootNote, patternLabel, scaleNotes }: Props) {

  const frets = Array.from({ length: 12 }, (_, index) => index + 1);

  const [selections, setSelections] = useState<Record<number, number>>({});

  const selectedCount = Object.keys(selections).length;

  const [volume, setVolume] = useState(70);

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {

    const nextVolume = Number(event.target.value);

    setVolume(nextVolume);
    setMasterVolume(nextVolume);
  }

  const [strumGap, setStrumGap] = useState(60);

  const [sustain, setSustainValue] = useState(67);

  function handleSustainChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextSustain = Number(event.target.value);

    setSustainValue(nextSustain);
    setSustain(nextSustain);
  }

  const [chordRoot, setChordRoot] = useState("C");
  const [chordQuality, setChordQuality] = useState<ChordQuality>("");
  const [chordVoicing, setChordVoicing] = useState<ChordVoicing>("open");
  const [finderNotice, setFinderNotice] = useState("");

  function toTriadQuality(quality: ChordQuality): ChordQuality {
    return quality === "m" || quality === "m7" ? "m" : "";
  }

  function toPositions(shape: Record<number, number>) {

    return GUITAR_STRINGS.filter(

      (guitarString) => shape[guitarString.number] !== undefined
    ).map((guitarString) => ({
      stringNumber: guitarString.number,
      fret: shape[guitarString.number],
    }));
  }

  function applyChordShape(
    root: string,
    quality: ChordQuality,
    voicing: ChordVoicing
  ) {
    const shape = getChordShape(root, quality, voicing);

    if (shape === null) {
      setFinderNotice(
        "No common shape for this combo within 12 frets — try another voicing."
      );
      return;
    }

    setFinderNotice("");
    setSelections(shape);
  }

  function toggleSelection(stringNumber: number, fret: number) {

    playGuitarNote(stringNumber, fret);

    setSelections((prev) => {

      const next = { ...prev };

      if (next[stringNumber] === fret) {

        delete next[stringNumber];
      } else {

        next[stringNumber] = fret;
      }

      return next;
    });
  }

  function handleStrum() {
    strumPositions(toPositions(selections), strumGap);
  }

  return (
    <section className="fretboardCard">
      <div className="fretboardHeader">
        <div>
          <p className="eyebrow">FRETBOARD</p>
          <h2>
            {rootNote} {patternLabel} on Guitar
          </h2>
        </div>

        <div className="fretboardActions">
          <p className="fretboardHint">
            Click notes to select them, then strum. Root note is highlighted.
          </p>

          <div className="fretboardButtons">
            <div className="volumeControl">
              <span className="volumeLabel">VOL</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
              />
              <span className="volumeValue">{volume}</span>
            </div>

            <div className="volumeControl">
              <span className="volumeLabel">STRUM</span>
              <input
                type="range"
                min={0}
                max={150}
                step={1}
                value={strumGap}
                onChange={(event) => setStrumGap(Number(event.target.value))}
                aria-label="Strum speed"
              />
              <span className="volumeValue">{strumGap}ms</span>
            </div>

            <div className="volumeControl">
              <span className="volumeLabel">SUSTAIN</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={sustain}
                onChange={handleSustainChange}
                aria-label="Sustain"
              />
              <span className="volumeValue">{sustain}</span>
            </div>

            <button
              type="button"
              className="strumButton"
              onClick={handleStrum}
              disabled={selectedCount === 0}
            >
              Strum{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </button>

            <button
              type="button"
              className="clearButton"
              onClick={() => setSelections({})}
              disabled={selectedCount === 0}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="chordFinder">
        <span className="finderLabel">CHORD FINDER</span>

        <select
          value={chordRoot}
          aria-label="Chord root"
          onChange={(event) => {
            const nextRoot = event.target.value;
            setChordRoot(nextRoot);
            applyChordShape(nextRoot, chordQuality, chordVoicing);
          }}
        >
          {CHROMATIC_NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>

        <select
          value={chordQuality}
          aria-label="Chord quality"
          onChange={(event) => {
            const nextQuality = event.target.value as ChordQuality;
            setChordQuality(nextQuality);
            applyChordShape(chordRoot, nextQuality, chordVoicing);
          }}
        >
          <option value="">Major</option>
          <option value="m">minor</option>

          {chordVoicing !== "triad" && (
            <>
              <option value="7">7</option>
              <option value="maj7">maj7</option>
              <option value="m7">m7</option>
            </>
          )}
        </select>

        <select
          value={chordVoicing}
          aria-label="Chord voicing"
          onChange={(event) => {
            const nextVoicing = event.target.value as ChordVoicing;

            const nextQuality =
              nextVoicing === "triad"
                ? toTriadQuality(chordQuality)
                : chordQuality;

            setChordVoicing(nextVoicing);
            setChordQuality(nextQuality);
            applyChordShape(chordRoot, nextQuality, nextVoicing);
          }}
        >
          <option value="open">Open</option>
          <option value="barreE">Barre · Root on 6th</option>
          <option value="barreA">Barre · Root on 5th</option>
          <option value="triad">Triad · Strings 1–3</option>
        </select>

        {finderNotice && <span className="finderNotice">{finderNotice}</span>}
      </div>

      <div className="fretboardScroll">
        <div className="fretboard">
          <div className="fretNumberRow">
            <div className="stringLabelSpacer" />

            {frets.map((fret) => (
              <div className="fretNumber" key={fret}>
                {fret}
              </div>
            ))}
          </div>

          {[...GUITAR_STRINGS].reverse().map((guitarString) => {

            const selectedFret = selections[guitarString.number];

            return (
              <div className="stringRow" key={guitarString.number}>
                <div className="stringLabel">
                  <span>
                    {guitarString.number} · {guitarString.name}
                  </span>

                  <button
                    type="button"
                    className={`openNoteMarker ${
                      scaleNotes.includes(guitarString.openNote) ? "inScale" : ""
                    } ${guitarString.openNote === rootNote ? "root" : ""} ${
                      selectedFret === 0 ? "selected" : ""
                    }`}
                    onClick={() => toggleSelection(guitarString.number, 0)}
                  >
                    {guitarString.openNote}
                  </button>
                </div>

                {frets.map((fret) => {
                  const note = getNoteAtFret(guitarString.openNote, fret);

                  const isScaleNote = scaleNotes.includes(note);
                  const isRootNote = note === rootNote;
                  const isSelected = selectedFret === fret;

                  return (
                    <div className="fretCell" key={fret}>
                      <button
                        type="button"
                        className={`noteMarker ${isScaleNote ? "inScale" : ""} ${
                          isRootNote ? "root" : ""
                        } ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleSelection(guitarString.number, fret)}
                      >
                        {note}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
