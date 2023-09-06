import http from 'http';
import cors from 'cors'
import { IncomingMessage } from "http";
import { GameStates } from "./interfaces/gameState";
import Player from "./interfaces/player";
import express from 'express';
import CodeSnippet from "./sequelize-config/models/CodeSnippet";
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
import db from "./sequelize-config/models/model_init";
import * as util from 'util';

const app = express();
app.use(cors())
const port: number = 5000;
const server = http.createServer(app)
const wss = new WebSocket.Server({
  server, 
  handleProtocols: (protocols, request) => {
    const protocolsArray = Array.from(protocols);
    return protocolsArray[0];
  }
});
const languages = ["c", "cpp", "csharp", "go", "html", "java", "javascript", "kotlin", "python", "typescript"]


let gameStartTimeouts: { [gameRoomId: string]: NodeJS.Timeout } = {};
let gameRooms: GameStates = {}; // to store game room information
let gameRoomId = uuidv4();
let message = {}
let startTime: number;
let snippets: any = [];
async function connectDB() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch(err) {
    console.error('Unable to connect to the database', err, "retrying.");
    // Wait for 1 second and then try connecting again
    await new Promise(resolve => setTimeout(resolve, 1000));
    await connectDB();
  }
}
// Since we don't want to slow down the websocket on connect, by using async
// database call we can instead have a set interval to grab a bunch of random
// snippets and then for the new games, they can use those snippets, then every
// minute or so, we would refresh to get different snippets.

