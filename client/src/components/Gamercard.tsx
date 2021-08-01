import { useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Player } from "../interfaces";
import { Collapse, Container, IconButton } from "@material-ui/core";
import TinderCard from "react-tinder-card";
import GamercardDetails from "./GamercardDetails";
import axios from "axios";
import GamerCardMain from "./GamerCardMain";

export interface GamercardProps {
  playerDetails: Player;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    swipe: {
      position: "absolute",
      marginTop: "10vh",
    },
  })
);

function onSwipe(dir: string, playerDetails: Player) {
  if (dir == "right") {
    axios.post("/matches", playerDetails);
  }
}

function Gamercard(props: GamercardProps) {
  let playerDetails = props.playerDetails;
  let playerTwitchDetails = props.playerDetails.twitchDetails;

  const classes = useStyles();

  if (playerDetails && playerTwitchDetails && playerTwitchDetails.topClips) {
    return (
      <Container className={classes.swipe}>
        <TinderCard
          onSwipe={(dir) => onSwipe(dir, playerDetails)}
          preventSwipe={["up", "down"]}
        >
          <GamerCardMain playerDetails={playerDetails} />
        </TinderCard>
      </Container>
    );
  }
  return <></>;
}

export default Gamercard;
