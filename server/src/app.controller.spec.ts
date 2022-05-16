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
        .send({ socketId: 'socketId' })
        .expect(201, {
          room: '1234',
          players: [{ socketId: 'socketId', name: '', state: 0 }],
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
        .send({ socketId: 'socketId2' })
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
        .send({ socketId: 'socketId3' })
        .expect(201, {
          room: '2345',
          players: [{ socketId: 'socketId3', name: '', state: 0 }],
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
    it('Should return new game object with joined player', () => {
      return request(app.getHttpServer())
        .post('/join')
        .send({ socketId: 'socketId4', room: '1234' })
        .expect(201, {
          room: '1234',
          players: [
            { socketId: 'socketId', name: '', state: 0 },
            { socketId: 'socketId4', name: '', state: 0 },
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
      .send({ socketId: 'socketId5', room: '4567' })
      .expect(404);
  });
});
