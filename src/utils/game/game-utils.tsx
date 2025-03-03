export const generateCalculationElement = (calculation: string) => {
  const parts = calculation.split("");

  const payload = parts.map((part) => {
    if (["+", "-", "x", "/"].includes(part)) {
      return <span className="sym">{part}</span>;
    } else if (["(", ")"].includes(part)) {
      return <span className="curly">{part}</span>;
    }

    return <span>{part}</span>;
  });

  return payload;
};

export const GAME_SHORT_TIME = 2.5;
export const GAME_LONG_TIME = 4;

export const getGameTime = (operationIndex: number) => {
  return operationIndex > 3 ? GAME_LONG_TIME : GAME_SHORT_TIME;
};
