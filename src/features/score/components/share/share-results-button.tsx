import { WhatsappShareButton } from "react-share";
import { useShareResultsHook } from "src/features/onboarding/hooks/share-results-button-hook";
import { handleShareResults } from "src/utils/points/points-utils";

interface Props {
  points: number;
  time?: number;
}

function ShareResultsButton({ points, ...props }: Props) {
  const { message, setSetMessage, location } = useShareResultsHook();

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
