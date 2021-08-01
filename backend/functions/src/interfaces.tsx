export interface TwitchClip {
  embed_url: string;
}

export interface TwitchEmote {
  images: { url_2x: string };
  name: string;
}

export interface TwitchDetails {
  favoriteEmoteImage?: string;
  lastStreamedGame?: string;
  lastStreamedGameImage?: string;
  lastVOD?: string;
  topClips?: TwitchClip[];
  twitchDescription?: string;
  twitchId?: string;
  twitchProfileImage?: string;
}

export interface Player {
  email: string;
  gamertag: string;
  playerId: string;
  favoriteEmote?: string;
  twitchDetails?: TwitchDetails;
}
