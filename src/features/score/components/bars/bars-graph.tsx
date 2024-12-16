import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getHistoricalPoints } from "src/utils/points/points-utils";

function BarsGraph() {
  const location = useLocation();

  const screenWidth = window.innerWidth;
  const [pointsData, setPointsData] = useState<number[]>([]);

  const getGraphData = () => {
    const historicalPoints = getHistoricalPoints();

    let payload = historicalPoints.map((item) => item.time ?? 1);

    payload = payload.length > 10 ? payload.slice(-10) : payload;

    payload =
      payload.length < 10
        ? payload.concat(Array(10 - payload.length).fill(1))
        : payload;

    setPointsData(payload);
  };

  const getAverage = () => {
    const historicalPoints = getHistoricalPoints();

    let payload = historicalPoints.map((item) => item.time ?? 1);

    return parseInt(
      `${payload.reduce((acc, item) => acc + item, 0) / payload.length}`
    );
  };

  useEffect(() => {
    getGraphData();
  }, []);

  console.log("pointsData", pointsData);

  return (
    <div className="char-container">
      <h3>VELOCIDAD</h3>
      <p>
        Hoy te tomo <span>{parseInt(location.state.time)} segundos</span>{" "}
        completar el juego, tu promedio es: <span>{getAverage()} segundos</span>
        .
      </p>
      <p>Progreso en los últimos 10 días:</p>
      <BarChart
        series={[
          {
            data: pointsData,
            color: "#5bc8af",
          },
        ]}
        width={screenWidth - 50}
        height={300}
        bottomAxis={null}
      />
    </div>
  );
}

export default BarsGraph;
