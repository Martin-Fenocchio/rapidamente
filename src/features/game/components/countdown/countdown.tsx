import { useState, useEffect } from "react";
import "src/assets/style/game.scss";

interface Props {
  onFinishCountdown: (value: boolean) => void;
}

function Countdown(props: Props) {
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      props.onFinishCountdown(true);
      localStorage.setItem("timestamp", new Date().getTime().toString());
    }
  }, [count]);

  return <div className="countdown"> {count}</div>;
}

export default Countdown;
