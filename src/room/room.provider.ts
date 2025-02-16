import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomModel } from './room.model';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';

@Injectable()
export class RoomService {
  private roomModel: Model<RoomModel>;
  constructor(@InjectModel(RoomModel.name) roomModel: Model<RoomModel>) {
    this.roomModel = roomModel;
  }
  async create(dto: CreateRoomDto) {
    return this.roomModel.create(dto);
  }
  async findById(roomId: string) {
    return this.roomModel.findById(roomId).exec();
  }
  async updateById(roomId: string, dto: UpdateRoomDto) {
    return this.roomModel.findByIdAndUpdate(roomId, dto, { new: true }).exec();
  }
  async deleteById(roomId: string) {
    return this.roomModel.findByIdAndDelete(roomId).exec();
  }
}
