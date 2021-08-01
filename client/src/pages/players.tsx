import axios from "axios";
import Container from "@material-ui/core/Container";
import GamerCard from "../components/Gamercard";
import { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import clsx from "clsx";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Player } from "../interfaces";

interface PlayersState {
  players: Player[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gamerCardsContainer: {
      display: "flex",
      justifyContent: "center",
      position: "relative",
    },
    fixedButton: {
      position: "fixed",
      bottom: "10vh",
      color: "white",
    },
    yesButton: {
      right: "25%",
      backgroundColor: "green",
    },
    noButton: {
      left: "25%",
      backgroundColor: "red",
    },
    buttonIcon: {
      fontSize: "2em",
    },
  })
);

function Players() {
  const [playersState, setPlayersState] = useState<PlayersState | null>(null);
  const classes = useStyles();

  useEffect(() => {
    axios
      .get<Player[]>("/players")
      .then((res) => {
        setPlayersState({
          players: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (playersState != null) {
    return (
      <>
        <Header />
        <Link to="/guild">Guild</Link>
        <Container maxWidth="sm">
          {playersState.players.map((player: Player) => {
            return (
              <div
                key={player.playerId}
                className={classes.gamerCardsContainer}
              >
                <GamerCard key={player.playerId} playerDetails={player} />
              </div>
            );
          })}
          <div>
            <IconButton
              className={clsx(classes.fixedButton, classes.noButton)}
              aria-label="No"
            >
              <CloseIcon className={classes.buttonIcon} />
            </IconButton>
            <IconButton
              className={clsx(classes.fixedButton, classes.yesButton)}
              aria-label="Yes"
            >
              <SportsEsportsIcon className={classes.buttonIcon} />
            </IconButton>
          </div>
        </Container>
      </>
    );
  }
  return <Header />;
}

export default Players;
