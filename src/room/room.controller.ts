import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.provider';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { ROOM_NOT_FOUND_ERROR_MSG } from './room.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
@UseGuards(JwtAuthGuard, new RoleGuard(['admin']))
@Controller('room')
export class RoomController {
  private roomService: RoomService;
  constructor(roomProvider: RoomService) {
    this.roomService = roomProvider;
  }
  @Post()
  async create(@Body() dto: CreateRoomDto) {
    return await this.roomService.create(dto);
  }
  @Get(':id')
  async get(@Param('id') roomId: string) {
    const response = await this.roomService.findById(roomId);
    if (!response) {
      throw new NotFoundException(ROOM_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Put(':id')
  async update(@Param('id') roomId: string, @Body() dto: UpdateRoomDto) {
    const response = await this.roomService.updateById(roomId, dto);
    if (!response) {
      throw new NotFoundException(ROOM_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Delete(':id')
  async delete(@Param('id') roomId: string) {
    const response = await this.roomService.deleteById(roomId);
    if (!response) {
      throw new NotFoundException(ROOM_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
}
