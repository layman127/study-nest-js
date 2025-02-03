import { IsNumber, IsString, IsBoolean, IsEnum, Min } from 'class-validator';
import { ROOM_NUMBER_LESS_1_MSG, WRONG_ROOM_TYPE_MSG } from '../room.constants';
export class UpdateRoomDto {
  @IsNumber()
  @Min(1, { message: ROOM_NUMBER_LESS_1_MSG })
  number?: number;
  @IsString()
  price?: string;
  @IsEnum(['simple', 'double', 'royal', 'luxury'], {
    message: WRONG_ROOM_TYPE_MSG,
  })
  type?: 'simple' | 'double' | 'royal' | 'luxury';
  @IsBoolean()
  conditioner?: boolean;
}
