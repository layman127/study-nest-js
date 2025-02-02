import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { RoomProvider } from './room.provider';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { ROOM_NOT_FOUND_ERROR_MSG } from './room.constants';
@Controller('room')
export class RoomController {
  private roomProvider: RoomProvider;
  constructor(roomProvider: RoomProvider) {
    this.roomProvider = roomProvider;
  }
  @Post()
  async create(@Body() dto: CreateRoomDto) {
    return await this.roomProvider.create(dto);
  }
  @Get(':id')
  async get(@Param('id') roomId: string) {
    const response = await this.roomProvider.findById(roomId);
    if (!response) {
      throw new NotFoundException(ROOM_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Put(':id')
  async update(@Param('id') roomId: string, @Body() dto: UpdateRoomDto) {
    const response = await this.roomProvider.updateById(roomId, dto);
    if (!response) {
      throw new NotFoundException(ROOM_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Delete(':id')
  async delete(@Param('id') roomId: string) {
    const response = await this.roomProvider.deleteById(roomId);
    if (!response) {
      throw new NotFoundException(ROOM_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
}
