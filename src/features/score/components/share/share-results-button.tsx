import { handleShareResults } from "src/utils/points/points-utils";
import { useEffect, useState } from "react";
import { WhatsappShareButton } from "react-share";

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

  const handleShare = async () => {
    const shareData = {
      title: handleShareResults(points),
    };

    if (navigator.share != undefined) {
      navigator.canShare(shareData);
    } else {
      setSetMessage(shareData.title);
    }
  };

  return (
    <>
      <button onClick={handleShare} className="share-button">
        Compartir resultados
      </button>

      <WhatsappShareButton url={message}>
        <div />
      </WhatsappShareButton>
    </>
  );
}

export default ShareResultsButton;
