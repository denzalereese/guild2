import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
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
      <Container>
        <Grid container>
          {matchedPlayersState.players.map((player: any) => {
            return (
              <Grid item xs={12} md={4}>
                <GamerCardMain key={player.playerId} playerDetails={player} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    );
  }
  return <></>;
}

export default MatchedPlayers;
