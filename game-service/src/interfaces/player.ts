import { WebSocket } from 'ws';
interface Player {
  id: string,
  game_id: string,
  name: string,
  words: number,
  mistakes: number,
  currMistakes: number,
  websocket: WebSocket,
  playerSnippet: string[]
}

export default Player