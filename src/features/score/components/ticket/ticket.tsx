import { useEffect, useState } from "react";
import TicketBackground from "src/assets/images/ticket.svg";

interface Props {
  points: number;
}

function Ticket({ points }: Props) {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleString().split(",")[0].replace(/\//g, "-"));
  }, []);

  return (
    <div className="ticket">
      <img src={TicketBackground} className="ticket-background" />

      <div className="borders">
        <h2>
          {points} PUNTO{points == 1 ? "" : "S"}
        </h2>
        <p>{date}</p>
      </div>
    </div>
  );
}

export default Ticket;
