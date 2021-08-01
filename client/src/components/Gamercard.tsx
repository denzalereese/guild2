import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Player } from "../interfaces";
import { Container } from "@material-ui/core";
import TinderCard from "react-tinder-card";
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

async function onCardLeftScreen(dir: string, playerDetails: Player) {
  if (dir == "right") {
    await axios.post("/matches", playerDetails);
  }

  await axios.delete("/players", {
    data: { gamertag: playerDetails.gamertag },
  });
}

function Gamercard(props: GamercardProps) {
  let playerDetails = props.playerDetails;
  let playerTwitchDetails = props.playerDetails.twitchDetails;

  const classes = useStyles();

  if (playerDetails && playerTwitchDetails && playerTwitchDetails.topClips) {
    return (
      <Container className={classes.swipe}>
        <TinderCard
          onCardLeftScreen={(dir) => onCardLeftScreen(dir, playerDetails)}
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
