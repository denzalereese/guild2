import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import GamerCardMain from "../components/GamerCardMain";
import { Player } from "../interfaces";

interface MatchedPlayersState {
  players: Player[];
}

function MatchedPlayers() {
  const [matchedPlayersState, setMatchedPlayersState] =
    useState<MatchedPlayersState | null>(null);

  useEffect(() => {
    axios
      .get<Player[]>("/matches")
      .then((res) => {
        setMatchedPlayersState({
          players: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (matchedPlayersState != null) {
    return (
      <div>
        {matchedPlayersState.players.map((player: any) => {
          return <GamerCardMain key={player.playerId} playerDetails={player} />;
        })}
      </div>
    );
  }
  return <></>;
}

export default MatchedPlayers;
