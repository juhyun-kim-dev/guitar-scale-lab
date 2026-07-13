type Props = {
  rootNote: string;
  patternLabel: string;
  scaleNotes: string[];
  degrees: string[];
};

export default function NoteList({
  rootNote,
  patternLabel,
  scaleNotes,
  degrees,
}: Props) {
  return (
    <section className="resultCard">
      <div className="resultHeader">
        <div>
          <p className="eyebrow">CURRENT SCALE</p>

          <h2>
            {rootNote} {patternLabel}
          </h2>
        </div>

        <span className="scaleBadge">{scaleNotes.length} Notes</span>
      </div>

      <div className="noteList">
        {scaleNotes.map((note, index) => (
          <div
            className={`noteItem ${index === 0 ? "rootNote" : ""}`}
            key={`${note}-${index}`}
          >
            <span className="degree">{degrees[index]}</span>

            <strong>{note}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
