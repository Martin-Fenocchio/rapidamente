import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { WhatsappShareButton } from "react-share";
import { handleShareResults } from "src/utils/points/points-utils";

interface Props {
  points: number;
  time?: number;
}

function ShareResultsButton({ points, ...props }: Props) {
  const [message, setSetMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (message.length === 0) return;
    const button: any = document.getElementsByClassName(
      "react-share__ShareButton"
    )[0];
    button.click();
  }, [message]);

  return (
    <>
      <button
        onClick={() =>
          handleShareResults(
            points,
            location.state?.time ?? props.time ?? 0,
            setSetMessage
          )
        }
      >
        Compartir resultados
      </button>

      <WhatsappShareButton url={message}>
        <div />
      </WhatsappShareButton>
    </>
  );
}

export default ShareResultsButton;
