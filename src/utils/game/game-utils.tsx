export const generateCalculationElement = (calculation: string) => {
  const parts = calculation.split("");

  const payload = parts.map((part, index) => {
    if (["+", "-", "x", "/"].includes(part)) {
      return <span key={index} className="sym">{part}</span>;
    } else if (["(", ")"].includes(part)) {
      return <span key={index} className="curly">{part}</span>;
    }

    return <span key={index}>{part}</span>;
  });

  return payload;
};

export const GAME_SHORT_TIME = 2.5;
export const GAME_LONG_TIME = 4;

export const getGameTime = (operationIndex: number) => {
  return operationIndex > 3 ? GAME_LONG_TIME : GAME_SHORT_TIME;
};

// Build a finite candidate pool so even a fixed random source cannot loop forever.
export const generateOptions = (correct: number, random: () => number = Math.random): number[] => {
  const candidates = Array.from({ length: 10 }, (_, index) => Math.max(0, correct - 5) + index).filter(value => value !== correct);
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const options = [correct, ...candidates.slice(0, 3)];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
};
