import { IncomingMessage } from "http";
import { GameStates } from "./interfaces/gameState";
import Player from "./interfaces/player";
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

let gameStartTimeouts: { [gameRoomId: string]: NodeJS.Timeout } = {};
let gameRooms: GameStates = {}; // to store game room information
let gameRoomId = uuidv4();

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
    gameRooms[gameRoomId].players = [];
    gameRooms[gameRoomId].gameStarted = false;
  }

  gameRooms[gameRoomId].players.push(player)

  if (gameRooms[gameRoomId].players.length === 1) {
    // Start a 10 second timeout as soon as the first player joins
    gameStartTimeouts[gameRoomId] = setTimeout(startGame, 10000);
  } 
  else if (gameRooms[gameRoomId].players.length === 5) {
    // If all 5 players have joined before 10 seconds, clear the timeout and start the game
    clearTimeout(gameStartTimeouts[gameRoomId]);
    startGame();
  }

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
    gameRooms[gameRoomId].players = gameRooms[gameRoomId].players.filter(player => player.websocket !== ws);
  });
  
});


function startGame() {
  let currentGameRoomId = gameRoomId;
  gameRoomId = uuidv4();  // Generate new gameRoomId immediately
  // after 5 seconds start the game.
  setTimeout(()=>{gameRooms[currentGameRoomId].gameStarted = true;}, 5000);

  // Notify players that the game will start in 5 seconds
  gameRooms[currentGameRoomId].players.forEach(player => {
    if (player.websocket.readyState === WebSocket.OPEN) {
      player.websocket.send('Game will start in 5 seconds...');
    }
  });

}