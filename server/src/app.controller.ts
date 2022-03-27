import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
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

      console.log('create', games);
      

      return newGame;
    }
  }

  @Post('join')
  joinRoom(@Body('socketId') socketId: string, @Body('room') room: string) {
    const games = getGames();

    const game = games.find(game => game.room === room);

    console.log('join', {room});
    console.log('join', {games});
    console.log('join', {game});
    

    if (game) {
      this.socketGateway.joinRoom(socketId, room);

      return game;
    }

    throw new NotFoundException();
    
  }

  @Post('leave')
  leaveRoom(room: string, socketId: string) {
    this.socketGateway.leaveRoom(room, socketId);
  }
}