async function startApp() {
  try {
    await connectDB();

    server.listen(port, () => {
      console.log('Listening on %d', port);
    });

    app.get('/game/:language', (req, res) => {
      const language = req.params.language;
      
      let randomSnippet: number = Math.floor(Math.random() * languages.length);
      const data = {
        "snippet" : allCode[language][randomSnippet].replace(/\t/g, "    ")
      }
      return res.json(data);
    });


    console.log('we connected time to query!')

    let sql = `
      SELECT * FROM (
          SELECT *, ROW_NUMBER() OVER(PARTITION BY "language" ORDER BY RANDOM()) AS r
          FROM "snippets"
      ) x WHERE x.r <= 10
    `;

    snippets = await db.sequelize.query(sql, { type: db.Sequelize.QueryTypes.SELECT });
  } catch (error) {
    console.log(error);
  }
interface code  {
  [langauage: string]: string[]
}
// code
let allCode: code = {

  "c": [],
  "cpp": [],
  "csharp": [],
  "go": [],
  "html": [],
  "java": [],
  "javascript": [],
  "kotlin": [],
  "python": [],
  "typescript": [],

}
  if (snippets) {
    for (let snippet of snippets) {
      allCode[snippet.language].push(snippet.code)
    }
}

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    console.log("we gota connection")
    console.log("Received URL", request.url)
    const urlObj = new URL(request.url!, 'http://dummyhost'); // The host here doesn't matter because you're only interested in the query.
    // retrieve name. if its null they will get a default 
    // guest playername in the player object below. 
    const name = urlObj.searchParams.get('name');
    console.log("Users name is", name)
  
    const player: Player = {
      name: name || 'guest',  
      id: uuidv4(),  // this will be used only by the user
      game_id: uuidv4(),  // this will be used by all to identify the players.
      words: 0,
      currMistakes: 0,
      mistakes: 0,
      websocket: ws,
      playerSnippet: []
    };
  
  
    // if the game room doesn't exist, create it
    if (!gameRooms[gameRoomId]) {
      let randomSnippet: string = "";
      // get random snippet from all code.
      // first get random language, then get random out of 10.
      let randomLanguage = languages[Math.floor(Math.random() * languages.length)];
      let randomCode = Math.floor(Math.random() * languages.length);
      let snippet = allCode[randomLanguage][randomCode]
        if (snippet) {
          randomSnippet = snippet;
        }
      
      gameRooms[gameRoomId] = { players: [], gameStarted: false, Snippet: randomSnippet, startTime: 0  };
    }
  
    gameRooms[gameRoomId].players.push(player)
  
  
    // for each player send the players in there.
    gameRooms[gameRoomId].players.forEach(player => {
      let players =  gameRooms[gameRoomId].players.map(player => ({
        name: player.name,
        game_id: player.game_id,
        words: player.words,
        mistakes: player.mistakes,
        playerSnippet: player.playerSnippet,
      }))
      let data = {
        gameRoomId: gameRoomId,
        Snippet: gameRooms[gameRoomId].Snippet.replace(/\t/g, "    "),
        players: players,
        // make sure each player gets oonly their unique id.
        playerId: player.id

      };
    
      message = {
        "type": "UPDATE_PLAYER_STATE",
        "data": data
      }
      
      player.websocket.send(JSON.stringify(message))
    });
  
  
    if (gameRooms[gameRoomId].players.length === 1) {
      // Start a 10 second timeout as soon as the first player joins
      console.log("Starting 10 second timer")
  
      startTime = Date.now() + 10000;
      gameStartTimeouts[gameRoomId] = setTimeout(startGame, 10000);
    } 
    else if (gameRooms[gameRoomId].players.length === 5) {
      // If all 5 players have joined before 10 seconds, clear the timeout and start the game
      console.log("We got 5 players, canceling the timer, and starting game!")
      clearTimeout(gameStartTimeouts[gameRoomId]);
      startGame();
    }
  
    // client will get the start time
    // and use that to set its clock.
    message = {
      "type": "TIMER",
      "data": {
        "startTime": startTime
      } 
    }
  
    ws.send(JSON.stringify(message));
  
    // if we reach a length of 5 or the timer runs out we have to 
  
    ws.on('message', message => {
      // handle incoming message
      // Since there may be multiple games going
      // on at once, we need a way to reliably
      // know which game the sending player is
      // coming from. We can just make the player
      // send the request with the game room id.
      // in that case the user just sends the id
      // then we use that to update the relevant
      // info, and then update the user stats.

      // get the game room id from the messge itself
      // then we will deal with logic later (INCOMPLETE)
      const data = JSON.parse(message.toString());


      if (data.type === "LEAVING_GAME") {
        const currGameRoom = gameRooms[data.gameRoomId];

        // We may DELETE this code later. Since we want to say the game state at the end
        // for users to look at their match history. So in this case we would not want
        // to remove the player from the room until we are sure the game is saved.
        // game is only saved after the last user is finished. And in that case we can
        // easily tell because everyones progress is full. But if someone quits or afk
        // we need to get rid of game rooms that are longer then a specific time and that
        // way we can save games to match history and not take up too much server space.
        if (currGameRoom) {
            currGameRoom.players = currGameRoom.players.filter(player => player.id !== data.playerId);
            console.log('player disconnected')
        
        }
        return;
      }
      // console.log(data);
      const currGameRoomId = data.gameRoomId;
      const playerId = data.playerId;

      // push the words we got into the player snippet
      // array. Then after this get wpm. Mistakes should
      // be calculated in here because if we calculate them
      // in the array that gets the current mistakes, we will
      // end up counting mistakes every time a message comes in
      // so if one mistake is not fixed, it will end up being incremented
      // every time a message is sent which will give hundreds of mistakes
      // very quickly.
      if (data.words) {
        for (let i = 0; i < gameRooms[currGameRoomId].players.length; i++) {
          if (playerId == gameRooms[currGameRoomId].players[i].id) {
            
            for (let ch of data.words) {
              // if we have backspace then remove by the amount of chars
              // specified in the backspace string.
              if (ch.startsWith("Backspace")) {
                const num = parseInt(ch.split(" ")[1], 10);
                while (gameRooms[currGameRoomId].players[i].playerSnippet.length > num) {
                  gameRooms[currGameRoomId].players[i].playerSnippet.pop();
                }
              }
              else {
                // every time you add a character, check to see if there is 
                // a mistake. we don't need to check on backspaces though.
                gameRooms[currGameRoomId].players[i].playerSnippet.push(ch)
                const len = gameRooms[currGameRoomId].players[i].playerSnippet.length;
                if (gameRooms[currGameRoomId].players[i].playerSnippet[len - 1] != gameRooms[currGameRoomId].Snippet[len - 1]) {
                  gameRooms[currGameRoomId].players[i].mistakes += 1;
                } 
              }

            }
            
          }
          // after getting the player snippet, we should try to get calculate
          // words, currMistakes, and only add on to mistakes since we want
          // the total for that so in the end the user can get the accuracy.
          gameRooms[currGameRoomId].players[i].currMistakes = 0;
          console.log("SNIPPET", gameRooms[currGameRoomId].players[i].playerSnippet)
          for (let j = 0; j < gameRooms[currGameRoomId].players[i].playerSnippet.length; j++) {
            if (gameRooms[currGameRoomId].players[i].playerSnippet[j] != gameRooms[currGameRoomId].Snippet[j]) {
              gameRooms[currGameRoomId].players[i].currMistakes += 1;
            }
          }
          gameRooms[currGameRoomId].players[i].words = gameRooms[currGameRoomId].players[i].playerSnippet.length;
          
        }
    }

  
      // broadcast message to all clients in the game room

      // all snippets of each player to see real time update. 
      // const allSnippets: string[][] = gameRooms[currGameRoomId].players.map(player => player.playerSnippet);
      const allProgress = gameRooms[currGameRoomId].players.map(({ words, mistakes, currMistakes, name, game_id }) => {
        const currentTime = Date.now();
        console.log('Current Time:', currentTime);
        console.log('Start Time:', gameRooms[currGameRoomId].startTime);
        console.log('Difference:', currentTime - gameRooms[currGameRoomId].startTime);
        
        return {
          time: currentTime,
          startTime: gameRooms[currGameRoomId].startTime,
          game_id: game_id,
          words: words,
          name: name,
          mistakes: mistakes,
          currMistakes: currMistakes,
          wpm: Math.floor(60000 * (words - currMistakes) / (5 * (currentTime - gameRooms[currGameRoomId].startTime))),
          progress: (words - currMistakes) / gameRooms[currGameRoomId].Snippet.length
        };
      });
      

      gameRooms[currGameRoomId].players.forEach(player => {
        if (player.websocket.readyState === WebSocket.OPEN) {
          // return the total string arrays of each player. 
          gameRooms[currGameRoomId].players
          let message = {
            "type": "WORDS",
            "data": {
              'progress': allProgress
            } 
          }
          player.websocket.send(JSON.stringify(message));
          console.log('GOT MESSAGE FROM PLAYER', playerId)
          console.log(util.inspect(allProgress, { depth: null, colors: true }));
        }
      });
    });
  
    ws.on('close', () => {
      // handle client disconnection
      
      console.log('socket closed!')
    });

    ws.on('error', (err) => {
      console.error("WebSocket error observed:", err);
    });
    
  });
}

startApp();



function startGame() {
  let currentGameRoomId = gameRoomId;
  gameRooms[currentGameRoomId].startTime = Date.now() + 5000;
  gameRoomId = uuidv4();  // Generate new gameRoomId immediately
  // after 5 seconds start the game.
  console.log("old id:", currentGameRoomId, "new id:", gameRoomId)
  setTimeout(()=>{
    gameRooms[currentGameRoomId].gameStarted = true;

    gameRooms[currentGameRoomId].players.forEach(player => {
      if (player.websocket.readyState === WebSocket.OPEN) {
        message = {
          "type": "GAME_START",
          "data": {
            "game": 1
          }
        }
        player.websocket.send(JSON.stringify(message));
        
      }
    })

  }, 5000);
  console.log("Game will start in 5 seconds")
  console.log("Current players:", gameRooms[currentGameRoomId].players.length)
  // Notify players that the game will start in 5 seconds
  gameRooms[currentGameRoomId].players.forEach(player => {
    if (player.websocket.readyState === WebSocket.OPEN) {
      console.log('a')

      message = {
        "type": "GAME_READY",
        "data": {
          "timer": 5
        }
      }
      player.websocket.send(JSON.stringify(message));
    }
  });

}