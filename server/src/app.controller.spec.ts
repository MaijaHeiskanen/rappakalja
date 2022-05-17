import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket.gateway';
import * as request from 'supertest';
import { GameState, PlayerState } from './games';

describe('AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, SocketGateway],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('root', () => {
    it('Should return "Hello World!"', () => {
      return request(app.getHttpServer()).get('/').expect(200);
    });
  });

  describe('create', () => {
    it('Should return new game object', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require('./utils/generateNumberString');

      jest
        .spyOn(module, 'generateNumberString')
        .mockImplementation(() => '1234');

      return request(app.getHttpServer())
        .post('/create')
        .send({ socketId: 'socketId-1' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return error when could not generate unique room code', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require('./utils/generateNumberString');

      jest
        .spyOn(module, 'generateNumberString')
        .mockImplementation(() => '1234');

      return request(app.getHttpServer())
        .post('/create')
        .send({ socketId: 'socketId-2' })
        .expect(500);
    });

    it('Should return new game object when creating second game', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require('./utils/generateNumberString');

      jest
        .spyOn(module, 'generateNumberString')
        .mockImplementation(() => '2345');

      return request(app.getHttpServer())
        .post('/create')
        .send({ socketId: 'socketId-0' })
        .expect(201, {
          room: '2345',
          players: [
            {
              socketId: 'socketId-0',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });
  });

  describe('join', () => {
    it('Should return new game object with joined player #2', () => {
      return request(app.getHttpServer())
        .post('/join')
        .send({ socketId: 'socketId-2', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return new game object with joined player #3', () => {
      return request(app.getHttpServer())
        .post('/join')
        .send({ socketId: 'socketId-3', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return new game object with joined player #4', () => {
      return request(app.getHttpServer())
        .post('/join')
        .send({ socketId: 'socketId-4', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-4',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return new game object with joined player #5', () => {
      return request(app.getHttpServer())
        .post('/join')
        .send({ socketId: 'socketId-5', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-4',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-5',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return error if game is not found', () => {
      return request(app.getHttpServer())
        .post('/join')
        .send({ socketId: 'socketId-5', room: '4567' })
        .expect(404);
    });
  });

  describe('leave', () => {
    it('Should return new game object without the left player #5', () => {
      return request(app.getHttpServer())
        .post('/leave')
        .send({ socketId: 'socketId-5', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-4',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });
  });

  describe('setName', () => {
    it('Should return game object with the player name #1', () => {
      return request(app.getHttpServer())
        .post('/setName')
        .send({ socketId: 'socketId-1', name: 'Player 1' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: 'Player 1',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-4',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return game object with the player name #3', () => {
      return request(app.getHttpServer())
        .post('/setName')
        .send({ socketId: 'socketId-3', name: 'Player 3' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: 'Player 1',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: 'Player 3',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-4',
              name: '',
              state: PlayerState.SelectingName,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return game object with the player name #4', () => {
      return request(app.getHttpServer())
        .post('/setName')
        .send({ socketId: 'socketId-4', name: 'Player 4' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: 'Player 1',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-2',
              name: '',
              state: PlayerState.SelectingName,
            },
            {
              socketId: 'socketId-3',
              name: 'Player 3',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-4',
              name: 'Player 4',
              state: PlayerState.Ready,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return game object with the player name #2', () => {
      return request(app.getHttpServer())
        .post('/setName')
        .send({ socketId: 'socketId-2', name: 'Player 2' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: 'Player 1',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-2',
              name: 'Player 2',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-3',
              name: 'Player 3',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-4',
              name: 'Player 4',
              state: PlayerState.Ready,
            },
          ],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });
  });

  describe('startRound', () => {
    it('Should return game object with the writing word game state #1', () => {
      return request(app.getHttpServer())
        .post('/startRound')
        .send({ socketId: 'socketId-1', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: 'Player 1',
              state: PlayerState.NotReady,
            },
            {
              socketId: 'socketId-2',
              name: 'Player 2',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-3',
              name: 'Player 3',
              state: PlayerState.Ready,
            },
            {
              socketId: 'socketId-4',
              name: 'Player 4',
              state: PlayerState.Ready,
            },
          ],
          bluff: {
            socketId: 'socketId-1',
            name: 'Player 1',
            state: PlayerState.NotReady,
          },
          gameState: GameState.WritingWord,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return error if game state is not lobby', () => {
      return request(app.getHttpServer())
        .post('/startRound')
        .send({ socketId: 'socketId-2', room: '1234' })
        .expect(403);
    });

    it('Should return error if player is not found', () => {
      return request(app.getHttpServer())
        .post('/startRound')
        .send({ socketId: 'socketId-12345', room: '1234' })
        .expect(404);
    });
  });

  describe('setWord', () => {
    it('Should return error if player is not bluff', () => {
      return request(app.getHttpServer())
        .post('/setWord')
        .send({ socketId: 'socketId-2', word: 'goofy word' })
        .expect(403);
    });

    it('Should return error if player is not found', () => {
      return request(app.getHttpServer())
        .post('/setWord')
        .send({ socketId: 'socketId-2222', word: 'goofy word' })
        .expect(404);
    });

    it('Should return game object with the given word and update game and player states', () => {
      return request(app.getHttpServer())
        .post('/setWord')
        .send({ socketId: 'socketId-1', word: 'Funny word' })
        .expect(201, {
          room: '1234',
          players: [
            {
              socketId: 'socketId-1',
              name: 'Player 1',
              state: PlayerState.NotReady,
            },
            {
              socketId: 'socketId-2',
              name: 'Player 2',
              state: PlayerState.NotReady,
            },
            {
              socketId: 'socketId-3',
              name: 'Player 3',
              state: PlayerState.NotReady,
            },
            {
              socketId: 'socketId-4',
              name: 'Player 4',
              state: PlayerState.NotReady,
            },
          ],
          bluff: {
            socketId: 'socketId-1',
            name: 'Player 1',
            state: PlayerState.NotReady,
          },
          gameState: GameState.WritingDefinition,
          word: 'Funny word',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });

    it('Should return error if game state is not writing word', () => {
      return request(app.getHttpServer())
        .post('/setWord')
        .send({ socketId: 'socketId-1', word: 'goofy word' })
        .expect(403);
    });
  });
});
