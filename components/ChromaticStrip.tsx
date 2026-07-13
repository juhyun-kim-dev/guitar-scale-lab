import { CHROMATIC_NOTES, FLAT_NAMES } from "@/lib/music-theory";

type Props = {
  rootNote: string;
  scaleNotes: string[];

  onSelectNote: (note: string) => void;
};

export default function ChromaticStrip({
  rootNote,
  scaleNotes,
  onSelectNote,
}: Props) {
  return (
    <section className="chromaticStrip" aria-label="12 chromatic notes">
      {CHROMATIC_NOTES.map((note) => {
        const isRoot = note === rootNote;
        const isInScale = scaleNotes.includes(note);
        const flatName = FLAT_NAMES[note];

        return (
          <button
            type="button"
            key={note}
            className={`chromaticNote ${isInScale ? "inScale" : ""} ${
              isRoot ? "root" : ""
            }`}
            onClick={() => onSelectNote(note)}
          >
            <span>{note}</span>
            {flatName && <span className="flatName">{flatName}</span>}
          </button>
        );
      })}
    </section>
  );
}
