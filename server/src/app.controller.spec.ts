import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket.gateway';
import * as request from 'supertest';

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
          players: [{ socketId: 'socketId-1', name: '', state: 0 }],
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
          players: [{ socketId: 'socketId-0', name: '', state: 0 }],
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
            { socketId: 'socketId-1', name: '', state: 0 },
            { socketId: 'socketId-2', name: '', state: 0 },
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
            { socketId: 'socketId-1', name: '', state: 0 },
            { socketId: 'socketId-2', name: '', state: 0 },
            { socketId: 'socketId-3', name: '', state: 0 },
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
            { socketId: 'socketId-1', name: '', state: 0 },
            { socketId: 'socketId-2', name: '', state: 0 },
            { socketId: 'socketId-3', name: '', state: 0 },
            { socketId: 'socketId-4', name: '', state: 0 },
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

  it('Should return error if game is not found', () => {
    return request(app.getHttpServer())
      .post('/join')
      .send({ socketId: 'socketId-5', room: '4567' })
      .expect(404);
  });
});
