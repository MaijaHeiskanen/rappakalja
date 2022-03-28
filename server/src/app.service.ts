import { Injectable } from '@nestjs/common';
import { Game } from './games';

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
        console.log({playerId: player.socketId, socketId, gameIndex: gIndex, playerIndex: index});
        
        if (player.socketId === socketId) {
          gameIndex = gIndex;
          playerIndex = index;
        }
      });
    });

    return {gameIndex, playerIndex};
  }
}
