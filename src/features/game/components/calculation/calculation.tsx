import { useState } from "react";
import ReactCardFlip from "react-card-flip";

interface Props {
  timeIsOver: boolean;
  onFinish: () => void;
}
function Calculation({ timeIsOver, ...props }: Props) {
  const options = [4, 8, 1, 2];

  const [isFail, setIsFail] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOnAnswer = (index: number) => {
    const isCorrect = index === 0;

    setIsCorrect(isCorrect);
    setIsFail(!isCorrect);

    props.onFinish();
  };

  return (
    <ReactCardFlip
      isFlipped={isFail || isCorrect || timeIsOver}
      flipDirection="horizontal"
    >
      <article className="calculation">
        <h2>2 + 2</h2>
        <h4>=</h4>

        <div className="grid">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOnAnswer(index)}
              className="animate__animated animate__bounceIn"
              style={{
                animationDelay: `${index ? index * 0.1 : 0}s`
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </article>
      <article className="calculation-result" data-is-correct={isCorrect}>
        {isCorrect ? (
          <h3>Correcto!</h3>
        ) : (
          <>
            <h3>{!isFail ? "Se agotó el tiempo" : "Incorrecto!"}</h3>

            {isFail && <p>La respuesta correcta es 4</p>}
          </>
        )}
      </article>
    </ReactCardFlip>
  );
}

export default Calculation;
