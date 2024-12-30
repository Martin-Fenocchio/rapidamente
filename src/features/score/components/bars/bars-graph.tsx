import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getHistoricalPoints,
  getScoreOfToday,
} from "src/utils/points/points-utils";

function BarsGraph() {
  const location = useLocation();
  const screenWidth = window.innerWidth;

  const [pointsData, setPointsData] = useState<number[]>([]);
  const [todayPoints, setTodayPoints] = useState(0);

  const getGraphData = () => {
    const historicalPoints = getHistoricalPoints();

    let payload = historicalPoints.map(
      (item) => (item.time ?? 1) / item.pointsOfDay
    );

    payload = payload.length > 10 ? payload.slice(-10) : payload;

    payload =
      payload.length < 10
        ? payload.concat(Array(10 - payload.length).fill(1))
        : payload;

    setPointsData(payload);
  };

  const getAverage = () => {
    const historicalPoints = getHistoricalPoints();

    let payload = historicalPoints.map(
      (item) => (item.time ?? 1) / item.pointsOfDay
    );

    return (
      payload.reduce((acc, item) => acc + item, 0) / payload.length
    ).toFixed(1);
  };

  useEffect(() => {
    getGraphData();
    setTodayPoints(
      location.state?.points ?? getScoreOfToday()?.pointsOfDay ?? 0
    );
  }, []);

  return (
    <div className="char-container">
      <h3>VELOCIDAD</h3>
      <p>
        Hoy tu velocidad fue de{" "}
        <span>
          {(Number(location.state.time ?? 0) / todayPoints).toFixed(1)} segundos
          por cuenta
        </span>
        , tu promedio es: <span>{getAverage()} segundos</span>.
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
