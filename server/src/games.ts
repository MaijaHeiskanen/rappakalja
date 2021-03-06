export enum GameState {
  Lobby,
  WritingWord,
  WritingDefinition,
  ValidatingDefinitions,
  Voting,
  RoundEnd,
}

export enum PlayerState {
  SelectingName,
  NotReady,
  Ready,
  Disconnected,
}

export interface Player {
  socketId: string;
  name: string;
  state: PlayerState;
}

export interface Definition {
  id: string;
  playerSocketId: string;
  playerName: string;
  definition: string;
  votes: Vote[];
}

export interface Points {
  playerSocketId: string;
  playerName: string;
  points: number;
}

export interface Vote {
  playerSocketId: string;
  playerName: string;
}

export interface Game {
  room: string;
  bluff?: Player;
  players: Player[];
  gameState: GameState;
  word?: string;
  definitions: Definition[];
  allDefinitions: Definition[];
  correctDefinition?: Definition;
  correctDefinitions: Definition[];
  points: Points[];
  roundAborted?: boolean;
}

let games: Game[] = [];

export const getGames = (): Game[] => [...games];
export const setGames = (newGames: Game[]) => (games = [...newGames]);
