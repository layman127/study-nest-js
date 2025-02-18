import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomService } from './room.provider';
import { RoomController } from './room.controller';
import { RoomModel, RoomSchema } from './room.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: RoomModel.name, schema: RoomSchema }]),
  ],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
