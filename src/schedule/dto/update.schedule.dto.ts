import { IsDateString, IsNumber, IsString, Length, Min } from 'class-validator';
import {
  SCHEDULE_GUEST_NAME_WRONG_LENGTH_MSG,
  SCHEDULE_ROOM_NUMBER_LESS_1_MSG,
} from '../schedule.constants';

export class UpdateScheduleDto {
  @IsString()
  @Length(3, 50, {
    message: SCHEDULE_GUEST_NAME_WRONG_LENGTH_MSG,
  })
  nameGuest?: string;
  @IsDateString()
  dateCheckIn?: string;
  @IsDateString()
  dateCheckOut?: string;
  @IsNumber()
  @Min(1, { message: SCHEDULE_ROOM_NUMBER_LESS_1_MSG })
  roomNumber?: number;
}
