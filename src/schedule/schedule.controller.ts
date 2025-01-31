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
import { ScheduleProvider } from './schedule.provider';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { UpdateScheduleDto } from './dto/update.schedule.dto';
import { SCHEDULE_NOT_FOUND_ERROR_MSG } from './schedule.constants';

@Controller('schedule')
export class ScheduleController {
  private scheduleProvider: ScheduleProvider;
  constructor(scheduleProvider: ScheduleProvider) {
    this.scheduleProvider = scheduleProvider;
  }
  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return await this.scheduleProvider.create(dto);
  }
  @Get(':id')
  async get(@Param('id') scheduleProvider: string) {
    const response = await this.scheduleProvider.findById(scheduleProvider);
    if (!response) {
      throw new NotFoundException(SCHEDULE_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Put(':id')
  async update(
    @Param('id') scheduleProvider: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    const response = await this.scheduleProvider.updateById(
      scheduleProvider,
      dto,
    );
    if (!response) {
      throw new NotFoundException(SCHEDULE_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Delete(':id')
  async delete(@Param('id') scheduleProvider: string) {
    const response = await this.scheduleProvider.deleteById(scheduleProvider);
    if (!response) {
      throw new NotFoundException(SCHEDULE_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
}
