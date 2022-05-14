import { Injectable } from '@nestjs/common';
import { Game, PlayerState, Points, Player, GameState } from './games';
import { PLAYED_CORRECT_DEFINITION, VOTED_CORRECT_DEFINITION, OTHER_PLAYER_VOTED_YOUR_DEFINITION, NO_PLAYER_PLAYED_OR_VOTED_CORRECT_DEFINITION } from './constants/points';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getGame(games: Game[], room: string) {
    return games.find(game => game.room === room);
  }

  getGameIndexAndPlayerIndex(games: Game[], socketId: string): {gameIndex: number | null, playerIndex: number | null} {
    let gameIndex = null;
    let playerIndex = null;

    games.forEach((game, gIndex) => {
      game.players.forEach((player, index) => {
        if (player.socketId === socketId) {
          gameIndex = gIndex;
          playerIndex = index;
        }
      });
    });

    return {gameIndex, playerIndex};
  }

  calculatePoints(game: Game) {
    const players = game.players;
    const votes = game.votes;
    const points: Points[] = [];
    const correctDefinitions = game.correctDefinitions;
    const correctDefinition = game.correctDefinition;
    let noPlayerPlayedOrVotedCorrectDefinition = correctDefinitions.length === 0 && votes.length > 0;

    players.forEach((player) => {
      points.push({
        playerSocketId: player.socketId,
        playerName: player.name,
        points: 0
      });
    })

    correctDefinitions.forEach((correctDefinition) => {
      const playerPoints = points.find(point => point.playerSocketId === correctDefinition.playerSocketId);
      playerPoints.points += PLAYED_CORRECT_DEFINITION;
    });

    votes.forEach((vote) => {
      if (vote.definitionId === correctDefinition.id) {
        const playerPoints = points.find(point => point.playerSocketId === vote.playerSocketId);
        playerPoints.points += VOTED_CORRECT_DEFINITION;
        noPlayerPlayedOrVotedCorrectDefinition = false;
      } else {
        const playerSocketId = game.allDefinitions.find(definition => definition.id === vote.definitionId).playerSocketId;
        const playerPoints = points.find(point => point.playerSocketId === playerSocketId);
        playerPoints.points += OTHER_PLAYER_VOTED_YOUR_DEFINITION;
      }
    });

    if (noPlayerPlayedOrVotedCorrectDefinition) {
      const bluff = points.find(point => point.playerSocketId === game.bluff.socketId);
      bluff.points += NO_PLAYER_PLAYED_OR_VOTED_CORRECT_DEFINITION;
    }

    points.sort((a, b) => {
      return b.points - a.points;
    });

    return points;
  }

  removeDisconnectedPlayers(game: Game) {
    return game.players.filter(player => player.state !== PlayerState.Disconnected);
  }

  setPlayerReadyIfNotDisconnected(player: Player) {
    if (player.state !== PlayerState.Disconnected) {
      player.state = PlayerState.Ready;
    }

    return player;
  }

  setPlayerNotReadyIfNotDisconnected(player: Player) {
    if (player.state !== PlayerState.Disconnected) {
      player.state = PlayerState.NotReady;
    }

    return player;
  }

  playerHasWrittenDefinition(game: Game, name: string): boolean {
    return game.definitions.find(definition => definition.playerName === name) !== undefined;
  }

  playerHasVoted(game: Game, name: string): boolean {
    return game.votes.find(vote => vote.playerName === name) !== undefined;
  }

  getStateOfJoiningPlayer(game: Game, name: string): PlayerState {
    const playerIsBluff = game.bluff?.name === name;

    if (playerIsBluff) {
      switch (game.gameState) {
        case GameState.WritingDefinition:
          return game.correctDefinition ? PlayerState.Ready : PlayerState.NotReady;
        case GameState.WritingWord:
          game.word ? PlayerState.Ready : PlayerState.NotReady;
        case GameState.ValidatingDefinitions:
        case GameState.RoundEnd:
          return PlayerState.NotReady;
        case GameState.Voting:
        case GameState.Lobby:
          return PlayerState.Ready;
        default:
          return PlayerState.Ready;
      }
    } else {
      switch (game.gameState) {
        case GameState.WritingDefinition:
          return this.playerHasWrittenDefinition(game, name) ? PlayerState.Ready : PlayerState.NotReady;
        case GameState.Voting:
          return this.playerHasVoted(game, name) ? PlayerState.Ready : PlayerState.NotReady;
        case GameState.Lobby:
        case GameState.WritingWord:
        case GameState.ValidatingDefinitions:
        case GameState.RoundEnd:
        default:
          return PlayerState.Ready;
      }
    }
  }

}
