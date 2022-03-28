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
      this.socketGateway.updateToRoom(newRoom, newGame);

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

      setGames(games)
      this.socketGateway.updateToRoom(room, game);

      return game;
    }

    throw new NotFoundException();
    
  }

  @Post('leave')
  leaveRoom(@Body('socketId') socketId: string, @Body('room') room: string) {
    this.socketGateway.leaveRoom(room, socketId);
  }

  @Post('setName')
  setName(@Body('socketId') socketId: string, @Body('name') name: string) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    console.log({gameIndex, playerIndex, socketId, name});
    
    

    if (gameIndex != null && playerIndex != null) {
      const game = games[gameIndex];

      game.players[playerIndex].name = name;
      game.players[playerIndex].state = PlayerState.Ready;

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);


      return game;
    }

    throw new NotFoundException();
    
  }

  @Post('startRound')
  startRound(@Body('socketId') socketId: string) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    if (gameIndex != null) {
      const game = games[gameIndex];

      if (game.gameState !== GameState.Lobby) {
        throw new NotFoundException('Game has already started');
      }

      game.gameState = GameState.WritingWord;
      game.bluff = game.players[playerIndex];
      game.players[playerIndex].state = PlayerState.NotReady;

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);

      return game;
    }

    throw new NotFoundException();
  }

  @Post('setWord')
  setWord(@Body('socketId') socketId: string, @Body('word') word: string) {
    const games = getGames();

    const {gameIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    const game = games[gameIndex];

    if (game.bluff.socketId !== socketId) {
      throw new NotFoundException('Not the bluff');
    }

    if (gameIndex != null) {
      if (game.gameState !== GameState.WritingWord) {
        throw new NotFoundException('Game is not in the right state');
      }

      game.word = word;
      game.gameState = GameState.WritingDefinition;
      game.players.forEach(player => player.state = PlayerState.NotReady);

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);

      return game;
    }

    throw new NotFoundException();
  }

  @Post('setDefinition')
  setDefinition(@Body('socketId') socketId: string, @Body('definition') definition: string) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    const game = games[gameIndex];
    const player = game.players[playerIndex];
    let id: string | undefined;
    let temp: string | undefined;

    for (let i = 0, len = 1000; i < len; i++) {
      temp = generateNumberString(4);
      if (game.definitions.every(definition => definition.id !== temp)) {
        id = temp;

        break;
      }

    }

    const newDefinition = {id, definition, playerSocketId: socketId, playerName: player.name};

    if (gameIndex != null && playerIndex != null) {
      if (game.gameState !== GameState.WritingDefinition) {
        throw new NotFoundException('Game is not in the right state');
      }

      game.definitions.push(newDefinition);
      game.players[playerIndex].state = PlayerState.Ready;

      if (game.players.every(player => player.state !== PlayerState.NotReady)) {
        game.gameState = GameState.ValidatingDefinitions;

        const bluffPlayerIndex = game.players.findIndex(player => player.socketId === game.bluff.socketId);

        game.players[bluffPlayerIndex].state = PlayerState.NotReady;

      }

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);

      return game;
    }

    throw new NotFoundException();
  }


}
