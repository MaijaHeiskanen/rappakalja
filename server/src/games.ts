export enum GameState {
    Lobby,
    WritingWord,
    WritingDefinition,
    ValidatingDefinitions,

}

export enum PlayerState {
    SelectingName,
    NotReady,
    Ready,
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
}

export interface Point {
    playerSocketId: string;
    playerName: string;
    point: number;
}

export interface Vote {
    playerSocketId: string;
    playerName: string;
    definitionId: string;
}

export interface Game {
    room: string;
    bluff?: Player;
    players: Player[];
    gameState: GameState;
    word?: string;
    definitions: Definition[];
    points: Point[]
    votes: Vote[];
}

let games: Game[] = [];

export const getGames = (): Game[] => [...games];
export const setGames = (newGames: Game[]) => games = [...newGames];