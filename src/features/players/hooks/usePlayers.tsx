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
      const userID = localStorage.getItem("userID");

      const response = await axios.get(`${API_URL}/users`);
      const payload: IPlayer[] = response.data;

      setPlayers(payload);

      payload.forEach((player) => {
        if (player._id === userID) {
          localStorage.setItem("userPoints", `${player.points}`);
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePodium = () => {
    const userID = localStorage.getItem("userID");
    const sortedPlayers = players.sort((a, b) => b.points - a.points);
    let morePoints = null;
    let lessPoints = null;
    let secondLessPoints = null;
    let currentPlayer = null;
    let userIndex = 0;

    for (let i = 0; i < sortedPlayers.length; i++) {
      if (sortedPlayers[i]._id === userID) {
        userIndex = i + 1;
        morePoints = {
          ...(sortedPlayers[i - 1] ?? {}),
          classNames: "previous",
          index: userIndex - 1,
        };

        lessPoints = {
          ...(sortedPlayers[i + 1] ?? {}),
          classNames: "next",
          index: userIndex + 1,
        };
        secondLessPoints = sortedPlayers[i + 2];
        currentPlayer = {
          ...(sortedPlayers[i] ?? {}),
          classNames: "current",
          index: userIndex,
        };
        break;
      }
    }

    if (!currentPlayer || currentPlayer?.points == 0) {
      morePoints = { ...sortedPlayers[0], classNames: "current", index: 1 };
      lessPoints = { ...currentPlayer, classNames: "next", index: userIndex };
      currentPlayer = { ...sortedPlayers[1], classNames: "previous", index: 2 };
    }

    return {
      morePoints,
      lessPoints,
      currentPlayer,
      secondLessPoints: !morePoints?._id
        ? {
            ...(secondLessPoints ?? {}),
            classNames: "previous",
            index: userIndex + 2,
          }
        : null,
      userIndex,
    };
  };

  useEffect(() => {
    handleGetPlayers();
  }, []);

  return {
    isLoading,
    players,
    handleGeneratePodium,
  };
};
