import { subjects } from "../config/subjects";

export function SubjectSelector({ selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {subjects.map((subject) => (
        <button
          key={subject.id}
          className={`subject-pill${selected?.id === subject.id ? " active" : ""}`}
          onClick={() => onSelect(subject)}
        >
          {subject.label}
        </button>
      ))}
    </div>
  );
}
