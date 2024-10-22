import { PointsOfDay } from "src/features/game/models/games-model";
import { calculateWeeks, getNameOfCurrentMonth } from "../date-utils";

export const savePointsOfDay = (points: number) => {
  const date = new Date().toLocaleString().split(",")[0];

  const pointsOfDay = {
    date,
    pointsOfDay: points
  };

  const historical = getHistoricalPoints();

  const allPoints = [...historical, pointsOfDay];

  const dates: string[] = [];

  const payload = allPoints.filter((item) => {
    if (dates.includes(item.date)) {
      return false;
    } else {
      dates.push(item.date);
      return true;
    }
  });

  localStorage.setItem("points", JSON.stringify(payload));
};

export const getHistoricalPoints = (): PointsOfDay[] => {
  const payload = JSON.parse(localStorage.getItem("points") ?? "[]");

  return payload;
};

export const getMaxPointsOfDay = () => {
  const historical = getHistoricalPoints();

  const points = historical.map((item) => item.pointsOfDay);

  return Math.max(...points, 0);
};

export const checkVavePlayedToday = () => {
  const historical = getHistoricalPoints();

  const date = new Date().toLocaleString().split(",")[0];

  return historical.some((item) => item.date === date);
};

export const getPointsOfToday = () => {
  const historical = getHistoricalPoints();

  const date = new Date().toLocaleString().split(",")[0];

  const today = historical.find((item) => item.date === date);

  return today?.pointsOfDay ?? 0;
};

export const handleShareResults = (
  points: number,
  setSetMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  const weeks = calculateWeeks();

  let payload = `Puntaje del día: ${points}\n\nPuntaje de: ${getNameOfCurrentMonth()}:\n`;

  payload += weeks
    .map((week) =>
      week
        .map((day) => {
          if (day === "record") {
            return "🏆";
          } else if (day === "points") {
            return "🟩";
          } else if (day == null) {
            return "⬛️";
          } else {
            return "⬜️";
          }
        })
        .join("")
    )
    .join("\n");

  payload += "\n\nJuega en https://www.martinfenocchio.com/rapidamente";
  console.log(payload);

  setSetMessage(payload);
};
