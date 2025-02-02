import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomProvider } from './room.provider';
import { RoomController } from './room.controller';
import { RoomModel, RoomSchema } from './room.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: RoomModel.name, schema: RoomSchema }]),
  ],
  providers: [RoomProvider],
  controllers: [RoomController],
})
export class RoomModule {}
