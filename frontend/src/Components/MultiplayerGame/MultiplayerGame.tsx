import React, { useEffect, useRef, useState } from 'react';
import Button from '../Customizable-Button/Button';
import './MultiplayerGame.css'
import { useNavigate, useParams } from 'react-router-dom';
import EndGame from '../EndGame/EndGame';

interface player {
  name: string,
  words: string,
  mistakes: string,
  game_id: string
}

function MultiplayerGame() {
  const navigate = useNavigate();
  const { language } = useParams();
  const [snippet, setSnippet] = useState('')
  const [userInput, setUserInput] = useState<string[]>([])
  const userInputRef = useRef<string[]>([]);
  const codeRef = useRef<string>("");
  const checkpointRef = useRef<{ [currLocation: number]: number }>({})
  const [start, setStart] = useState(false)
  const initTime = useRef<number>(0);
  const [time, setTime] = useState(0);
  const [intervalID, setIntervalID] = useState<any>(null)
  const gameDivRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(true)
  const [mistakeStart, setMistakeStart] = useState<null | number>(null)
  const wpmArrayRef = useRef<number[]>([]);
  const [gamestate, setGamestate] = useState<boolean>(true)
  const mistakesRef = useRef<number>(0);

  interface progress {
    playerID: string,
    progress?: string,
    name: string,
    WPM?: string,
    place?: string,
    color: string
  }

  const gameRoomIdRef = useRef<string>('')
  const [players, setPlayers] = useState<player[]>([])
  const [absoluteGameTimer, setAbsoluteGameTimer] = useState(0)
  const [gameTimer, setGameTimer] = useState(10000)
  const [lookingForGame, setLookingForGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [listener, setListener] = useState(false)
  const gameIdIntervalRef = useState<any>()
  const wordCheckRef = useRef<string[]>([])
  const playerIdRef = useRef<string>()
  const wsRef = useRef<WebSocket | null>(null)
  const wsIntervalRef = useRef<NodeJS.Timer>()
  const [progress, setProgress] = useState<progress[]>([])
  const progressRef = useRef<progress[]>([])
  const progressIntervalRef = useRef<NodeJS.Timer>()


  useEffect(() => {
    if (gamestate){
      setSnippet('')
      initTime.current = 0
      mistakesRef.current = 0
      setStart(false)
      setUserInput([])
      userInputRef.current = []
      wpmArrayRef.current = []
      wordCheckRef.current = []
      clearInterval(intervalID)
      if (gameDivRef.current) {
        gameDivRef.current.focus();
      }
      codeRef.current = "";
      for (const prop in checkpointRef.current) {
        if (checkpointRef.current.hasOwnProperty(prop)) {
            delete checkpointRef.current[prop];
        }
    }

    }
  }, [gamestate])


  useEffect(() => {
    if (gameDivRef.current) {
      gameDivRef.current.focus();
    }
  }, []);

  // clean up use effect to get rid of the websocket connection
  // and the interval code upon dismount so that it doesn't bleed
  // resources and spam network connections.

  useEffect(() => {
    return () => {
            console.log("Closing socket");
            
            // Send a message to inform the backend
            if (wsRef && wsRef.current) {
            const message = JSON.stringify({
                "type": "LEAVING_GAME",
                gameRoomId: gameRoomIdRef.current,
                playerId: playerIdRef.current
            });
            
            wsRef.current.send(message);
            
            // Give the server a little time to process the message before closing
            setTimeout(() => {
              if (wsRef && wsRef.current)
                wsRef.current.close();
            }, 100);
          }

        clearInterval(wsIntervalRef.current);
        console.log("Interval cleared");
    };
}, []);


  const keydownListener = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ignore tabs and meta keys like shift and ctrl
    e.stopPropagation();
    if (!start){
      setStart(true)
      setIntervalID(setInterval(()=>{
        let currTime = Math.floor((Date.now()-initTime.current)/ 1000);
        console.log("TIME", currTime)
        setTime(currTime)
        if (currTime > wpmArrayRef.current.length) {
          let diff = currTime - wpmArrayRef.current.length
          for (let i = 0; i < diff; i++) {
            wpmArrayRef.current.push(Math.round(60*(userInputRef.current.length/(5*(wpmArrayRef.current.length + i + 1)))))
          }

        }
      }, 50))
    }
    if (['Shift', 'Control', 'Alt'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (["'", '/'].includes(e.key)) {
      e.preventDefault();
    }
    let updatedInput = [...userInputRef.current];
    let codeArray = codeRef.current.split('')
    
    if (mistakeStart === null && userInput.length + 1 === codeArray.length && e.key === codeArray[codeArray.length - 1]) {
      setGamestate(false)
      clearInterval(intervalID)
    }
    if (e.key === 'Backspace') {

      // so if user hits backspace on new line, we want them to go back to the previous line. There
      // is \n, and spaces, so we have to take those into account.
      if (updatedInput.length-1 in checkpointRef.current){
        // pop the difference between checkpoint
        // the reason -1 is added is because even though it checkpoint[updatedInput.length -1]
        // is the index of the character before the \n, we always hover over the character after that.
        // so we have to move it back one more.
        const destinationIndex = checkpointRef.current[updatedInput.length-1] - 1
        while (updatedInput.length-1 != destinationIndex) {
          updatedInput.pop()
        }

        if (gameDivRef.current) {
          gameDivRef.current.scrollTop -= 30;
        }

    }
    else { 
      updatedInput.pop()
    }
      // if we undo the mistake get rid of the
      // mistake start index.
      console.log('mistakes', mistakeStart, updatedInput)
      if (mistakeStart != null && updatedInput.length - 1 <= mistakeStart) {
        console.log('set to null', updatedInput.length - 1, mistakeStart)
        setMistakeStart(null)
      }
      wordCheckRef.current.push('Backspace ' + updatedInput.length)
    }
    else if (e.key === 'Enter') {
      if (updatedInput[updatedInput.length-1] != codeArray[updatedInput.length-1]) {
        mistakesRef.current++;
      }
      updatedInput.push('\n')
      wordCheckRef.current.push('\n')

      if (updatedInput[updatedInput.length-1] === codeArray[updatedInput.length-1]) {
        if (gameDivRef.current) {
          gameDivRef.current.scrollTop += 30;
        }
      }

    }
    else {
      updatedInput.push(e.key)
      if (updatedInput[updatedInput.length-1] != codeArray[updatedInput.length-1]) {
        mistakesRef.current++;
      }
      wordCheckRef.current.push(e.key)

    }
    if (updatedInput.length < codeArray.length && codeArray[updatedInput.length-1] === '\n' && e.key != "Backspace") {
      let previous = updatedInput.length-2
      while (updatedInput.length < codeArray.length && codeArray[updatedInput.length] == ' ') {
        updatedInput.push(' ');
        wordCheckRef.current.push(' ')

      }
      checkpointRef.current[updatedInput.length-1] = previous;
    }
    setUserInput(updatedInput);
    userInputRef.current = updatedInput;
  }

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
        setGameTimer(0)
      }
    }
  }, [gameTimer]);
  
  function establishConnection() {
    setLookingForGame(true)
    let ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;

    ws.onopen = function() {
      console.log('WebSocket connection established');
    };

    ws.onmessage = function(event) {

      let message = JSON.parse(event.data);

      switch(message.type) {
        case "UPDATE_PLAYER_STATE":
          // Handle player state update
          progressRef.current = message.data.players.map((player: any) => ({name: player.name, playerID: player.game_id, color: getRandomColor()}))
          setProgress(progressRef.current)
          console.log("All players", message.data)
          console.log("progress REF", progressRef.current)
          console.log("Got gameroom id", message.data.gameRoomId)
          setSnippet(message.data.Snippet)
          codeRef.current = message.data.Snippet;
          gameRoomIdRef.current = message.data.gameRoomId
          setPlayers(message.data.players)
          playerIdRef.current = message.data.playerId
          break;
        case "TIMER":
          // Get timestamp for when game will start.
          setAbsoluteGameTimer(message.data.startTime)
          break;
        case "GAME_READY":
          // Handle game start
          // Instead of this, let the server send
          // the time with the 5 seconds added instead.
          // It might be better to keep it this way
          // so that when the game start message appears
          // you have some time to react. But then again
          // if we get the time from the server side, we
          // are guaranteed to start pastt that time any
          // way so either way shouldn't be a problem.
          setAbsoluteGameTimer(Date.now() + 5000)
          initTime.current = Date.now() + 5000;
          setLookingForGame(false)
          setInGame(true)
          break;
        case "GAME_START":
          // Handle game start
          // start the game. dont wait for user to type
          // thats only for the single player game.
          setStart(true)

          // we also make sure that the set interval that changes
          // the timer is also available after the game starts.

          setIntervalID(setInterval(()=>{
            let currTime = Math.floor((Date.now()-initTime.current)/ 1000);
            console.log("TIME", currTime)
            setTime(currTime)
            if (currTime > wpmArrayRef.current.length) {
              let diff = currTime - wpmArrayRef.current.length
              for (let i = 0; i < diff; i++) {
                wpmArrayRef.current.push(Math.round(60*(userInputRef.current.length/(5*(wpmArrayRef.current.length + i + 1)))))
              }
    
            }
          }, 50))

          wsIntervalRef.current = setInterval(() => {
            console.log("SENDING THE GAME ROOM ID", gameRoomIdRef.current, wordCheckRef)
            const gameRoomId = gameRoomIdRef.current
            const playerId = playerIdRef.current
            const words = wordCheckRef.current
            const message = JSON.stringify({ gameRoomId, playerId, words });
            wordCheckRef.current = []
            if (ws.readyState === WebSocket.OPEN) {
              console.log("SENT THE MESSAGE")
              ws.send(message);
            }
          }, 250);

          progressIntervalRef.current = setInterval(()=> {
            setProgress(progressRef.current)
          }, 1000)
          if (gameDivRef.current) {
            setListener(true)
        }
          break;

        case "WORDS":
          console.log(message.data.progress)
          // // if it is the old values from pre - game start delete it entirely.
          // if (progressRef.current.length && !progressRef.current[0].WPM){
          //   progressRef.current = []
          // }
          for (let i = 0; i < message.data.progress.length; i++){
            const playerProgress = message.data.progress[i];
            let progressObj: progress = { playerID: playerProgress.game_id, progress: Math.floor(playerProgress.progress * 90).toString() + '%', name: playerProgress.name, WPM: playerProgress.wpm, place: '0', color: 'random-color' }
            // we will update the playerProgress Array with the values with the updated
            // server verified wpm, mistakes, and progress.
            updateProgressArray(progressObj);
          }
            // progressRef.current = message.data.progress.progress.toString() + '%'
          break;
          
        default:
          // Handle unknown message type
      }
    };

    ws.onerror = function(error) {
      console.error('WebSocket error:', error);
    };
  }

  function changeTimer() {
      setGameTimer(absoluteGameTimer - Date.now())
  }

  // updates the progress array which is what we use to display the user updates in
  // real time.
  
  function updateProgressArray(newData: progress) {
    console.log("COMPARE", progressRef.current, "NEW DATA", newData)
      const index = progressRef.current.findIndex((existingObj) => existingObj.playerID === newData.playerID);
  
      if (index > -1) {
        // Update the existing object
        progressRef.current[index] = { playerID: newData.playerID, progress: newData.progress, name: newData.name, WPM: newData.WPM, place: newData.place, color: progressRef.current[index].color };
      } else {
        // Add new object
        progressRef.current.push(newData);
      }
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomColor() {
    const r = getRandomInt(50, 205);
    const g = getRandomInt(50, 205);
    const b = getRandomInt(50, 205);
    return `rgb(${r},${g},${b})`;
  }

  return (
    <div className="App">
      {lookingForGame && <div className='game-looking'>
        Looking for players: {Math.floor(gameTimer/1000)} s
      </div>}
      {inGame && <div className='game-timer'>
        Game starts in: {Math.floor(gameTimer/1000)} s
      </div>}
      <div className="singleplayer-page">
      {gamestate ?
    (<div className='main-game'>
      <div>
        {/* js */}
        
      <div className="languages">
      {start && <span className="timer">{time}s</span>}
      </div>
      {/* We want to add some kind of box around the users that fits the content and looks like some kind of race track. */}
        <div style={{border: '1px solid green', margin: '5px', borderRadius: '10px'}}>
          {progress.map((player) => {
            return (
              <>
                {player.progress ? 
                  <div style={{ position: 'relative', margin: '5px', display: 'flex', alignItems: 'center' }}>
                    <span className='movable-player' style={{ position: 'relative', left: 'min(' + player.progress + ', ' + '90%)', padding: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div>
                        {player.name}
                      </div>
                      <img 
                        style={{borderRadius: '50%', backgroundColor: player.color, padding: '3px'}} 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAACXBIWXMAAAsTAAALEwEAmpwYAAABeElEQVR4nM3UPUgcURTF8R+EIIaAaBQEC1EsgiEWASsLmxQpUghhSwtBUEhjI9prmQ+wEERsDdgIQiqLlCJICCmsIqRJExexSW0YOMoUszLFbMiFs+++O+f+h/eWufzn8Qjb3YI/x2k3wL34hPWmgJP4iC/4jR08bAI8ix9Ywgv0aDA+5wW1YxRbOKihPzis4dsK11es4mWDWsVZAW/rTrSLn8tsdnGR43zDCZ6mVhxzPvl89hd5fhL/aGoF5457C9/HFcbwE+d4ltoeFpMvZn+V5+fxj6W2XwUfxng0gCfJi897JPmDrCOpj8c3UOodroIf4SbaxIfkr/LnFPlg1rPUb+LbLPUeVcE3cBwtYDn5dAZTkfdl3U79OL6FUu9GFXwGLTzGHF4H1rpHffHNpa8VTsdrmcA1fmGqdNwqTcV3nb6O1/IGa+jHCt5iKLVOGopvJX1r4dxx2xmdTUbv7Uf0Ht9rzpaDmip478ozusnZMtnwTfzj+AuoGZCd3wb3yAAAAABJRU5ErkJggg=="
                      ></img>
                    </span>
                    <span style={{ position: 'absolute', right: 0, marginRight: '5px' }}>
                      {player.WPM}
                    </span>
                  </div>
                    :
                  <div style={{ position: 'relative', margin: '5px', display: 'flex', alignItems: 'center' }}>
                    <span className='movable-player' style={{ position: 'relative', left: 'min(' + player.progress + ', ' + '90%)', padding: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div>
                        {player.name}
                      </div>
                      <img 
                        style={{borderRadius: '50%', backgroundColor: player.color, padding: '3px'}} 
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAACXBIWXMAAAsTAAALEwEAmpwYAAABeElEQVR4nM3UPUgcURTF8R+EIIaAaBQEC1EsgiEWASsLmxQpUghhSwtBUEhjI9prmQ+wEERsDdgIQiqLlCJICCmsIqRJExexSW0YOMoUszLFbMiFs+++O+f+h/eWufzn8Qjb3YI/x2k3wL34hPWmgJP4iC/4jR08bAI8ix9Ywgv0aDA+5wW1YxRbOKihPzis4dsK11es4mWDWsVZAW/rTrSLn8tsdnGR43zDCZ6mVhxzPvl89hd5fhL/aGoF5457C9/HFcbwE+d4ltoeFpMvZn+V5+fxj6W2XwUfxng0gCfJi897JPmDrCOpj8c3UOodroIf4SbaxIfkr/LnFPlg1rPUb+LbLPUeVcE3cBwtYDn5dAZTkfdl3U79OL6FUu9GFXwGLTzGHF4H1rpHffHNpa8VTsdrmcA1fmGqdNwqTcV3nb6O1/IGa+jHCt5iKLVOGopvJX1r4dxx2xmdTUbv7Uf0Ht9rzpaDmip478ozusnZMtnwTfzj+AuoGZCd3wb3yAAAAABJRU5ErkJggg=="
                      ></img>
                    </span>
                  </div>
                }
                
              </>
              )
            
          })}

        </div>

        <div className="game-square code-snippet" ref={gameDivRef} tabIndex={-1} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={listener ? keydownListener : () => {}}> 
        {isFocused ? 
                  (<div>
                  {snippet && <pre>
                  {snippet.split('').map((ch, index) => {
                      let highlight = "";
                      let color = 'normal';
                      let br = '';
                      if (index === userInput.length){
                        highlight = '#7EC8E3'
                        color = 'highlight';
                        br = '4px';
                      }
                      if (ch === '\t') {
                        return (<span className={color} style={{position: 'relative', backgroundColor: highlight}}>{ch}</span>)
                      }
                      
                      if (index < userInput.length){
                        if (ch === userInput[index] && (mistakeStart === null || mistakeStart >= index) ) {
                          color = 'green';
                        } else {
                          color = 'red';
                          
                          if (mistakeStart === null) {
                            setMistakeStart(index)
                          }
                        }
                      }
                      return (<span className={color} style={{position: 'relative', backgroundColor: highlight, borderRadius: br}}>{ch}{((index + 1 < snippet.length && snippet[index+1] === '\n') && (index + 1 === userInput.length || (userInput.length > index + 1 && userInput[index+1] != '\n'))) ? (<img className="enter-button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADF0lEQVR4nO2dMW/TQBTHb4EsiI0B9Ut0QvBFQIIVxEK7IbEhMTGA4oAQK8JGlVLZDEgMHZASpNJKiV9I0/hycTtVTB2o0gxMh25AaqoUkmD7Xc7/n/S2Dnf/n9871zq1QgAAAAAAAAAAAAAAYBlKqUqcpOtxku7EMj0lmWrOMmswa2knwzWzNuEyNBisUDLscId+oYwkJbNG4SJKqYrN4Z+V4GQnxEm6zh3uzNUfPhKuESfDXfZgZ69vwjVimY4sCHa2MSTTkXANsiDYeUq4BlkQKgRI/mDRAZI/XIwgaX8J1yALQoUAyR8sOkDyh4sRJO0v4RpkQagQIPmDRQdI/nAxguT/BzQWdyYKAv5B1gFBwBzsKHUVAhhp9dVNCGAklulrCGCCBoPVWKa/IIAr/CQ9yuM1EYfwBfR6vSvt/vCWGTt5PPnOCbDtphqVSYDtN9XIZQHLclONXBWwVDfVpJMCluqmmnZPwBLdVCMXBXAHSBDAHyKhA+ypzt5A/7j9YuafxwjKMPy9Junj1cdzzXIIyCh8ufFFn1y7P/dhCgEZhH/4bEOfXrq70NsMBGQw78fnXiUhoOB5P4YA3nk/zrCyXqtzv4gdTpn3EFCggIPnm3pUuQcBnJ8ikrChf15/iA7g/BbU3f6uj288KWyWL1rOnQF0pjr7Sh89eAMB3E/ZwZRzgXtNpegA+su5wL2e0gmgc+cC91pKKYAW+BwNARaEROgAd0uUbQSRZQUBEgLYn0JCB/AHQa6OoFZfsW+SLK3WvspfQKPdZd8oWVrNdjd/AfWtJvtGydLa3GrkL+DVh4/6a9xj3yxZViYTk03uArwg0m/rnyBBToZvMjHZFCLAlLFtWs7MvTIezK2+0uY8NBmYLP7kUpgAVDQ1AwgIeB8OCAggoNTjSeRN1Y9G3Jv0LK1qEJ7kP4L8cJd7o56lVQ2i/P98fc0P17g36tla76P8/4FDrfa54vkhsW82sKz8kJ7W65dFEbx8V1+BhGgifJOJKBJj27ScmXtlPJirZs9+uG0yKOzJBwAAAAAAAAAAAABimfkNPiAVHMTW/YcAAAAASUVORK5CYII="></img>) : ''}</span>)
                  })}
                  </pre>}
                  </div>)
                :
                (<span>Click to focus</span>) }

        </div>
      </div>
    </div>) 
    :
    (
    <div className="endgame-container">
      <EndGame wpm={Math.floor(60 * (codeRef.current.length / (5 * time)))} wpmArray={wpmArrayRef.current} time={time} mistakes={mistakesRef.current} accuracy={Math.floor(100 * (codeRef.current.length - mistakesRef.current)/codeRef.current.length)} changeGameState={setGamestate}/>
    </div>)
    }
  </div>
      <Button onClick={establishConnection}>Enter a Game</Button>
    </div>
  );
}

export default MultiplayerGame;