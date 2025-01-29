import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ScheduleProvider } from './schedule/schedule.provider';
import { RoomProvider } from './room/room.provider';

@Module({
  imports: [RoomModule, ScheduleModule],
  controllers: [AppController],
  providers: [AppService, ScheduleProvider, RoomProvider],
})
export class AppModule {}
