import { getHistoricalPoints } from "../points/points-utils";

export const getStreak = () => {
  const data = getHistoricalPoints();

  const today = new Date();

  const parseDate = (d: string) => {
    const [month, day, year] = d.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedData = [...data]
    .map((entry) => ({ ...entry, parsedDate: parseDate(entry.date) }))
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

  let streak = 0;

  for (let i = 0; i < sortedData.length; i++) {
    const diffInDays = Math.floor(
      (today.getTime() - sortedData[i].parsedDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0 || diffInDays === 1) {
      streak = 1;
      let prevDate = sortedData[i].parsedDate;

      for (let j = i + 1; j < sortedData.length; j++) {
        const current = sortedData[j].parsedDate;
        const diff = Math.floor(
          (prevDate.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff === 1) {
          streak++;
          prevDate = current;
        } else {
          break;
        }
      }
      break;
    }
  }

  return streak;
};
