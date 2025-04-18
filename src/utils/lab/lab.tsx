import axios from "axios";
import { getSumOfPoints, savePointsOfDay } from "../points/points-utils";
import { API_URL } from "src/App";
import toast from "react-hot-toast";

function LablScreen() {
  const handleSimulateSignup = async () => {
    const response = await axios.post(`${API_URL}/users`, {
      name: "Julio Cesar",
      email: "fenomartin12@gmail.com",
      points: 0,
    });

    console.log("response.data", response.data);
    localStorage.setItem("points", response.data.history);
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
    toast.success("Datos guardados correctamente");
  };

  const handleSimulateWin = () => {
    savePointsOfDay(1, 14);
    const payload = {
      id: localStorage.getItem("userID"),
      points: getSumOfPoints(),
      history: localStorage.getItem("points"),
    };

    console.log("payload", payload);
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
    </div>
  );
}

export default LablScreen;
