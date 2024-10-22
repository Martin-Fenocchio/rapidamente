interface Props {
  weeks: (string | null)[][];
}

export function HistoryGrid({ weeks }: Props) {
  return (
    <div className="grid">
      <div className="days">
        <span>L</span>
        <span>M</span>
        <span>M</span>
        <span>J</span>
        <span>V</span>
        <span>S</span>
        <span>D</span>
      </div>
      {weeks.map((week, i) => (
        <div className="row" key={i}>
          {week.map((day, j) => (
            <div key={j} className="day">
              {day ? <HistoryGridPoint key={j} type={day} /> : <div />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function HistoryGridPoint({ type }: { type: string }) {
  return <div className="point" data-type={type}></div>;
}
