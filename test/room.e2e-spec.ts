import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRoomDto } from '../src/room/dto/create.room.dto';
import { disconnect, Types } from 'mongoose';
import { ROOM_NOT_FOUND_ERROR_MSG } from '../src/room/room.constants';
import { UpdateRoomDto } from '../src/room/dto/update.room.dto';
const testCreateRoomDto: CreateRoomDto = {
  number: 101,
  price: '1000',
  type: 'simple',
  conditioner: true,
};
const testUpdateRoomDto: UpdateRoomDto = {
  number: 999,
  price: '2000',
  type: 'double',
  conditioner: false,
};
let createdRoomId: string;
describe('RoomAPI (e2e)', () => {
  let app: INestApplication<App>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/room (POST) - success', () =>
    request(app.getHttpServer())
      .post('/room')
      .send(testCreateRoomDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        const { _id, number, price, type, conditioner } = body;
        createdRoomId = _id;
        expect(_id).toBeDefined();
        expect(number).toStrictEqual(testCreateRoomDto.number);
        expect(price).toStrictEqual(testCreateRoomDto.price);
        expect(type).toStrictEqual(testCreateRoomDto.type);
        expect(conditioner).toStrictEqual(testCreateRoomDto.conditioner);
      }));
  it('/room/:id (GET) - success', () =>
    request(app.getHttpServer())
      .get('/room/' + createdRoomId)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, number, price, type, conditioner } = body;
        expect(_id).toStrictEqual(createdRoomId);
        expect(number).toStrictEqual(testCreateRoomDto.number);
        expect(price).toStrictEqual(testCreateRoomDto.price);
        expect(type).toStrictEqual(testCreateRoomDto.type);
        expect(conditioner).toStrictEqual(testCreateRoomDto.conditioner);
      }));
  it('/room/:id (GET) - fail - notFound', () =>
    request(app.getHttpServer())
      .get('/room/' + new Types.ObjectId())
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(ROOM_NOT_FOUND_ERROR_MSG);
      }));
  it('/room/:id (PUT) - success', () =>
    request(app.getHttpServer())
      .put('/room/' + createdRoomId)
      .expect(200)
      .send(testUpdateRoomDto)
      .then(({ body }: request.Response) => {
        const { _id, number, price, type, conditioner } = body;
        expect(_id).toStrictEqual(createdRoomId);
        expect(number).toStrictEqual(testUpdateRoomDto.number);
        expect(price).toStrictEqual(testUpdateRoomDto.price);
        expect(type).toStrictEqual(testUpdateRoomDto.type);
        expect(conditioner).toStrictEqual(testUpdateRoomDto.conditioner);
      }));
  it('/room/:id (PUT) - fail - notFound', () =>
    request(app.getHttpServer())
      .put('/room/' + new Types.ObjectId())
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(ROOM_NOT_FOUND_ERROR_MSG);
      }));
  it('/room/:id (DELETE) - success', () =>
    request(app.getHttpServer())
      .delete('/room/' + createdRoomId)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, number, price, type, conditioner } = body;
        expect(_id).toStrictEqual(createdRoomId);
        expect(number).toStrictEqual(testUpdateRoomDto.number);
        expect(price).toStrictEqual(testUpdateRoomDto.price);
        expect(type).toStrictEqual(testUpdateRoomDto.type);
        expect(conditioner).toStrictEqual(testUpdateRoomDto.conditioner);
      }));
  it('/room/:id (DELETE) - fail - notFound', () =>
    request(app.getHttpServer())
      .delete('/room/' + createdRoomId)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(ROOM_NOT_FOUND_ERROR_MSG);
      }));
  afterAll(() => disconnect());
});
