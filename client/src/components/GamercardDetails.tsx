import { Theme, CardContent, Typography, Link } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import React from "react";
import { TwitchDetails } from "../interfaces";
import clsx from "clsx";

interface TwitchDetailsProps {
  twitchDetails: TwitchDetails;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailMedia: {
      display: "block",
      margin: "0 auto",
    },
    detailContent: {
      marginBottom: "5%",
    },
    detailLink: {
      textAlign: "center",
      display: "block",
    },
  })
);

function GamercardDetails(props: TwitchDetailsProps) {
  const classes = useStyles();
  if (props.twitchDetails != null && props.twitchDetails.topClips != null) {
    return (
      <CardContent>
        <Typography
          className={classes.detailContent}
          variant="h5"
          gutterBottom
          align="center"
        >
          Twitch Channel Description
        </Typography>
        <Typography
          className={classes.detailContent}
          gutterBottom
          align="center"
        >
          {props.twitchDetails.twitchDescription}
        </Typography>
        <Typography
          className={classes.detailContent}
          variant="h5"
          gutterBottom
          align="center"
        >
          Last Streamed Game
        </Typography>
        <img
          className={clsx(classes.detailMedia, classes.detailContent)}
          alt=""
          src={props.twitchDetails.lastStreamedGameImage}
        />
        <Typography
          className={classes.detailContent}
          variant="h5"
          gutterBottom
          align="center"
        >
          Favorite Emote
        </Typography>
        <img
          className={clsx(classes.detailMedia, classes.detailContent)}
          alt=""
          src={props.twitchDetails.favoriteEmoteImage}
        />
        <Typography
          className={classes.detailContent}
          variant="h5"
          gutterBottom
          align="center"
        >
          Last VOD
        </Typography>
        <Link
          className={clsx(classes.detailLink, classes.detailContent)}
          href={props.twitchDetails.lastVOD}
          children={props.twitchDetails.lastVOD}
        />
        <Typography
          className={clsx(classes.detailLink, classes.detailContent)}
          variant="h5"
          gutterBottom
          align="center"
        >
          Top Clips
        </Typography>
        <Link
          className={clsx(classes.detailLink, classes.detailContent)}
          href={props.twitchDetails.topClips[0].embed_url}
          children={props.twitchDetails.topClips[1].embed_url}
        />
        <Link
          className={clsx(classes.detailLink, classes.detailContent)}
          href={props.twitchDetails.topClips[1].embed_url}
          children={props.twitchDetails.topClips[1].embed_url}
        />
      </CardContent>
    );
  }
  return <></>;
}
export default GamercardDetails;
