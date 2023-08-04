import { IncomingMessage } from "http";
import { GameStates } from "./interfaces/gameState";
import Player from "./interfaces/player";
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';
const port: number = 5000;
const wss = new WebSocket.Server({ port: port });

let gameStartTimeouts: { [gameRoomId: string]: NodeJS.Timeout } = {};
let gameRooms: GameStates = {}; // to store game room information
let gameRoomId = uuidv4();
let message = {}
let startTime: number;
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
    gameRooms[gameRoomId] = { players: [], gameStarted: false };
  }

  gameRooms[gameRoomId].players.push(player)

  let data = {
    gameRoomId: gameRoomId,
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


function startGame() {
  let currentGameRoomId = gameRoomId;
  gameRoomId = uuidv4();  // Generate new gameRoomId immediately
  // after 5 seconds start the game.
  console.log("old id:", currentGameRoomId, "new id:", gameRoomId)
  setTimeout(()=>{gameRooms[currentGameRoomId].gameStarted = true;}, 5000);
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