import { PointsOfDay } from "src/features/game/models/games-model";
import { calculateWeeks, getNameOfCurrentMonth } from "../date-utils";

export const savePointsOfDay = (points: number, time: number) => {
  const date = new Date().toLocaleString().split(",")[0];

  const pointsOfDay: PointsOfDay = {
    date,
    pointsOfDay: points,
    time,
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
  const history = localStorage.getItem("points");

  const payload = JSON.parse(
    history && history != "undefined" ? history : "[]"
  );

  return payload;
};

export const getSumOfPoints = (): number => {
  return parseInt(localStorage.getItem("userPoints") ?? "0");
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

export const getDaillyStreak = (): number => {
  const historical = getHistoricalPoints();

  const currentDate = new Date().toLocaleString().split(",")[0];
  let streak = 0;
  let foundCurrentDay = false;

  for (let i = historical.length - 1; i >= 0; i--) {
    if (historical[i].date === currentDate) {
      foundCurrentDay = true;
    }
    if (foundCurrentDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const getScoreOfToday = () => {
  const historical = getHistoricalPoints();

  const date = new Date().toLocaleString().split(",")[0];

  const today = historical.find((item) => item.date === date);

  return today;
};

export const handleShareResults = (
  points: number,
  time: number,
  setSetMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  setSetMessage(generateMessage(points, time));
};

export const generateMessage = (points: number, time: number) => {
  const weeks = calculateWeeks();

  let payload = `Puntaje del día: ${points}\n\nPuntaje de: ${getNameOfCurrentMonth()}:\n\n`;

  payload += weeks
    .map((week) =>
      week
        .map((day) => {
          if (day === "record") {
            return "🏆";
          }
          if (day === "wrong") {
            return "🟥";
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

  payload += `\n\Velocidad: ${(time / points).toFixed(
    1
  )} segundos por cuenta.\n\nJuega en https://www.martinfenocchio.com/rapidamente`;
  console.log(payload);
  return payload;
};
