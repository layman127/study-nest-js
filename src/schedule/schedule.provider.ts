import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ScheduleModel } from './schedule.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScheduleDto } from './dto/create.schedule.dto';
import { UpdateScheduleDto } from './dto/update.schedule.dto';
import {
  SCHEDULE_DATE_NOT_AVAILABLE,
  TG_MSG_CREATE_SHEDULE,
  TG_MSG_DELETE_SHEDULE,
  TG_MSG_UPDATE_SHEDULE,
} from './schedule.constants';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class ScheduleService {
  private sheduleModel: Model<ScheduleModel>;
  private telegramService: TelegramService;
  constructor(
    @InjectModel(ScheduleModel.name) scheduleModel: Model<ScheduleModel>,
    telegramService: TelegramService,
  ) {
    this.sheduleModel = scheduleModel;
    this.telegramService = telegramService;
  }
  async create(dto: CreateScheduleDto) {
    await this.checkForDateAvailabity(
      dto.roomNumber,
      new Date(dto.dateCheckIn),
      new Date(dto.dateCheckOut),
    );
    const message = TG_MSG_CREATE_SHEDULE(dto);
    await this.telegramService.sendMessage(message);
    return await this.sheduleModel.create(dto);
  }
  async findById(sheduleId: string) {
    return await this.sheduleModel.findById(sheduleId).exec();
  }
  async updateById(sheduleId: string, dto: UpdateScheduleDto) {
    const updatedSchedule = await this.sheduleModel
      .findByIdAndUpdate(sheduleId, dto, { new: true })
      .exec();
    if (!updatedSchedule) return updatedSchedule;
    const message = TG_MSG_UPDATE_SHEDULE(dto);
    await this.telegramService.sendMessage(message);
    return updatedSchedule;
  }
  async deleteById(sheduleId: string) {
    const deletedSchedule: ScheduleModel | null =
      await this.sheduleModel.findByIdAndDelete(sheduleId);
    if (!deletedSchedule) {
      return deletedSchedule;
    }
    const message = TG_MSG_DELETE_SHEDULE(deletedSchedule);
    await this.telegramService.sendMessage(message);
    return deletedSchedule;
  }
  async getStatisticByMonth(month: number) {
    return await this.sheduleModel.aggregate([
      {
        $match: {
          $expr: {
            $or: [
              { $eq: [{ $month: '$dateCheckIn' }, month] },
              { $eq: [{ $month: '$dateCheckOut' }, month] },
              {
                $and: [
                  { $lt: [{ $month: '$dateCheckIn' }, month] },
                  { $gt: [{ $month: '$dateCheckOut' }, month] },
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          daysInMonth: {
            $switch: {
              branches: [
                { case: { $eq: [month, 2] }, then: 28 },
                { case: { $in: [month, [4, 6, 9, 11]] }, then: 30 },
              ],
              default: 31,
            },
          },
          checkInDay: { $dayOfMonth: '$dateCheckIn' },
          checkOutDay: { $dayOfMonth: '$dateCheckOut' },
        },
      },
      {
        $project: {
          roomNumber: 1,
          daysArray: {
            $range: [
              {
                $cond: [
                  { $lt: [{ $month: '$dateCheckIn' }, month] },
                  1,
                  '$checkInDay',
                ],
              },
              {
                $cond: [
                  { $gt: [{ $month: '$dateCheckOut' }, month] },
                  '$daysInMonth',
                  '$checkOutDay',
                ],
              },
            ],
          },
        },
      },
      {
        $unwind: '$daysArray',
      },
      {
        $group: {
          _id: '$roomNumber',
          occupiedDays: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          roomNumber: '$_id',
          occupiedDays: 1,
        },
      },
      {
        $sort: { occupiedDays: 1 },
      },
    ]);
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
