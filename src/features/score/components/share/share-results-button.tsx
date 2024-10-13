import { useEffect, useState } from "react";
import { WhatsappShareButton } from "react-share";
import { handleShareResults } from "src/utils/points/points-utils";

interface Props {
  points: number;
}

function ShareResultsButton({ points }: Props) {
  const [message, setSetMessage] = useState("");

  useEffect(() => {
    if (message.length === 0) return;
    const button: any = document.getElementsByClassName(
      "react-share__ShareButton"
    )[0];
    button.click();
  }, [message]);

  return (
    <>
      <button onClick={() => handleShareResults(points, setSetMessage)}>
        Compartir resultados
      </button>

      <WhatsappShareButton url={message}>
        <div />
      </WhatsappShareButton>
    </>
  );
}

export default ShareResultsButton;
