import { WhatsappShareButton } from "react-share";
import { useShareResultsHook } from "src/features/onboarding/hooks/share-results-button-hook";
import {
  generateMessage,
  handleShareResults,
} from "src/utils/points/points-utils";
import WspIcon from "src/assets/images/wsp.png";
import CopyIcon from "src/assets/images/copy.png";

interface Props {
  points: number;
}

function ShareResultsButton({ points }: Props) {
  const { message, setSetMessage, timeOfToday, isCopied, onCopy } =
    useShareResultsHook();

  const copyMessage = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generateMessage(points, timeOfToday ?? 0);
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand("copy");
    document.body.removeChild(textArea);
    onCopy();
  };

  return (
    <div className="share-results-buttons">
      <div className="">
        <button
          onClick={() =>
            handleShareResults(points, timeOfToday ?? 0, setSetMessage)
          }
        >
          <img src={WspIcon} alt="whatsapp" />
          Compartir en Whatsapp
        </button>
        <WhatsappShareButton url={message}>
          <div />
        </WhatsappShareButton>
      </div>
      <button onClick={copyMessage} className="copy-button">
        <img src={CopyIcon} alt="copy" />
        {isCopied ? "Copiado!" : "Copiar resultados"}
      </button>
    </div>
  );
}

export default ShareResultsButton;
