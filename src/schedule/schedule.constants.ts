import { CreateScheduleDto } from './dto/create.schedule.dto';
import { UpdateScheduleDto } from './dto/update.schedule.dto';
import { ScheduleModel } from './schedule.model';

export const SCHEDULE_NOT_FOUND_ERROR_MSG =
  'Бронирование с таким ID не найдено';
export const SCHEDULE_DATE_NOT_AVAILABLE =
  'Указанные даты забронированы другим гостем';
export const SCHEDULE_ROOM_NUMBER_LESS_1_MSG =
  'Номер комнаты не может быть меньше или равен 0';
export const SCHEDULE_GUEST_NAME_WRONG_LENGTH_MSG =
  'Имя гостя должно было не короче 3 и не длинее 50 символов';
export const WRONG_MONTH_NUMBER_MSG = 'Номер месяца должен быть от 1 до 12';
export const TG_MSG_CREATE_SHEDULE = (dto: CreateScheduleDto): string =>
  `Гость : ${dto.nameGuest} \nзабронировал комнату номер : ${dto.roomNumber} \nна даты ${dto.dateCheckIn} - ${dto.dateCheckOut}`;
export const TG_MSG_UPDATE_SHEDULE = (dto: UpdateScheduleDto): string =>
  `Гость : ${dto.nameGuest} \nизменил бронь на комнату номер : ${dto.roomNumber} \nна даты ${dto.dateCheckIn} - ${dto.dateCheckOut}`;
export const TG_MSG_DELETE_SHEDULE = (scheduleModel: ScheduleModel) =>
  `Гость : ${scheduleModel.nameGuest} \nудалил бронь на комнату номер : ${scheduleModel.roomNumber} \nна даты ${scheduleModel.dateCheckIn} - ${scheduleModel.dateCheckOut}`;
