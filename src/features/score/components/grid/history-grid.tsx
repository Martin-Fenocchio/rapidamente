export function HistoryGrid() {
  const data = [
    ["inactive", "inactive", "points", "points", "record", "no", "points"],
    ["points", "no", "points", "record", "no", "points", "points"],
    ["no", "points", "points", "points", "points", "points", "points"],
    ["record", "no", "points", "no", "points", "points", "record"]
  ];

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
      {data.map((row, i) => (
        <div className="row" key={i}>
          <p className="week">1-7</p>
          {row.map((type, j) => (
            <HistoryGridPoint key={j} type={type} />
          ))}
        </div>
      ))}
    </div>
  );
}

function HistoryGridPoint({ type }: { type: string }) {
  return <div className="point" data-type={type}></div>;
}
