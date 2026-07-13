import { CHROMATIC_NOTES, type ScaleType } from "@/lib/music-theory";

type Props = {
  rootNote: string;
  scaleType: ScaleType;

  onRootNoteChange: (note: string) => void;
  onScaleTypeChange: (scaleType: ScaleType) => void;
};

export default function ScaleControls({
  rootNote,
  scaleType,
  onRootNoteChange,
  onScaleTypeChange,
}: Props) {
  return (
    <section className="controlCard">
      <div className="controlGroup">
        <label htmlFor="root-note">Key</label>

        <select
          id="root-note"
          value={rootNote}
          onChange={(event) => onRootNoteChange(event.target.value)}
        >
          {CHROMATIC_NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </div>

      <div className="controlGroup">
        <span className="labelText">Scale Type</span>

        <div className="buttonGroup">
          <button
            type="button"
            className={scaleType === "major" ? "active" : ""}
            onClick={() => onScaleTypeChange("major")}
          >
            Major
          </button>

          <button
            type="button"
            className={scaleType === "minor" ? "active" : ""}
            onClick={() => onScaleTypeChange("minor")}
          >
            Natural Minor
          </button>
        </div>
      </div>
    </section>
  );
}
