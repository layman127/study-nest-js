import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import {
  SCHEDULE_NOT_FOUND_ERROR_MSG,
  SCHEDULE_DATE_NOT_AVAILABLE,
  SCHEDULE_GUEST_NAME_WRONG_LENGTH_MSG,
  SCHEDULE_ROOM_NUMBER_LESS_1_MSG,
} from '../src/schedule/schedule.constants';
import { CreateScheduleDto } from '../src/schedule/dto/create.schedule.dto';
import { UpdateScheduleDto } from '../src/schedule/dto/update.schedule.dto';
import { CredentialsUserDto } from 'src/auth/dto/login.auth.dto';
const testCreateScheduleDto: CreateScheduleDto = {
  nameGuest: 'Иван Иванович Иванов',
  dateCheckIn: new Date('2025-01-01T00:00:00Z').toISOString(),
  dateCheckOut: new Date('2025-12-31T23:59:00Z').toISOString(),
  roomNumber: 101,
};
const testUpdateScheduleDto: Required<UpdateScheduleDto> = {
  nameGuest: 'Петр Петрович Петров',
  dateCheckIn: new Date('2025-02-28T00:00:00Z').toISOString(),
  dateCheckOut: new Date('2025-11-30T23:59:00Z').toISOString(),
  roomNumber: 202,
};
const testDatesForFailcCreateSchedule: UpdateScheduleDto = {
  nameGuest: 'Сергей Сергеевич Сергеев',
  dateCheckIn: new Date('2025-05-28T00:00:00Z').toISOString(),
  dateCheckOut: new Date('2025-06-30T23:59:00Z').toISOString(),
  roomNumber: 101,
};
const loginDto: CredentialsUserDto = {
  login: 'admin@test.com',
  password: '1',
};
let createdScheduleId: string;
describe('ScheduleAPI (e2e)', () => {
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

  it('/schedule (POST) - success', () =>
    request(app.getHttpServer())
      .post('/schedule')
      .send(testCreateScheduleDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .then(({ body }: request.Response) => {
        const { _id, nameGuest, dateCheckIn, dateCheckOut, roomNumber } = body;
        createdScheduleId = _id;
        expect(_id).toBeDefined();
        expect(nameGuest).toStrictEqual(testCreateScheduleDto.nameGuest);
        expect(dateCheckIn).toStrictEqual(testCreateScheduleDto.dateCheckIn);
        expect(dateCheckOut).toStrictEqual(testCreateScheduleDto.dateCheckOut);
        expect(roomNumber).toStrictEqual(testCreateScheduleDto.roomNumber);
      }));
  it('/schedule (POST) - fail - dateIsNotAvaible', () =>
    request(app.getHttpServer())
      .post('/schedule')
      .send(testDatesForFailcCreateSchedule)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(SCHEDULE_DATE_NOT_AVAILABLE);
      }));
  it('/schedule (POST) - fail - dateIsNotAvaible', () =>
    request(app.getHttpServer())
      .post('/schedule')
      .send({ ...testDatesForFailcCreateSchedule, nameGuest: '01' })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body.message[0]).toStrictEqual(
          SCHEDULE_GUEST_NAME_WRONG_LENGTH_MSG,
        );
      }));
  it('/schedule (POST) - fail - dateIsNotAvaible', () =>
    request(app.getHttpServer())
      .post('/schedule')
      .send({ ...testDatesForFailcCreateSchedule, roomNumber: 0 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body.message[0]).toStrictEqual(SCHEDULE_ROOM_NUMBER_LESS_1_MSG);
      }));
  it('/schedule/:id (GET) - success', () =>
    request(app.getHttpServer())
      .get('/schedule/' + createdScheduleId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, nameGuest, dateCheckIn, dateCheckOut, roomNumber } = body;
        expect(_id).toStrictEqual(createdScheduleId);
        expect(nameGuest).toStrictEqual(testCreateScheduleDto.nameGuest);
        expect(dateCheckIn).toStrictEqual(testCreateScheduleDto.dateCheckIn);
        expect(dateCheckOut).toStrictEqual(testCreateScheduleDto.dateCheckOut);
        expect(roomNumber).toStrictEqual(testCreateScheduleDto.roomNumber);
      }));
  it('/schedule/:id (GET) - fail - notFound', () =>
    request(app.getHttpServer())
      .get('/schedule/' + new Types.ObjectId())
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(SCHEDULE_NOT_FOUND_ERROR_MSG);
      }));
  it('/schedule/:id (PUT) - success', () =>
    request(app.getHttpServer())
      .put('/schedule/' + createdScheduleId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .send(testUpdateScheduleDto)
      .then(({ body }: request.Response) => {
        const { _id, nameGuest, dateCheckIn, dateCheckOut, roomNumber } = body;
        expect(_id).toStrictEqual(createdScheduleId);
        expect(nameGuest).toStrictEqual(testUpdateScheduleDto.nameGuest);
        expect(dateCheckIn).toStrictEqual(testUpdateScheduleDto.dateCheckIn);
        expect(dateCheckOut).toStrictEqual(testUpdateScheduleDto.dateCheckOut);
        expect(roomNumber).toStrictEqual(testUpdateScheduleDto.roomNumber);
      }));
  it('/schedule/:id (PUT) - fail - notFound', () =>
    request(app.getHttpServer())
      .put('/schedule/' + new Types.ObjectId())
      .send(testUpdateScheduleDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(SCHEDULE_NOT_FOUND_ERROR_MSG);
      }));
  it('/schedule/:id (DELETE) - success', () =>
    request(app.getHttpServer())
      .delete('/schedule/' + createdScheduleId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        const { _id, nameGuest, dateCheckIn, dateCheckOut, roomNumber } = body;
        expect(_id).toStrictEqual(createdScheduleId);
        expect(nameGuest).toStrictEqual(testUpdateScheduleDto.nameGuest);
        expect(dateCheckIn).toStrictEqual(testUpdateScheduleDto.dateCheckIn);
        expect(dateCheckOut).toStrictEqual(testUpdateScheduleDto.dateCheckOut);
        expect(roomNumber).toStrictEqual(testUpdateScheduleDto.roomNumber);
      }));
  it('/schedule/:id (DELETE) - fail - notFound', () =>
    request(app.getHttpServer())
      .delete('/schedule/' + createdScheduleId)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(SCHEDULE_NOT_FOUND_ERROR_MSG);
      }));
  afterAll(() => disconnect());
});
