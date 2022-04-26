export enum GameState {
    Lobby,
    WritingWord,
    WritingDefinition,
    ValidatingDefinitions,
    Voting,
    RoundEnd
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

export interface Points {
    playerSocketId: string;
    playerName: string;
    points: number;
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
    allDefinitions: Definition[];
    correctDefinition?: Definition;
    correctDefinitions: Definition[];
    points: Points[]
    votes: Vote[];
}

let games: Game[] = [];

export const getGames = (): Game[] => [...games];
export const setGames = (newGames: Game[]) => games = [...newGames];