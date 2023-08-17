import Player from "./player";

export interface GameStates {
  [gameRoomId: string]: game;
}

export interface game {
  players: Player[];
  gameStarted: boolean;
  Snippet: string;
}
