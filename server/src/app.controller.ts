import { BadRequestException, Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { getGames, setGames, PlayerState, GameState, Game } from './games';
import { SocketGateway } from './socket.gateway';
import { generateNumberString } from './utils/generateNumberString';
import { shuffle } from './utils/shuffle';

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
      const newGame: Game = {
        room: newRoom,
        bluff: undefined, 
        players: [{socketId, name: '', state: PlayerState.SelectingName}], 
        gameState: GameState.Lobby, 
        word: '', 
        definitions: [], 
        allDefinitions: [],
        correctDefinition: undefined, 
        correctDefinitions: [], 
        points: [], 
        votes: []
      }
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

      if (socketId === game.bluff.socketId) {
        game.correctDefinition = newDefinition;
      } else {
        game.definitions.push(newDefinition);
      }
      game.allDefinitions.push(newDefinition);

      game.players[playerIndex].state = PlayerState.Ready;

      const everyPlayerReady = game.players.every(player => player.state !== PlayerState.NotReady);
      if (everyPlayerReady) {
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

  @Post('continueToVote')
  continueToVote(@Body('socketId') socketId: string, @Body('playerSocketIdsWithCorrectDefinitions') playerSocketIdsWithCorrectDefinitions: string[]) {
    if (playerSocketIdsWithCorrectDefinitions.length > 1) {
      throw new NotFoundException('Only one player can have the correct definition');
    }

    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    const game = games[gameIndex];
    const player = game.players[playerIndex];

    if (gameIndex != null && playerIndex != null) {
      if (game.gameState !== GameState.ValidatingDefinitions) {
        throw new NotFoundException('Game is not in the right state');
      }

      if (socketId !== game.bluff.socketId) {
        throw new NotFoundException('Not the bluff');
      }

      for (const playerSocketId of playerSocketIdsWithCorrectDefinitions) {
        const definitionIndex = game.definitions.findIndex(def => def.playerSocketId === playerSocketId);
        const allDefinitionIndex = game.allDefinitions.findIndex(def => def.playerSocketId === playerSocketId);
        if (definitionIndex === -1) {
          throw new NotFoundException('Definition not found');
        }

        const correctDef = game.definitions.splice(definitionIndex, 1);
        game.allDefinitions.splice(allDefinitionIndex, 1);

        game.correctDefinitions.push(correctDef[0]);
      }

      game.gameState = GameState.Voting;

      game.players.forEach(player => player.state = PlayerState.NotReady);
      game.correctDefinitions.forEach(def => {
        const readyplayer = game.players.find(player => player.socketId === def.playerSocketId);
        readyplayer.state = PlayerState.Ready;
      });
      player.state = PlayerState.Ready;
      game.allDefinitions = shuffle(game.allDefinitions);

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);

      return game;
    }

    throw new NotFoundException();
  }

  @Post('abortRound')
  abortRound(@Body('socketId') socketId: string, @Body('playerSocketIdsWithCorrectDefinitions') playerSocketIdsWithCorrectDefinitions: string[]) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    const game = games[gameIndex];
    const player = game.players[playerIndex];

    if (gameIndex != null && playerIndex != null) {
      if (game.gameState !== GameState.ValidatingDefinitions) {
        throw new NotFoundException('Game is not in the right state');
      }

      if (socketId !== game.bluff.socketId) {
        throw new NotFoundException('Not the bluff');
      }

      for (const playerSocketId of playerSocketIdsWithCorrectDefinitions) {
        const definitionIndex = game.definitions.findIndex(def => def.playerSocketId === playerSocketId);
        if (definitionIndex === -1) {
          throw new NotFoundException('Definition not found');
        }

        const correctDef = game.definitions.splice(definitionIndex, 1);

        game.correctDefinitions.push(correctDef[0]);
      }

      game.points = this.appService.calculatePoints(game);
      game.gameState = GameState.RoundEnd;

      player.state = PlayerState.NotReady;

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);

      return game;
    }

    throw new NotFoundException();
  }

  @Post('vote')
  vote(@Body('socketId') socketId: string, @Body('definitionId') definitionId: string) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    const game = games[gameIndex];
    const player = game.players[playerIndex];

    if (gameIndex == null || playerIndex == null) {
      throw new NotFoundException('Game or player not found');
    }

    const definition = game.allDefinitions.find(def => def.id === definitionId);
    console.log(definition);
    

    if (definition == null) {
      throw new NotFoundException('Definition not found');
    }

    if (definition.playerSocketId === socketId) {
      throw new NotFoundException('You cannot vote for your own definition', 'Et voi äänestää omaa arvaustasi');
    }

    game.votes.push(
      {
        playerSocketId: socketId,
        playerName: player.name,
        definitionId
      }
    )

    player.state = PlayerState.Ready;

    const everyPlayerReady = game.players.every(player => player.state !== PlayerState.NotReady);
      if (everyPlayerReady) {
        game.gameState = GameState.RoundEnd;

        const bluffPlayerIndex = game.players.findIndex(player => player.socketId === game.bluff.socketId);

        game.players[bluffPlayerIndex].state = PlayerState.NotReady;
        game.points = this.appService.calculatePoints(game);
      }

    setGames(games);
    this.socketGateway.updateToRoom(game.room, game);

    return game;
  }

  @Post('endRound')
  endRound(@Body('socketId') socketId: string) {
    const games = getGames();

    const {gameIndex, playerIndex} = this.appService.getGameIndexAndPlayerIndex(games, socketId);

    const game = games[gameIndex];
    const player = game.players[playerIndex];

    if (gameIndex != null && playerIndex != null) {
      if (game.gameState !== GameState.RoundEnd) {
        throw new NotFoundException('Game is not in the right state');
      }

      if (socketId !== game.bluff.socketId) {
        throw new NotFoundException('Not the bluff');
      }

      game.gameState = GameState.Lobby;
      game.definitions = [];
      game.word = '';
      game.bluff = undefined;
      game.points = [];
      game.votes = [];
      game.allDefinitions = [];
      game.correctDefinition = undefined;
      game.correctDefinitions = [];

      player.state = PlayerState.Ready;

      setGames(games);
      this.socketGateway.updateToRoom(game.room, game);

      return game;
    }

    throw new NotFoundException('Game or player not found');
  }
}


