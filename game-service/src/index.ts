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
const app = express();
app.use(cors())
const port: number = 5000;
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });
const languages = ["c", "cpp", "csharp", "go", "html", "java", "javascript", "kotlin", "python", "typescript"]


let gameStartTimeouts: { [gameRoomId: string]: NodeJS.Timeout } = {};
let gameRooms: GameStates = {}; // to store game room information
let gameRoomId = uuidv4();
let message = {}
let startTime: number;
let snippets: any;
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

    app.listen(port, () => {
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

  for (let snippet of snippets) {
    allCode[snippet.language].push(snippet.code)
  }

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {

    const urlParams = new URLSearchParams(request.url);
    const name = urlParams.get('name');
  
    const player: Player = {
      name: name || 'guest',  
      id: uuidv4(),  // this will be used only by the user
      game_id: uuidv4(),  // this will be used by all to identify the players.
      words: 0,
      mistakes: 0,
      websocket: ws,
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
      
      gameRooms[gameRoomId] = { players: [], gameStarted: false, Snippet: randomSnippet  };
    }
  
    gameRooms[gameRoomId].players.push(player)
  
    let data = {
      gameRoomId: gameRoomId,
      Snippet: gameRooms[gameRoomId].Snippet.replace(/\t/g, "    "),
      players: gameRooms[gameRoomId].players.map(player => ({
        name: player.name,
        game_id: player.game_id,
        words: player.words,
        mistakes: player.mistakes
      }))
    };
  
    message = {
      "type": "UPDATE_PLAYER_STATE",
      "data": data
    }
  
    // for each player send the players in there.
    gameRooms[gameRoomId].players.forEach(player => {
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
      console.log(`Received message ${message} from game room ${gameRoomId}`);
  
      // broadcast message to all clients in the game room
      gameRooms[gameRoomId].players.forEach(player => {
        if (player.websocket !== ws && player.websocket.readyState === WebSocket.OPEN) {
          player.websocket.send(message);
        }
      });
    });
  
    ws.on('close', () => {
      // handle client disconnection
      console.log('socket closed!')
    });
    
  });
}

startApp();



function startGame() {
  let currentGameRoomId = gameRoomId;
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