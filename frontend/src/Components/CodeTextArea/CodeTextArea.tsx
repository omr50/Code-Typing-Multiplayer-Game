import React, { useEffect, useRef, useState } from 'react';
import Button from '../Customizable-Button/Button';
import './CodeTextAreaStyles.css'

interface player {
  name: string,
  words: string,
  mistakes: string,
  game_id: string
}

function CodeTextArea() {

  const [gameRoomId, setGameRoomId] = useState('')
  const [players, setPlayers] = useState<player[]>([])
  const [absoluteGameTimer, setAbsoluteGameTimer] = useState(0)
  const [gameTimer, setGameTimer] = useState(10000)
  const [lookingForGame, setLookingForGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  const [code, setCode] = useState("")
  const [userInput, setUserInput] = useState<string[]>([])
  const userInputRef = useRef<string[]>([]);
  const codeRef = useRef<string>("");
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(()=> {
    if (absoluteGameTimer) {
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
          let newSnippet = message.data.Snippet;
          setCode(newSnippet)
          codeRef.current = newSnippet
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
          // Instead of this, let the server send
          // the time with the 5 seconds added instead.
          // It might be better to keep it this way
          // so that when the game start message appears
          // you have some time to react. But then again
          // if we get the time from the server side, we
          // are guaranteed to start pastt that time any
          // way so either way shouldn't be a problem.
          setAbsoluteGameTimer(Date.now() + 5000)
          setLookingForGame(false)
          setInGame(true)
          break;
        case "GAME_START":
          // Handle game start
          window.addEventListener('keydown', (e) => {
            // Ignore tabs and meta keys like shift and ctrl
            let updatedInput = [...userInputRef.current];
            let codeArray = codeRef.current.split('')
            console.log('updatedcode', codeArray)
            console.log('aaaa')
            if (['Shift', 'Control', 'Alt'].includes(e.key)) {
                e.preventDefault();
                return;
            }
            else if (e.key === 'Backspace') {
              updatedInput.pop()
            }
            else if (e.key === 'Enter') {
              updatedInput.push('\n')
            }
            else {
              updatedInput.push(e.key)
            }
            if (updatedInput.length < codeArray.length && codeArray[updatedInput.length-1] == '\n') {
              while (updatedInput.length < codeArray.length && codeArray[updatedInput.length] == ' ') {
                updatedInput.push(' ');
              }
            }
            setUserInput(updatedInput);
            userInputRef.current = updatedInput;
          })
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
        Looking for players: {Math.floor(gameTimer/1000)} s
      </div>}
      {inGame && <div>
        Game starts in: {Math.floor(gameTimer/1000)} s
      </div>}
      <div className='main-game'>
          <div>
            <div>{gameRoomId}</div>
            {
              players.map(player => (
                  <div> 
                    {code && <pre style={{fontSize:'22px'}}>
                      {
                        code.split('').map((ch, index) => {
                          let highlight = "";
                          if (index == userInput.length){
                            highlight = 'blue'
                          }
                          if (ch == '\t') {
                            return (<span style={{color: highlight ? 'white' : 'black', position: 'relative', backgroundColor: highlight}}>{ch}</span>)
                          }
                          if (index < userInput.length){
                            if (ch == userInput[index])
                              return (<span style={{color: 'green', position: 'relative', backgroundColor: highlight}}>{ch}</span>)
                            else
                              return (<span style={{color: 'red', position: 'relative', backgroundColor: highlight}}>{ch}</span>)
                          }
                          else {
                            return (<span style={{color: highlight ? 'white' : 'black', position: 'relative', backgroundColor: highlight}}>{ch}</span>)
                          }
                        })
                      }
                      </pre>}
                  </div>

                )
              )
            }
          </div>
          {/* <div>{player.name}</div>
          <div>{player.words}</div>
          <div>{player.mistakes}</div> */}
      </div>
      <Button onClick={establishConnection}>Enter a Game</Button>
    </div>
  );
}

export default CodeTextArea;