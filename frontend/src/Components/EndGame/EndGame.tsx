import WpmChart from "./WPMChart";
import './EndGame.css'
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { Button } from "react-bootstrap";
import replay from '../../media/new_game_gif.gif'

interface childProps {
  wpm: number,
  mistakes: number,
  wpmArray: number[],
  time: number,
  accuracy: number,
  changeGameState: Dispatch<SetStateAction<boolean>>
}

const EndGame: React.FC<childProps>= (props) => {
  const navigate = useNavigate()
  return (
    <div>

      <div className="results">
        <span className="metric">
          <div className="metric-title">words per minute</div>
          <div className="metric-var">{props.wpm}</div>
        </span>

        <span className="metric">
          <div className="metric-title">time</div> 
          <div className="metric-var">{props.time}s</div>
        </span>
        <span className="metric">
          <div className="metric-title">mistakes</div>
          <div className="metric-var">{props.mistakes}</div>
        </span>
        <span className="metric">
          <div className="metric-title">accuracy</div>
          <div className="metric-var">{props.accuracy}%</div>
        </span>

      </div>

      <div className="chart-container">
        <WpmChart data={props.wpmArray}></WpmChart>
      </div>

      <br></br>
      <span className="end-button rotate" onClick={()=>{props.changeGameState(true)}}>new game &#160;<span className="refresh">&#8635;</span></span>
      <span className="end-button shift" onClick={()=>{navigate('/')}}>home &#160;<span className="home-button">&#8592;</span></span>

    </div>
  )

}

export default EndGame;