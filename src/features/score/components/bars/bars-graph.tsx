import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import {
  getHistoricalPoints,
  getScoreOfToday,
} from "src/utils/points/points-utils";

function BarsGraph() {
  const screenWidth = window.innerWidth;

  const [pointsData, setPointsData] = useState<number[]>([]);
  const [todayVelocity, setTodayVelocity] = useState("0");

  const getGraphData = () => {
    const historicalPoints = getHistoricalPoints();

    let payload = historicalPoints
      .filter((i) => i.time != null)
      .map((item) => (item?.time ?? 1) / item.pointsOfDay);

    payload = payload.length > 10 ? payload.slice(-10) : payload;

    payload =
      payload.length < 10
        ? payload.concat(Array(10 - payload.length).fill(1))
        : payload;

    setPointsData(payload);
  };

  const getAverage = () => {
    const historicalPoints = getHistoricalPoints();

    let payload = historicalPoints
      .filter((i) => i.time != null)
      .map((item) => (item?.time ?? 1) / (item.pointsOfDay ?? 1));

    const average = (
      payload.reduce((acc, item) => acc + item, 0) / (payload?.length ?? 1)
    ).toFixed(1);

    return average;
  };

  const handleSetInitialData = () => {
    getGraphData();

    const todayScore = getScoreOfToday();

    if (!todayScore) return;

    setTodayVelocity(
      (Number(todayScore?.time ?? 0) / (todayScore?.pointsOfDay ?? 0)).toFixed(
        1
      )
    );
  };

  useEffect(() => {
    handleSetInitialData();
  }, []);

  const average = getAverage();

  if (todayVelocity == "Infinity" || average == "NaN") return <></>;

  return (
    <div className="char-container">
      <h3>VELOCIDAD</h3>
      <p>
        Hoy tu velocidad fue de <span>{todayVelocity} segundos por cuenta</span>
        , tu promedio es: <span>{average} segundos</span>.
      </p>
      <p>Tu velocidad en los últimos 10 días:</p>
      <BarChart
        series={[
          {
            data: pointsData,
            color: "#5bc8af",
          },
        ]}
        width={Math.min(screenWidth, 720) - 50}
        height={300}
        bottomAxis={null}
      />
    </div>
  );
}

export default BarsGraph;
