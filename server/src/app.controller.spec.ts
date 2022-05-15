import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket.gateway';
import * as request from 'supertest';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
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
        .mockImplementation(() => '12345');

      return request(app.getHttpServer())
        .post('/create')
        .send({ socketId: 'socketId' })
        .expect(201, {
          room: '12345',
          players: [{ socketId: 'socketId', name: '', state: 0 }],
          gameState: 0,
          word: '',
          definitions: [],
          allDefinitions: [],
          correctDefinitions: [],
          points: [],
        });
    });
  });
});
