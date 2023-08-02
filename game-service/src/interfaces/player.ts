import { WebSocket } from 'ws';
interface Player {
  id: string,
  game_id: string,
  name: string,
  words: number,
  mistakes: number,
  websocket: WebSocket,
}

export default Player