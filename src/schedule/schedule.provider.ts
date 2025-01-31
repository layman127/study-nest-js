import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ScheduleModel } from './schedule.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { UpdateScheduleDto } from './dto/update.schedule.dto';
import { SCHEDULE_DATE_NOT_AVAILABLE } from './schedule.constants';

@Injectable()
export class ScheduleProvider {
  private sheduleModel: Model<ScheduleModel>;
  constructor(
    @InjectModel(ScheduleModel.name) scheduleModel: Model<ScheduleModel>,
  ) {
    this.sheduleModel = scheduleModel;
  }
  async create(dto: CreateScheduleDto) {
    await this.checkForDateAvailabity(
      dto.roomNumber,
      new Date(dto.dateCheckIn),
      new Date(dto.dateCheckOut),
    );
    return this.sheduleModel.create(dto);
  }
  async findById(sheduleId: string) {
    return this.sheduleModel.findById(sheduleId).exec();
  }
  async updateById(sheduleId: string, dto: UpdateScheduleDto) {
    return this.sheduleModel
      .findByIdAndUpdate(sheduleId, dto, { new: true })
      .exec();
  }
  async deleteById(sheduleId: string) {
    return this.sheduleModel.findByIdAndDelete(sheduleId);
  }
  private async checkForDateAvailabity(
    roomNumber: number,
    dateCheckIn: Date,
    dateCheckOut: Date,
  ) {
    const allRoomsSchedules = await this.sheduleModel.find({
      roomNumber,
    });
    for (const oneSchedule of allRoomsSchedules) {
      if (
        dateCheckIn < oneSchedule.dateCheckOut &&
        dateCheckOut > oneSchedule.dateCheckIn
      ) {
        throw new BadRequestException(SCHEDULE_DATE_NOT_AVAILABLE);
      }
    }
  }
}
