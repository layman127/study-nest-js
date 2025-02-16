import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateRoomDto } from '../src/room/dto/create.room.dto';
import { disconnect, Types } from 'mongoose';
import {
  ROOM_NOT_FOUND_ERROR_MSG,
  ROOM_NUMBER_LESS_1_MSG,
  WRONG_ROOM_TYPE_MSG,
} from '../src/room/room.constants';
import { UpdateRoomDto } from '../src/room/dto/update.room.dto';
import { CredentialsUserDto } from 'src/auth/dto/login.auth.dto';
const testCreateRoomDto: CreateRoomDto = {
  roomNumber: 101,
  price: '1000',
  type: 'simple',
  conditioner: true,
};
const testUpdateRoomDto: UpdateRoomDto = {
  roomNumber: 999,
  price: '2000',
  type: 'double',
  conditioner: false,
};
const loginDto: CredentialsUserDto = {
  login: 'admin@test.com',
  password: '1',
};
let createdRoomId: string;
describe('RoomAPI (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/room (POST) - success', () =>
    request(app.getHttpServer())
      .post('/room')
      .send(testCreateRoomDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(({ body }: request.Response) => {
        const { _id, roomNumber, price, type, conditioner } = body;
        createdRoomId = _id;
        expect(_id).toBeDefined();
        expect(roomNumber).toStrictEqual(testCreateRoomDto.roomNumber);
        expect(price).toStrictEqual(testCreateRoomDto.price);
        expect(type).toStrictEqual(testCreateRoomDto.type);
        expect(conditioner).toStrictEqual(testCreateRoomDto.conditioner);
      }));
  it('/room (POST) - fail - room number less 1', () =>
    request(app.getHttpServer())
      .post('/room')
      .send({ ...testCreateRoomDto, roomNumber: 0 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body.message[0]).toStrictEqual(ROOM_NUMBER_LESS_1_MSG);
      }));
  it('/room (POST) - fail - wrong room type', () =>
    request(app.getHttpServer())
      .post('/room')
      .send({ ...testCreateRoomDto, type: 'string' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body.message[0]).toStrictEqual(WRONG_ROOM_TYPE_MSG);
      }));
  it('/room/:id (GET) - success', () =>
    request(app.getHttpServer())
      .get('/room/' + createdRoomId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, roomNumber, price, type, conditioner } = body;
        expect(_id).toStrictEqual(createdRoomId);
        expect(roomNumber).toStrictEqual(testCreateRoomDto.roomNumber);
        expect(price).toStrictEqual(testCreateRoomDto.price);
        expect(type).toStrictEqual(testCreateRoomDto.type);
        expect(conditioner).toStrictEqual(testCreateRoomDto.conditioner);
      }));
  it('/room/:id (GET) - fail - notFound', () =>
    request(app.getHttpServer())
      .get('/room/' + new Types.ObjectId())
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(ROOM_NOT_FOUND_ERROR_MSG);
      }));
  it('/room/:id (PUT) - success', () =>
    request(app.getHttpServer())
      .put('/room/' + createdRoomId)
      .send(testUpdateRoomDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, roomNumber, price, type, conditioner } = body;
        expect(_id).toStrictEqual(createdRoomId);
        expect(roomNumber).toStrictEqual(testUpdateRoomDto.roomNumber);
        expect(price).toStrictEqual(testUpdateRoomDto.price);
        expect(type).toStrictEqual(testUpdateRoomDto.type);
        expect(conditioner).toStrictEqual(testUpdateRoomDto.conditioner);
      }));
  it('/room/:id (PUT) - fail - notFound', () =>
    request(app.getHttpServer())
      .put('/room/' + new Types.ObjectId())
      .send(testUpdateRoomDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(ROOM_NOT_FOUND_ERROR_MSG);
      }));
  it('/room/:id (DELETE) - success', () =>
    request(app.getHttpServer())
      .delete('/room/' + createdRoomId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, roomNumber, price, type, conditioner } = body;
        expect(_id).toStrictEqual(createdRoomId);
        expect(roomNumber).toStrictEqual(testUpdateRoomDto.roomNumber);
        expect(price).toStrictEqual(testUpdateRoomDto.price);
        expect(type).toStrictEqual(testUpdateRoomDto.type);
        expect(conditioner).toStrictEqual(testUpdateRoomDto.conditioner);
      }));
  it('/room/:id (DELETE) - fail - notFound', () =>
    request(app.getHttpServer())
      .delete('/room/' + createdRoomId)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(ROOM_NOT_FOUND_ERROR_MSG);
      }));
  afterAll(() => disconnect());
});
