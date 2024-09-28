import Logo from "src/assets/images/menterapida.svg";
import { HistoryGrid } from "../components/grid/history-grid";
import "src/assets/style/score-screen.scss";
import "src/assets/style/ticket.scss";
import Ticket from "../components/ticket/ticket";

function ScoreScreen() {
  return (
    <main className="score-screen">
      <img src={Logo} className="logo" />

      {/*   <div className="score-container">
        <h3>Tu puntaje fue:</h3>
        <h2>23</h2>

        <p className="record">
          Tu record es <span>45</span>
        </p>
      </div> */}

      <Ticket />

      <h4>Tu ranking mensual:</h4>
      <HistoryGrid />

      <p className="desc-grid">
        Vuelve <span>mañana</span> para completar tu proximo cuadrado!
      </p>

      <button>Compartir resultados</button>
    </main>
  );
}

export default ScoreScreen;
