import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleProvider } from './schedule.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModel, ScheduleSchema } from './schedule.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleModel.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleProvider],
})
export class ScheduleModule {}
