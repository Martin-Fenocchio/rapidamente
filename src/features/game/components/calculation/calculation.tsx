import { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { Operation } from "../../models/games-model";
import {
  generateCalculationElement,
  getGameTime,
} from "src/utils/game/game-utils";

interface Props {
  timeIsOver: boolean;
  operation: Operation;
  operationIndex: number;
  onAnswer: (result: boolean) => void;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
}

let intervalID = 0;

function Calculation({ timeIsOver, operation, setCountdown, ...props }: Props) {
  const [isFail, setIsFail] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState<number[]>([]);

  const onStartQuestion = async () => {
    setCountdown(getGameTime(props.operationIndex));
    clearInterval(intervalID);

    intervalID = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          onTimeOver();
          return 0;
        }
        return prevCountdown! - 1;
      });
    }, 1000);
  };

  const onTimeOver = () => {
    clearInterval(intervalID);

    setTimeout(() => {
      setCountdown(-1);
    }, 1000);

    setTimeout(() => {
      props.onAnswer(false);
    }, 1000);
  };

  const handleOnAnswer = (optionSelected: number) => {
    const isCorrect = optionSelected === operation.result;

    setIsCorrect(isCorrect);
    setIsFail(!isCorrect);

    props.onAnswer(isCorrect);
  };

  const generateOptions = (): number[] => {
    const options = new Set();
    const correctValue = operation.result;

    options.add(correctValue);

    while (options.size < 4) {
      const variants = Math.floor(Math.random() * 10) - 5;
      const wrongOption = correctValue + variants;
      if (wrongOption !== correctValue && wrongOption >= 0) {
        options.add(wrongOption);
      }
    }

    return Array.from(options).sort(() => Math.random() - 0.5) as number[];
  };

  useEffect(() => {
    setIsFail(false);
    setIsCorrect(false);
    setOptions(generateOptions());
    onStartQuestion();
  }, [operation.operation]);

  const flipped = isFail || isCorrect || timeIsOver;

  return (
    <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
      <article
        className="calculation"
        data-index-is-even={props.operationIndex % 2 == 0}
      >
        <h3>{generateCalculationElement(operation.operation)}</h3>
        <h4>=</h4>

        {!flipped && (
          <div className="grid">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOnAnswer(option)}
                className="animate__animated animate__bounceIn"
                style={{
                  animationDelay: `${index ? index * 0.1 : 0}s`,
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </article>
      <article
        className="calculation-result"
        data-is-fail={isFail || timeIsOver}
        data-is-correct={isCorrect}
      >
        {isCorrect ? (
          <h3>Correcto!</h3>
        ) : (
          <>
            <h3>{!isFail ? "Se agotó el tiempo" : "Incorrecto!"}</h3>

            {isFail && <p>La respuesta correcta es {operation.result}</p>}
          </>
        )}
      </article>
    </ReactCardFlip>
  );
}

export default Calculation;
