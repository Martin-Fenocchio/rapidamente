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
