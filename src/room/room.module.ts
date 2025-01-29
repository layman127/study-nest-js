import { Module } from '@nestjs/common';
import { RoomProvider } from './room.provider';
import { RoomController } from './room.controller';

@Module({
  providers: [RoomProvider],
  controllers: [RoomController],
})
export class RoomModule {}
