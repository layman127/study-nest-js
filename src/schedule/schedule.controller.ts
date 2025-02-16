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
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.provider';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { UpdateScheduleDto } from './dto/update.schedule.dto';
import {
  SCHEDULE_NOT_FOUND_ERROR_MSG,
  WRONG_MONTH_NUMBER_MSG,
} from './schedule.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@UseGuards(JwtAuthGuard, new RoleGuard(['admin', 'user']))
@Controller('schedule')
export class ScheduleController {
  private scheduleService: ScheduleService;
  constructor(scheduleProvider: ScheduleService) {
    this.scheduleService = scheduleProvider;
  }
  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return await this.scheduleService.create(dto);
  }
  @Get(':id')
  async get(@Param('id') scheduleProvider: string) {
    const response = await this.scheduleService.findById(scheduleProvider);
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
    const response = await this.scheduleService.updateById(
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
    const response = await this.scheduleService.deleteById(scheduleProvider);
    if (!response) {
      throw new NotFoundException(SCHEDULE_NOT_FOUND_ERROR_MSG);
    }
    return response;
  }
  @Get('statistic/:month')
  @UseGuards(new RoleGuard(['admin']))
  async getStatistic(@Param('month', ParseIntPipe) month: number) {
    if (month > 12 || month < 1)
      throw new BadRequestException(WRONG_MONTH_NUMBER_MSG);
    return await this.scheduleService.getStatisticByMonth(month);
  }
}
