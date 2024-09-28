import TicketBackground from "src/assets/images/ticket.svg";

function Ticket() {
  return (
    <div className="ticket">
      <img src={TicketBackground} className="ticket-background" />

      <div className="borders">
        <h2>27 PUNTOS</h2>
        <p>28-09-24</p>
      </div>
    </div>
  );
}

export default Ticket;
