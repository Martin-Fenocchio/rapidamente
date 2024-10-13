import { getDaysInCurrentMonth } from "src/utils/date-utils";

interface Props {
  weeks: (string | null)[][];
}

export function HistoryGrid({ weeks }: Props) {
  const handleGetWeekPrefix = (week: (string | null)[], i: number) => {
    const firstDay = i * 7 + 1;
    const lastDay = Math.min((i + 1) * 7, getDaysInCurrentMonth());
    return week.some((day) => day)
      ? `${String(firstDay).padStart(2, "0")}-${String(lastDay).padStart(
          2,
          "0"
        )}`
      : "";
  };

  return (
    <div className="grid">
      <div className="days">
        <span></span>
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
          <p className="week">{handleGetWeekPrefix(week, i)}</p>
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
