import { WhatsappShareButton } from "react-share";
import { useShareResultsHook } from "src/features/onboarding/hooks/share-results-button-hook";
import { handleShareResults } from "src/utils/points/points-utils";

interface Props {
  points: number;
}

function ShareResultsButton({ points }: Props) {
  const { message, setSetMessage, timeOfToday } = useShareResultsHook();

  return (
    <>
      <button
        onClick={() =>
          handleShareResults(points, timeOfToday ?? 0, setSetMessage)
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
