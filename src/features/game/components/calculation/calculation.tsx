import { useCallback, useEffect, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Operation } from "../../models/games-model";
import { generateCalculationElement, getGameTime, generateOptions } from "src/utils/game/game-utils";

interface Props {
  operation: Operation;
  operationIndex: number;
  onAnswer: (result: boolean) => void;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
}

function Calculation({ operation, operationIndex, onAnswer, setCountdown }: Props) {
  const [outcome, setOutcome] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const answered = useRef(false);
  const deadline = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const answer = useCallback((result: "correct" | "wrong" | "timeout") => {
    if (answered.current) return;
    answered.current = true;
    if (timer.current) clearInterval(timer.current);
    setOutcome(result);
    onAnswer(result === "correct");
  }, [onAnswer]);

  useEffect(() => {
    answered.current = false;
    const seconds = getGameTime(operationIndex);
    deadline.current = performance.now() + seconds * 1000;
    setCountdown(seconds);
    setOptions(generateOptions(operation.result));
    timer.current = setInterval(() => {
      const remaining = Math.max(0, (deadline.current - performance.now()) / 1000);
      setCountdown(remaining);
      if (remaining === 0) answer("timeout");
    }, 50);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [operation.result, operationIndex, setCountdown, answer]);

  const select = (option: number) => {
    if (performance.now() >= deadline.current) answer("timeout");
    else answer(option === operation.result ? "correct" : "wrong");
  };

  return (
    <ReactCardFlip isFlipped={outcome !== null} flipDirection="horizontal">
      <article className="calculation" data-index-is-even={operationIndex % 2 === 0}>
        <h3>{generateCalculationElement(operation.operation)}</h3>
        <h4>=</h4>
        {outcome === null && <div className="grid">
          {options.map((option, index) => <button key={option} onClick={() => select(option)}
            className="animate__animated animate__bounceIn" style={{ animationDelay: `${index * 0.1}s` }}>
            {option}
          </button>)}
        </div>}
      </article>
      <article className="calculation-result" data-is-fail={outcome === "wrong" || outcome === "timeout"} data-is-correct={outcome === "correct"}>
        {outcome === "correct" ? <h3>Correcto!</h3> : <>
          <h3>{outcome === "timeout" ? "Se agotó el tiempo" : "Incorrecto!"}</h3>
          {outcome === "wrong" && <p>La respuesta correcta es {operation.result}</p>}
        </>}
      </article>
    </ReactCardFlip>
  );
}
export default Calculation;
