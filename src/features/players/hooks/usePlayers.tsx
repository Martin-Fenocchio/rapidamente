import axios from "axios";
import { useEffect, useState } from "react";
import { IPlayer } from "../models/players-models";
import { API_URL } from "src/App";

export const usePlayers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<IPlayer[]>([]);

  const handleGetPlayers = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${API_URL}/users`);
      setPlayers(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetPlayers();
  }, []);

  return {
    isLoading,
    players
  };
};
