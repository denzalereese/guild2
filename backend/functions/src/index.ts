import * as functions from "firebase-functions";
import firebase from 'firebase';
import * as admin from 'firebase-admin';
import * as express from 'express';
import axios from 'axios';
import { TwitchClip, TwitchEmote, TwitchDetails, Player } from './interfaces'
import * as cors from 'cors';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors({ origin: true }));

const firebaseConfig = {
    apiKey: "AIzaSyDwIoSXFzdO5r0KV5_tyAGjO0Y1RQQfs_Y",
    authDomain: "guild2-254fa.firebaseapp.com",
    projectId: "guild2-254fa",
    storageBucket: "guild2-254fa.appspot.com",
    messagingSenderId: "809231324175",
    appId: "1:809231324175:web:0e9624c11ce8ed84253f7a"
};

admin.initializeApp();

const db = admin.firestore()

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Signup route
app.post('/signup', (req, res) => {
    console.log(req.body)
    const newPlayer = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        gamertag: req.body.gamertag,
        favoriteEmote: req.body.favoriteEmote
    }  

    let playerToken:string, playerId:string

    firebase.auth().createUserWithEmailAndPassword(newPlayer.email, newPlayer.password)
        .then((data: any) => {
            if(data.user) {
                playerId = data.user.uid;
                return data.user.getIdToken()
            } else {
                return '';
            }
        })
        .then((token: string) => {
            playerToken = token
            const playerCredentials = {
                playerId,
                gamertag: newPlayer.gamertag,
                email: newPlayer.email,
                favoriteEmote: newPlayer.favoriteEmote
            };
            return db.doc(`/players/${newPlayer.gamertag}`).set(playerCredentials);
        })
        .then(() => {
            return res.status(201).json({ token: playerToken });
        })
        .catch((err: { code: any; }) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

// const FBAuth = (req:any, res:any, next:any) => {
//     let playerToken:string;
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
//         playerToken = req.headers.authorization.split('Bearer ')[1];
//     } else {
//         console.error('No token found');
//         return res.status(403).json('Unauthorized');
//     }

//     admin.auth().verifyIdToken(playerToken)
//         .then(decodedToken => {
//             req.user = decodedToken;
//             return db.collection('players')
//                 .where('playerId', '==', req.user.uid)
//                 .limit(1)
//                 .get();
//         })
//         .then(data => {
//             req.user.gamertag = data.docs[0].data().gamertag;
//             return next();
//         })
//         .catch(err => {
//             console.error('Error verifying token.', err);
//             return res.status(403).json(err);
//         })
// }

app.post('/login', (req, res) => {
    const player = {
        email: req.body.email,
        password: req.body.password
    }

    firebase.auth().signInWithEmailAndPassword(player.email, player.password)
        .then((data: any) => {
            if (data.user) {
                return data.user.getIdToken();
            }
            else {
                return;
            }
        })
        .then((token: any) => {
            return res.json({ token });
        })
        .catch((err: { code: any; }) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        });
})

const twitchApiBaseUrl = 'https://api.twitch.tv/helix'
const twitchAuthHeaders = {
    "client-id": "mfs1h5rn6f8x140zca1jhcm71a4r0x",
    "Authorization": "Bearer 0xah9ps0jyjkn53evqg3jxnucv0peq"
}


async function getDetailsFromTwitchApi(twitchLoginName:string, favoriteEmote?:string) {
    let twitchDetails:TwitchDetails = {};
    
    const twitchUsersRes = await axios.get(twitchApiBaseUrl + '/users', {
        headers: twitchAuthHeaders,
        params: {
            login: twitchLoginName
        }
    })

    twitchDetails.twitchId = twitchUsersRes.data.data[0].id
    twitchDetails.twitchDescription = twitchUsersRes.data.data[0].description
    twitchDetails.twitchProfileImage = twitchUsersRes.data.data[0].profile_image_url
   
    const twitchChannelsRes = await axios.get(twitchApiBaseUrl + '/channels', {
        headers: twitchAuthHeaders,
        params: {
            broadcaster_id: twitchDetails.twitchId
        }
    })

    twitchDetails.lastStreamedGame = twitchChannelsRes.data.data[0].game_name

    const twitchClipsRes = await axios.get(twitchApiBaseUrl + '/clips', {
        headers: twitchAuthHeaders,
        params: {
            broadcaster_id: twitchDetails.twitchId,
            first: 2
        }
    })

    twitchDetails.topClips = twitchClipsRes.data.data.map((clip: TwitchClip) => {
        return {embed_url: clip.embed_url}
    });

    const twitchVidsRes = await axios.get(twitchApiBaseUrl + '/videos', {
        headers: twitchAuthHeaders,
        params: {
            user_id: twitchDetails.twitchId,
            first: 1
        }
    })

    twitchDetails.lastVOD = twitchVidsRes.data.data[0].url

    const twitchGamesRes = await axios.get(twitchApiBaseUrl + '/games', {
        headers: twitchAuthHeaders,
        params: {
            name: twitchDetails.lastStreamedGame
        }
    })
    
    twitchDetails.lastStreamedGameImage = twitchGamesRes.data.data[0].box_art_url
                                                                        .replace('{width}', '250')
                                                                        .replace('{height}', '400')

    const twitchEmotesRes = await axios.get(twitchApiBaseUrl + '/chat/emotes/global', {
        headers: twitchAuthHeaders
    })

    if(favoriteEmote != undefined) {
        twitchEmotesRes.data.data.forEach((emote: TwitchEmote) => {
            if (emote.name.toLowerCase() == favoriteEmote.toLowerCase()) {
                twitchDetails.favoriteEmoteImage = emote.images.url_2x
            }
        });
    }

    return twitchDetails;
}


app.get('/players', (req, res) => { 
    db.collection('players').get()
        .then(data => {
            let players:Player[] = [];
            let playersWithTwitchDetails:Promise<Player>[];

            data.forEach(player => {
                players.push({
                    playerId: player.data().playerId,
                    email: player.data().email,
                    gamertag: player.data().gamertag,
                    favoriteEmote: player.data().favoriteEmote
                });
            })

            playersWithTwitchDetails = players.map(player => {
                return getDetailsFromTwitchApi(player.gamertag, player.favoriteEmote)
                        .then(response => {
                            player.twitchDetails = response
                            return player
                        })
                        .catch(err => {
                            return err
                        })
            })

            Promise.all(playersWithTwitchDetails)
                .then(result => {
                    return res.json(result);
                })
                .catch(err => {
                    return res.json( { err } )
                })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        });
});

app.post('/matches', (req, res) => {
    const newMatch = {
        playerId: req.body.playerId,
        email: req.body.email,
        gamertag: req.body.gamertag,
        favoriteEmote: req.body.favoriteEmote,
        twitchDetails: req.body.twitchDetails
    }

    db.doc(`/matches/${newMatch.gamertag}`).set(newMatch);  
    res.status(200).json(newMatch)
})

app.get('/matches', (req, res) => {
    const matches: any[] = []
    db.collection('matches').get()
        .then(data => {
            data.forEach(player => {
                matches.push(player.data())
            })
            res.status(200).json(matches)
        })
        .catch(err => {
            res.status(500).json({err: err.code})
        })
})

//seed DB

// function shuffle(arr: any) {
//     var currentIndex = arr.length,
//       randomIndex;
  
//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
//       // Pick a remaining element...
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;
  
//       // And swap it with the current element.
//       [arr[currentIndex], arr[randomIndex]] = [
//         arr[randomIndex],
//         arr[currentIndex],
//       ];
//     }
  
//     return arr;
//   }

// const getStreams = async () => {
    //   await axios
    //     .get(twitchApiBaseUrl + "/streams", {
    //       headers: twitchAuthHeaders,
    //       params: {
    //         first: 100,
    //       },
    //     })
    //     .then(async (res) => {
    //       const loginNames = res.data.data.map((stream: any) => {
    //         return stream.user_login;
    //       });

    //       const userArray: any[] = [];
    //       loginNames.forEach((loginName: string) => {
    //         userArray.push({
    //           email: `${loginName}@gmail.com`,
    //           password: "guild123",
    //           gamertag: loginName,
    //         });
    //       });

    //       await axios
    //         .get(twitchApiBaseUrl + "/chat/emotes/global", {
    //           headers: twitchAuthHeaders,
    //         })
    //         .then((res) => {
    //           const emotesArray = shuffle(res.data.data);
    //           for (let i = 0; i < userArray.length; i++) {
    //             userArray[i].favoriteEmote = emotesArray[i].name;
    //           }
    //         });
    //       console.log(userArray);
    //       let promises = userArray.map((user) => {
    //         return axios.post("/signup", user);
    //       });

    //       Promise.all(promises).then((user) => console.log(user));
    //     });
    // };

    // getStreams();

exports.api = functions.https.onRequest(app);


