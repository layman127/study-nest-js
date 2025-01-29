import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleProvider } from './schedule.provider';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleProvider],
})
export class ScheduleModule {}
