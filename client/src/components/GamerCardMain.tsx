import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import { Player } from "../interfaces";
import GamercardDetails from "./GamercardDetails";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

interface GamercardMainProps {
  playerDetails: Player;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    swipe: {
      position: "absolute",
      marginTop: "10vh",
    },
    contentOverlay: {
      position: "absolute",
      bottom: "2%",
      left: "2%",
      color: "white",
    },
    iconButtonOverlay: {
      position: "absolute",
      bottom: "2%",
      right: "2%",
      color: "white",
    },
    media: {
      height: 0,
      paddingTop: "100%",
      position: "relative",
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);

function GamerCardMain(props: GamercardMainProps) {
  const classes = useStyles();
  const playerTwitchDetails = props.playerDetails.twitchDetails;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (playerTwitchDetails) {
    return (
      <Card>
        <CardMedia
          className={classes.media}
          image={playerTwitchDetails.twitchProfileImage}
          title="Twitch Profile Image"
        >
          <CardContent>
            <div className={classes.contentOverlay}>
              <Typography variant="h4">
                {props.playerDetails.gamertag}
              </Typography>
              <Typography>{playerTwitchDetails.lastStreamedGame}</Typography>
            </div>
          </CardContent>
          <IconButton
            className={clsx(classes.expand, classes.iconButtonOverlay, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            onTouchStart={handleExpandClick}
            aria-expanded={expanded}
            aria-label="See more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardMedia>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <GamercardDetails twitchDetails={playerTwitchDetails} />
        </Collapse>
      </Card>
    );
  }

  return <></>;
}

export default GamerCardMain;
