import axios from "axios";
import { getSumOfPoints } from "../points/points-utils";
import { API_URL } from "src/App";
import toast from "react-hot-toast";
import { useAnalytics } from "src/hooks/useAnalytics";

function LablScreen() {
  const analytics = useAnalytics();
  const handleSimulateSignup = async () => {
    const response = await axios.post(`${API_URL}/users`, {
      name: "Julio Cesar",
      email: "fenomartin12@gmail.com",
      points: 0,
    });

    console.log("response.data", response.data);
    localStorage.setItem("points", response.data.history ?? "[]");
    localStorage.setItem("userID", response.data._id);
  };

  const handleLinkEmail = async () => {
    const history = localStorage.getItem("points");
    const response = await axios.put(`${API_URL}/users/link-email`, {
      userId: localStorage.getItem("userID"),
      history: history && history != "undefined" ? history : "[]",
      email: "fenomartin12@gmail.com",
    });

    localStorage.setItem("userID", response.data._id);
  };

  const handleCheckUserID = () => {
    const userID = localStorage.getItem("userID");
    console.log("userID", userID);

    const isValid = userID && userID.length > 0 && userID !== "undefined";
    toast.success(`Datos guardados correctamente ${isValid}`);
  };

  const handleSimulateWin = () => {
    const payload = {
      id: localStorage.getItem("userID"),
      points: getSumOfPoints() + 5,
      history: localStorage.getItem("points"),
    };

    console.log("payload", payload);
  };

  const handleTrackGameStart = () => {
    analytics.trackGameStart();
  };

  const handleTrackGameEnd = () => {
    analytics.trackGameEnd({
      score: 5,
      duration: 15,
      isCorrect: true,
      operation: "5 + 5",
    });
  };

  return (
    <div>
      <button onClick={handleSimulateSignup}>First time to user</button>
      <br />
      <button onClick={handleLinkEmail}>
        Login with google after playing normal
      </button>
      <br />
      <button onClick={handleSimulateWin}>Simulate win</button>

      <br />
      <button onClick={handleCheckUserID}>Check userID</button>

      <br />
      <button
        onClick={() => {
          throw new Error("This is your first error!");
        }}
      >
        Break the world
      </button>

      <br />
      <button onClick={handleTrackGameStart}>Track game start</button>

      <br />
      <button onClick={handleTrackGameEnd}>Track game end</button>
    </div>
  );
}

export default LablScreen;
