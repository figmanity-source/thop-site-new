/** J-02. A light line runs down the seven steps. Rings mark steps 02–07 and fill as each step scrolls into view. */
export default function JourneyLine({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <ol className="journey-line">
      <span className="journey-track" aria-hidden="true" />
      <span className="journey-fill" aria-hidden="true" />
      {rows.map(([n, name, text], i) => (
        <li key={n}>
          <span className={i === 0 ? "mark dot" : "mark ring"} aria-hidden="true" />
          <div>
            <p className="journey-kicker">{n} {name}</p>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
