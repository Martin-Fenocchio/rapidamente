import { PointsOfDay } from "src/features/game/models/games-model";
import { getHistoricalPoints } from "./points/points-utils";

export function getDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
  return new Date(year, month, 0).getDate();
}

export function getStartDayOfCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  return new Date(year, month, 1).getDay(); // getDay() returns 0-6 (Sun-Sat)
}

export const getNameOfCurrentMonth = () => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  const now = new Date();
  return months[now.getMonth()];
};

export const calculateWeeks = () => {
  const daysInMonth = getDaysInCurrentMonth();
  const startDay = getStartDayOfCurrentMonth();
  const history: PointsOfDay[] = getHistoricalPoints();

  let day = 1;

  const payload: (string | null)[][] = [];

  for (let i = 0; i < 6; i++) {
    const week: (string | null)[] = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startDay) {
        week.push(null);
      } else if (day > daysInMonth) {
        week.push(null);
      } else {
        const dateStr = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          day
        )
          .toLocaleString()
          .split(",")[0];

        const record = history.find((record) => record.date === dateStr);
        const isCompletedDay = record?.pointsOfDay == 10;

        week.push(isCompletedDay ? "record" : record ? "points" : "inactive");
        day++;
      }
    }
    payload.push(week);
  }

  return payload;
};
