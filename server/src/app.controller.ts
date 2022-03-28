import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { getGames, setGames, PlayerState, GameState } from './games';
import { SocketGateway } from './socket.gateway';
import { generateNumberString } from './utils/generateNumberString';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly socketGateway: SocketGateway) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create')
  createRoom(@Body('socketId') socketId: string) {
    let newRoom: string | undefined;
    let temp: string | undefined;
    const games = getGames();

    for (let i = 0, len = 1000; i < len; i++) {
      temp = generateNumberString(4);
      if (games.every(game => game.room !== temp)) {
        newRoom = temp;

        break;
      }

    }

    if (newRoom) {
      this.socketGateway.joinRoom(socketId, newRoom);
      const newGame = {room: newRoom, bluff: undefined, players: [{socketId, name: '', state: PlayerState.SelectingName}], gameState: GameState.Lobby, word: '', definitions: [], points: [], votes: []}
      setGames([...games, newGame]);

      return newGame;
    }
  }

  @Post('join')
  joinRoom(@Body('socketId') socketId: string, @Body('room') room: string) {
    const games = getGames();

    const game = this.appService.getGame(games, room);

    if (game) {
      this.socketGateway.joinRoom(socketId, room);

      game.players.push({socketId, name: '', state: PlayerState.SelectingName});

      return game;
    }

    throw new NotFoundException();
    
  }

  @Post('leave')
  leaveRoom(@Body('socketId') socketId: string, @Body('room') room: string) {
    this.socketGateway.leaveRoom(room, socketId);
  }

  @Post('setname')
  setName(@Body('socketId') socketId: string, @Body('name') name: string) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    console.log({gameIndex, playerIndex, socketId, name});
    
    

    if (gameIndex != null && playerIndex != null) {
      const game = games[gameIndex];

      game.players[playerIndex].name = name;
      game.players[playerIndex].state = PlayerState.Ready;

      return game;
    }

    throw new NotFoundException();
    
  }
}
