import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './Components/Customizable-Button/Button';

interface player {
  name: string,
  words: string,
  mistakes: string,
  game_id: string
}

function App() {

  const [gameRoomId, setGameRoomId] = useState('')
  const [players, setPlayers] = useState<player[]>([])
  const [absoluteGameTimer, setAbsoluteGameTimer] = useState(0)
  const [gameTimer, setGameTimer] = useState(10000)
  const [lookingForGame, setLookingForGame] = useState(false)
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(()=> {
    if (absoluteGameTimer){
      intervalId.current = setInterval(changeTimer, 100)
    }
  
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [absoluteGameTimer]);
  
  useEffect(() => {
    if (gameTimer < 0){
      if (intervalId.current) {
        clearInterval(intervalId.current);
        console.log("Interval is less than 0.")
        setGameTimer(0)
      }
    }
  }, [gameTimer]);
  
  function establishConnection() {
    setLookingForGame(true)
    let ws = new WebSocket('ws://localhost:5000');

    ws.onopen = function() {
      console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {
      console.log('Received message from server:', event.data);

      let message = JSON.parse(event.data);

      switch(message.type) {
        case "UPDATE_PLAYER_STATE":
          // Handle player state update
          setGameRoomId(message.data.gameRoomId)
          setPlayers(message.data.players)
          break;
        case "TIMER":
          // Get timestamp for when game will start.
          setAbsoluteGameTimer(message.data.startTime)
          break;
        case "GAME_READY":
          // Handle game start
          console.log("Game is starting!");
          break;
        default:
          // Handle unknown message type
          console.log("Received unknown message type: ", message.type);
      }
    };

    ws.onerror = function(error) {
      console.error('WebSocket error:', error);
    };
  }

  function changeTimer() {
    console.log("The absolute", absoluteGameTimer)
      setGameTimer(absoluteGameTimer - Date.now())
  }
  return (
    <div className="App">
      {lookingForGame && <div>
        Looking for players: {Math.floor(gameTimer/1000)}
      </div>}
      <div className='main-game'>
          <div>
            <div>{gameRoomId}</div>
            {
              players.map(player => (
                  <div> 
                    <div>{player.name}</div>
                    <div>{player.words}</div>
                    <div>{player.mistakes}</div>
                  </div>
                )
              )
            }
          </div>
      </div>
      <Button onClick={establishConnection}>Enter a Game</Button>
    </div>
  );
}

export default App;
