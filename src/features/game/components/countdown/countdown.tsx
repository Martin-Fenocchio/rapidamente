import { useState, useEffect } from "react";
import "src/assets/style/game.scss";

interface Props {
  onFinishCountdown: (value: boolean) => void;
}

function Countdown({ onFinishCountdown }: Props) {
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.setItem("timestamp", new Date().getTime().toString());
      onFinishCountdown(true);
    }
  }, [count, onFinishCountdown]);

  return <div className="countdown"> {count}</div>;
}

export default Countdown;
